import type { ActionFunctionArgs } from "react-router";
import { extractTextFromPDF, validatePDFFile } from "~/utils/pdfparse.server";
import { generateText } from "~/utils/ai.server";
import { prisma } from "~/utils/prisma";
import { getAuthenticatedUser } from "~/utils/auth.server";

// Generate unique code for material
const generateMaterialCode = (title: string): string => {
  const random = Math.random().toString(36).slice(2, 6);
  return `${title.slice(0, 2)}-${random}`.toUpperCase();
};

interface AIGeneratedContent {
  title: string;
  description: string;
  content: string;
  flashcards: Array<{
    question: string;
    answer: string;
  }>;
}

export async function MateriTambahkanAction({ request }: ActionFunctionArgs) {
  try {
    // Get authenticated user
    const user = await getAuthenticatedUser(request);
    if (!user || !user.email) {
      return Response.json(
        { success: false, error: "User not authenticated or email not found" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("pdf-file") as File;

    if (!file) {
      return Response.json(
        { success: false, error: "Tidak ada file yang diunggah" },
        { status: 400 }
      );
    }

    const validationError = validatePDFFile(file);
    if (validationError) {
      return Response.json(
        { success: false, error: validationError },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await extractTextFromPDF(buffer, file.name);

    if (!result.success) {
      return Response.json(result, { status: 500 });
    }

    console.log(`Successfully extracted text from ${file.name}:`, {
      pages: result.data?.totalPages,
      textLength: result.data?.extractedText.length,
      items: result.data?.metadata.textItems,
    });

    // Create comprehensive prompt for Gemini
    const prompt = `
    You are an expert educational content creator. Based on the following extracted PDF text, generate comprehensive learning materials.

    **EXTRACTED TEXT:**
    ${result.data?.extractedText}

    **INSTRUCTIONS:**
    Please generate the following content and return it as a valid JSON object with this exact structure:

    {
      "title": "A concise, descriptive title (max 100 characters)",
      "description": "A brief summary describing what this material covers (max 300 characters)",
      "content": "A comprehensive, well-structured content in GitHub-flavored Markdown format. Include headers, bullet points, code blocks if applicable, and organize the information in a clear, educational manner. This should be a complete study guide.",
      "flashcards": [
        {
          "question": "A clear, specific question about the material",
          "answer": "A comprehensive answer that helps with learning"
        }
      ]
    }

    **REQUIREMENTS:**
    - Use Indonesian language (translate the content, description, and title to Indonesian)
    - Title: Should be clear and educational (max 100 chars)
    - Description: Should summarize the key learning objectives (max 300 chars)
    - Content: Use proper Markdown formatting with headers (##, ###), lists, emphasis, code blocks when needed. Make it comprehensive and educational.
    - Flashcards: Generate 8-12 high-quality flashcards covering key concepts, definitions, important facts, and practical applications from the material. Questions should be varied (definitions, explanations, applications, comparisons).

    **IMPORTANT JSON FORMATTING:**
    - Ensure all newlines in content are properly escaped as \\n
    - Escape all quotes as \\"
    - Escape all backslashes as \\\\
    - Do not include any unescaped control characters

    Return ONLY the JSON object, no additional text or formatting.
    `;

    const aiResponse = await generateText(prompt);

    // Clean and parse AI response (remove markdown code blocks if present)
    let generatedContent: AIGeneratedContent;
    try {
      let cleanedResponse = aiResponse.trim();

      // Remove markdown code blocks if present
      if (cleanedResponse.startsWith("```json")) {
        cleanedResponse = cleanedResponse
          .replace(/^```json\s*/, "")
          .replace(/\s*```$/, "");
      } else if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse
          .replace(/^```\s*/, "")
          .replace(/\s*```$/, "");
      }

      generatedContent = JSON.parse(cleanedResponse);
    } catch (error) {
      console.error("Error parsing AI response:", error);
      console.log(
        "AI Response (first 500 chars):",
        aiResponse.substring(0, 500)
      );

      // Try alternative approach: sanitize and try again
      try {
        let cleanedResponse = aiResponse.trim();

        // Remove markdown code blocks
        if (cleanedResponse.startsWith("```json")) {
          cleanedResponse = cleanedResponse
            .replace(/^```json\s*/, "")
            .replace(/\s*```$/, "");
        } else if (cleanedResponse.startsWith("```")) {
          cleanedResponse = cleanedResponse
            .replace(/^```\s*/, "")
            .replace(/\s*```$/, "");
        }

        // Extract just the JSON object part
        const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error("No JSON object found in response");
        }

        // Take the JSON and properly escape control characters
        let jsonContent = jsonMatch[0];

        // Use a more robust approach: parse character by character and fix issues
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
            // Handle control characters inside strings
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
                // Check for other control characters
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

        generatedContent = JSON.parse(fixedJson);
      } catch (secondError) {
        console.error("Second parsing attempt failed:", secondError);
        return Response.json(
          {
            success: false,
            error:
              "Failed to parse AI-generated content after multiple attempts",
          },
          { status: 500 }
        );
      }
    }

    // Validate generated content
    if (
      !generatedContent.title ||
      !generatedContent.description ||
      !generatedContent.content ||
      !Array.isArray(generatedContent.flashcards)
    ) {
      return Response.json(
        {
          success: false,
          error: "AI-generated content is incomplete or invalid",
        },
        { status: 500 }
      );
    }

    // Generate unique material code
    const materialCode = generateMaterialCode(generatedContent.title);

    // Save to database using transaction for data consistency
    const savedMaterial = await prisma.$transaction(async (tx) => {
      // Create Material
      const material = await tx.material.create({
        data: {
          title: generatedContent.title.slice(0, 100), // Ensure max length
          code: materialCode,
          email: user.email!,
          fileUrl: `uploads/${file.name}`, // You might want to save the actual file and provide real URL
        },
      });

      // Create MaterialContent
      const materialContent = await tx.materialContent.create({
        data: {
          materialId: material.id,
          content: generatedContent.content,
          description: generatedContent.description.slice(0, 300),
        },
      });

      // Create Flashcard
      const flashcard = await tx.flashcard.create({
        data: {
          materialId: material.id,
        },
      });

      // Create FlashcardPages
      const flashcardPages = await Promise.all(
        generatedContent.flashcards.map((card) =>
          tx.flashcardPage.create({
            data: {
              flashcardId: flashcard.id,
              question: card.question,
              answer: card.answer,
            },
          })
        )
      );

      return {
        material,
        materialContent,
        flashcard,
        flashcardPages,
      };
    });

    console.log(
      `Successfully created material: ${savedMaterial.material.code}`
    );

    return Response.json({
      success: true,
      message: "PDF berhasil diproses dan materi pembelajaran telah dibuat",
      data: {
        material: savedMaterial.material,
        materialContent: savedMaterial.materialContent,
        flashcard: {
          ...savedMaterial.flashcard,
          pages: savedMaterial.flashcardPages,
        },
        extractedInfo: {
          fileName: file.name,
          totalPages: result.data?.totalPages,
          textLength: result.data?.extractedText.length,
        },
      },
    });
  } catch (error) {
    console.error("Error processing PDF:", error);
    return Response.json(
      {
        success: false,
        error: "Terjadi kesalahan internal saat memproses file",
      },
      { status: 500 }
    );
  }
}
