import type { ActionFunctionArgs } from "react-router";
import { generateText } from "~/utils/ai.server";
import { prisma } from "~/utils/prisma";
import { getAuthenticatedUser } from "~/utils/auth.server";

interface AIGeneratedFlashcards {
  flashcards: Array<{
    question: string;
    answer: string;
  }>;
}

export async function MaterialsAction({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const action = formData.get("action") as string;
    const materialId = formData.get("materialId") as string;

    if (action === "regenerate-flashcards") {
      const user = await getAuthenticatedUser(request);
      if (!user || !user.email) {
        return Response.json(
          { success: false, error: "User not authenticated" },
          { status: 401 }
        );
      }

      if (!materialId) {
        return Response.json(
          { success: false, error: "Material ID is required" },
          { status: 400 }
        );
      }

      const material = await prisma.material.findFirst({
        where: {
          id: materialId,
          email: user.email,
        },
        include: {
          materialContent: true,
          flashcard: {
            include: {
              flashcardPage: true,
            },
          },
        },
      });

      if (!material) {
        return Response.json(
          { success: false, error: "Material not found or access denied" },
          { status: 404 }
        );
      }

      if (!material.materialContent) {
        return Response.json(
          { success: false, error: "Material content not found" },
          { status: 404 }
        );
      }

      const prompt = `
      You are an expert educational content creator. Based on the following learning material content, generate high-quality flashcards for studying.

      **LEARNING MATERIAL CONTENT:**
      ${material.materialContent.content}

      **INSTRUCTIONS:**
      Please generate flashcards and return them as a valid JSON object with this exact structure:

      {
        "flashcards": [
          {
            "question": "A clear, specific question about the material",
            "answer": "A comprehensive answer that helps with learning"
          }
        ]
      }

      **REQUIREMENTS:**
      - Generate 8-12 high-quality flashcards covering key concepts, definitions, important facts, and practical applications from the material
      - Questions should be varied (definitions, explanations, applications, comparisons)
      - Make questions clear and specific
      - Provide comprehensive answers that help with learning
      - Focus on the most important concepts from the material

      **IMPORTANT JSON FORMATTING:**
      - Ensure all newlines in answers are properly escaped as \\n
      - Escape all quotes as \\"
      - Escape all backslashes as \\\\
      - Do not include any unescaped control characters

      Return ONLY the JSON object, no additional text or formatting.
      `;

      const aiResponse = await generateText(prompt);

      let generatedFlashcards: AIGeneratedFlashcards;
      try {
        let cleanedResponse = aiResponse.trim();

        if (cleanedResponse.startsWith("```json")) {
          cleanedResponse = cleanedResponse
            .replace(/^```json\s*/, "")
            .replace(/\s*```$/, "");
        } else if (cleanedResponse.startsWith("```")) {
          cleanedResponse = cleanedResponse
            .replace(/^```\s*/, "")
            .replace(/\s*```$/, "");
        }

        generatedFlashcards = JSON.parse(cleanedResponse);
      } catch (error) {
        console.error("Error parsing AI response:", error);

        try {
          let cleanedResponse = aiResponse.trim();

          if (cleanedResponse.startsWith("```json")) {
            cleanedResponse = cleanedResponse
              .replace(/^```json\s*/, "")
              .replace(/\s*```$/, "");
          } else if (cleanedResponse.startsWith("```")) {
            cleanedResponse = cleanedResponse
              .replace(/^```\s*/, "")
              .replace(/\s*```$/, "");
          }

          const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
          if (!jsonMatch) {
            throw new Error("No JSON object found in response");
          }

          let jsonContent = jsonMatch[0];

          let fixedJson = "";
          let inString = false;
          let escapeNext = false;

          for (let i = 0; i < jsonContent.length; i++) {
            const char = jsonContent[i];

            if (escapeNext) {
              fixedJson += char;
              escapeNext = false;
              continue;
            }

            if (char === "\\") {
              fixedJson += char;
              escapeNext = true;
              continue;
            }

            if (char === '"' && !escapeNext) {
              inString = !inString;
              fixedJson += char;
              continue;
            }

            if (inString) {
              switch (char) {
                case "\n":
                  fixedJson += "\\n";
                  break;
                case "\r":
                  fixedJson += "\\r";
                  break;
                case "\t":
                  fixedJson += "\\t";
                  break;
                case "\b":
                  fixedJson += "\\b";
                  break;
                case "\f":
                  fixedJson += "\\f";
                  break;
                default:
                  if (char.charCodeAt(0) < 32) {
                    fixedJson +=
                      "\\u" + char.charCodeAt(0).toString(16).padStart(4, "0");
                  } else {
                    fixedJson += char;
                  }
                  break;
              }
            } else {
              fixedJson += char;
            }
          }

          generatedFlashcards = JSON.parse(fixedJson);
        } catch (secondError) {
          console.error("Second parsing attempt failed:", secondError);
          return Response.json(
            {
              success: false,
              error:
                "Failed to parse AI-generated flashcards after multiple attempts",
            },
            { status: 500 }
          );
        }
      }

      if (
        !Array.isArray(generatedFlashcards.flashcards) ||
        generatedFlashcards.flashcards.length === 0
      ) {
        return Response.json(
          {
            success: false,
            error: "AI-generated flashcards are invalid or empty",
          },
          { status: 500 }
        );
      }

      const updatedFlashcards = await prisma.$transaction(async (tx) => {
        if (material.flashcard) {
          await tx.flashcardPage.deleteMany({
            where: {
              flashcardId: material.flashcard.id,
            },
          });
        } else {
          await tx.flashcard.create({
            data: {
              materialId: material.id,
            },
          });
        }

        const flashcard = await tx.flashcard.findFirst({
          where: {
            materialId: material.id,
          },
        });

        if (!flashcard) {
          throw new Error("Failed to find or create flashcard");
        }

        const flashcardPages = await Promise.all(
          generatedFlashcards.flashcards.map((card) =>
            tx.flashcardPage.create({
              data: {
                flashcardId: flashcard.id,
                question: card.question,
                answer: card.answer,
              },
            })
          )
        );

        return { flashcard, flashcardPages };
      });

      console.log(
        `Successfully regenerated flashcards for material: ${material.code}`
      );

      return Response.json({
        success: true,
        message: "Flashcards berhasil diperbaharui!",
        data: {
          flashcard: {
            ...updatedFlashcards.flashcard,
            pages: updatedFlashcards.flashcardPages,
          },
          flashcardCount: updatedFlashcards.flashcardPages.length,
        },
      });
    }

    return Response.json(
      { success: false, error: "Unknown action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error in MaterialsAction:", error);
    return Response.json(
      {
        success: false,
        error: "Terjadi kesalahan internal saat memproses permintaan",
      },
      { status: 500 }
    );
  }
}
