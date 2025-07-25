import type { ActionFunctionArgs } from "react-router";
import { ttsClient } from "~/utils/ai.server";

export async function MateriRangkumanAction({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const formData = await request.formData();
    const intent = formData.get("intent") as string;

    if (intent === "generate-tts") {
      const text = formData.get("text") as string;

      if (!text || text.trim().length === 0) {
        return new Response("Text is required", { status: 400 });
      }

      // Limit text length for TTS (Google TTS has a 5000 character limit)
      const maxLength = 4500;
      const processedText =
        text.length > maxLength ? text.substring(0, maxLength) + "..." : text;

      // Configure TTS request
      const ttsRequest = {
        input: { text: processedText },
        voice: {
          languageCode: "id-ID", // Indonesian language
          name: "id-ID-Standard-A", // Female voice
          ssmlGender: "FEMALE" as const,
        },
        audioConfig: {
          audioEncoding: "MP3" as const,
          speakingRate: 1.0,
          pitch: 0.0,
          volumeGainDb: 0.0,
        },
      };

      // Generate speech
      const [response] = await ttsClient.synthesizeSpeech(ttsRequest);

      if (!response.audioContent) {
        return new Response("Failed to generate audio", { status: 500 });
      }

      // Convert audio content to base64 for JSON response
      const audioBuffer = Buffer.from(response.audioContent);
      const audioBase64 = audioBuffer.toString('base64');
      
      return Response.json({
        success: true,
        audioData: audioBase64,
        mimeType: 'audio/mpeg'
      });
    }

    return new Response("Invalid intent", { status: 400 });
  } catch (error) {
    console.error("TTS Error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
