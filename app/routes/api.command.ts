import type { ActionFunctionArgs } from "react-router";
import { llm, speechClient, ttsClient } from "~/utils/ai";

export interface AudioCommandResponse {
  success: boolean;
  transcription?: string;
  command: string;
  description: string;
  ttsAudio?: string;
  audioFormat?: string;
  error?: string;
}

const MODEL = 'gemini-2.0-flash-001';

const COMMAND_MANUAL = `
Available Commands:
"navigate [page_code]" - Navigate to page with code page_code
`;

interface ProcessedCommand {
  command: string;
  description: string;
}

// Function to transcribe audio using Google Speech-to-Text
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
  transcription: string
): Promise<ProcessedCommand> {
  try {
    const prompt = `
You are a command interpreter. Convert the following natural language request into a structured command.

Available Commands Manual:
${COMMAND_MANUAL}

User Request: "${transcription}"

Please respond with a JSON object containing:
1. "command" - The exact command that should be executed (from the manual above)
2. "description" - A simple, clear description of what this command will do

If the request doesn't match any available command, return:
{
  "command": "unknown_command",
  "description": "Command not recognized. Please try again with a supported command."
}

Respond only with valid JSON.
`;

    const result = await llm.models.generateContent({
      model: MODEL,
      contents: prompt,
    });

    const response = await result.response;
    const text = response.text();

    try {
      const parsedResponse = JSON.parse(text);
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
async function generateTTSAudio(text: string): Promise<Buffer> {
  try {
    const request = {
      input: { text },
      voice: {
        languageCode: "en-US",
        name: "en-US-Journey-F", // Use a pleasant voice
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

export async functtion action ({ request }: ActionFunctionArgs): Promise {
  if (request.method !== "POST") {
    return JSON.stringify({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    // Parse multipart form data
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return json({ error: "No audio file provided" }, { status: 400 });
    }

    // Convert File to Buffer
    const audioArrayBuffer = await audioFile.arrayBuffer();
    const audioBuffer = Buffer.from(audioArrayBuffer);

    console.log(
      "Processing audio file:",
      audioFile.name,
      "Size:",
      audioBuffer.length
    );

    // Step 1: Transcribe audio using Google Speech-to-Text
    console.log("Step 1: Transcribing audio...");
    const transcription = await transcribeAudio(audioBuffer);
    console.log("Transcription:", transcription);

    // Step 2: Process command with Gemini AI
    console.log("Step 2: Processing command with AI...");
    const processedCommand = await processCommandWithGemini(transcription);
    console.log("Processed command:", processedCommand);

    // Step 3: Generate TTS audio for the description
    console.log("Step 3: Generating TTS audio...");
    const ttsAudioBuffer = await generateTTSAudio(processedCommand.description);
    console.log("TTS audio generated, size:", ttsAudioBuffer.length);

    // Step 4: Return response with command and audio
    const response = {
      success: true,
      transcription,
      command: processedCommand.command,
      description: processedCommand.description,
      ttsAudio: bufferToBase64(ttsAudioBuffer), // Base64 encoded audio
      audioFormat: "mp3",
    };

    return json(response);
  } catch (error) {
    console.error("API Error:", error);

    return json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        command: "error",
        description: "An error occurred while processing your request.",
      },
      { status: 500 }
    );
  }
};

function bufferToBase64(buffer: Buffer): string {
  return buffer.toString("base64");
}


