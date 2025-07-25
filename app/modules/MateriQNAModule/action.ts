import type { ActionFunctionArgs } from "react-router";
import { generateText } from "~/utils/ai.server";
import { prisma } from "~/utils/prisma";
import { getAuthenticatedUser } from "~/utils/auth.server";

export async function MateriQNAAction( args : ActionFunctionArgs) {
  try {
    const user = await getAuthenticatedUser(args.request);
    const code = args.params?.code;

    if (!user || !user.email || !code) {
      return Response.json(
        { success: false, error: "User not authenticated or missing code" },
        { status: 401 }
      );
    }

    const formData = await args.request.formData();
    const question = formData.get("question") as string;

    if (!question?.trim()) {
      return Response.json(
        { success: false, error: "Question is required" },
        { status: 400 }
      );
    }

    // Get the material and its content
    const material = await prisma.material.findFirst({
      where: {
        code,
        email: user.email,
      },
      include: {
        materialContent: true,
        userQuestion: {
          orderBy: { createdAt: "desc" },
          take: 10, // Get last 10 questions for context
        },
      },
    });

    if (!material) {
      return Response.json(
        { success: false, error: "Material not found" },
        { status: 404 }
      );
    }

    // Build conversation history for context
    const conversationHistory = material.userQuestion
      .reverse() // Show oldest first
      .map((qa) => `Human: ${qa.question}\nAI: ${qa.answer}`)
      .join("\n\n");

    // Create AI prompt with material context
    const prompt = `
You are an AI tutor helping a student understand their learning material. Be helpful, clear, and educational in your responses.

**LEARNING MATERIAL CONTEXT:**
Title: ${material.title}
Content: ${material.materialContent?.content || "No content available"}

**PREVIOUS CONVERSATION:**
${conversationHistory ? conversationHistory + "\n\n" : ""}

**CURRENT QUESTION:**
Human: ${question}

**INSTRUCTIONS:**
- Answer based on the learning material provided above
- Be educational and help the student understand the concepts
- If the question is not related to the material, gently redirect them back to the material
- Keep your answers clear and concise
- Use examples from the material when possible

AI:`;

    const aiResponse = await generateText(prompt);

    // Save the question and answer to database
    const savedQA = await prisma.userQuestion.create({
      data: {
        materialId: material.id,
        question: question.trim(),
        answer: aiResponse.trim(),
      },
    });

    return Response.json({
      success: true,
      data: {
        question: savedQA.question,
        answer: savedQA.answer,
        createdAt: savedQA.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in MateriQNAAction:", error);
    return Response.json(
      {
        success: false,
        error: "Terjadi kesalahan saat memproses pertanyaan",
      },
      { status: 500 }
    );
  }
}
