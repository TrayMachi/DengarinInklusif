import type { ActionFunctionArgs } from "react-router";
import { llm, speechClient, ttsClient } from "~/utils/ai.server";
import { getGreeting } from "~/utils/greetings";
import { getCommands, type MaterialFetch } from "~/utils/prompts";

export interface AudioCommandResponse {
  success: boolean;
  transcription?: string;
  command: string;
  description: string;
  ttsAudio?: string;
  audioFormat?: string;
  error?: string;
}

const MODEL = "gemini-2.0-flash-001";

interface ProcessedCommand {
  command: string;
  description: string;
}

async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  try {
    const audioBytes = bufferToBase64(audioBuffer);

    const request = {
      audio: {
        content: audioBytes,
      },
      config: {
        encoding: "WEBM_OPUS" as const,
        sampleRateHertz: 16000,
        languageCode: "en-US",
        alternativeLanguageCodes: ["id-ID"],
      },
    };

    const [response] = await speechClient.recognize(request);
    const transcription =
      response.results
        ?.map((result) => result.alternatives?.[0]?.transcript)
        .join("\n") || "";

    console.log(response);

    if (!transcription) {
      throw new Error("No transcription received");
    }

    return transcription;
  } catch (error) {
    console.error("Speech-to-Text error:", error);
    throw new Error("Failed to transcribe audio");
  }
}

// Function to process natural language command using Gemini
async function processCommandWithGemini(
  transcription: string,
  pageCode: string,
  materials: MaterialFetch[],
): Promise<ProcessedCommand> {
  try {
    const prompt = `
You are a command interpreter. Convert the following natural language request into a structured command.

${getCommands(pageCode, { materials })}

User Request: "${transcription}"

Current Page Code: "${pageCode}" 

Please respond with a JSON object containing:
1. "command" - The exact command that should be executed (from the manual above)
2. "description" - A simple, clear description of what this command will do

If the request doesn't match any available command, return:
{
  "command": "unknown_command", 
  "description": "Perintah tidak dikenali. Silakan coba lagi dengan perintah yang didukung."
}

Respond only with valid JSON.
`;

    const result = await llm.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    const text = result.text || "";

    try {
      // Extract JSON from markdown code blocks if present
      let jsonText = text.trim();

      // Check if response is wrapped in markdown code blocks
      if (jsonText.startsWith("```json") || jsonText.startsWith("```")) {
        const startMarker = jsonText.indexOf("{");
        const endMarker = jsonText.lastIndexOf("}");

        if (startMarker !== -1 && endMarker !== -1) {
          jsonText = jsonText.substring(startMarker, endMarker + 1);
        }
      }

      const parsedResponse = JSON.parse(jsonText);
      return {
        command: parsedResponse.command || "unknown_command",
        description: parsedResponse.description || "Command processing failed",
      };
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", text);
      throw new Error("Invalid response from AI model");
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to process command with AI");
  }
}

// Function to generate TTS audio
async function generateTTSAudio(
  text: string,
  languageCode: string = "en-US",
): Promise<Buffer> {
  try {
    const request = {
      input: { text },
      voice: {
        languageCode,
        name: "id-ID-Standard-A",
        ssmlGender: "FEMALE" as const,
      },
      audioConfig: {
        audioEncoding: "MP3" as const,
        speakingRate: 1.0,
        pitch: 0.0,
      },
    };

    const [response] = await ttsClient.synthesizeSpeech(request);

    if (!response.audioContent) {
      throw new Error("No audio content received from TTS");
    }

    return Buffer.from(response.audioContent);
  } catch (error) {
    console.error("Text-to-Speech error:", error);
    throw new Error("Failed to generate speech audio");
  }
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    // Parse multipart form data
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;
    const pageCode = formData.get("pageCode") as string;
    const materials = JSON.parse(formData.get("materials") as string);

    if (!audioFile) {
      return Response.json(
        { error: "Audio file is required" },
        { status: 400 },
      );
    }

    // Convert File to Buffer
    const audioArrayBuffer = await audioFile.arrayBuffer();
    const audioBuffer = Buffer.from(audioArrayBuffer);

    console.log(
      "Processing audio file:",
      audioFile.name,
      "Size:",
      audioBuffer.length,
    );

    const transcription = await transcribeAudio(audioBuffer);
    const processedCommand = await processCommandWithGemini(
      transcription,
      pageCode,
      materials,
    );

    let text: string;

    console.log(processedCommand);
    console.log(pageCode);
    console.log(getGreeting(pageCode));

    if (processedCommand.command === "read") {
      if (pageCode !== "material") {
        text = getGreeting(pageCode) || "";
      } else {
        text = getGreeting(pageCode, materials);
      }
    } else {
      text = processedCommand.description;
    }

    const ttsAudioBuffer = await generateTTSAudio(text);

    // Step 4: Return response with command and audio
    const response = {
      success: true,
      transcription,
      command: processedCommand.command,
      description: processedCommand.description,
      ttsAudio: bufferToBase64(ttsAudioBuffer), // Base64 encoded audio
      audioFormat: "mp3",
    };

    return Response.json(response, { status: 200 });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        command: "unknown_command",
        description: "An error occurred while processing your request.",
      },
      {
        status: 500,
      },
    );
  }
}

function bufferToBase64(buffer: Buffer): string {
  return buffer.toString("base64");
}
