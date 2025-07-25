import type { ActionFunctionArgs } from "react-router";
import { ttsClient } from "~/utils/ai.server";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const { text, languageCode = "id-ID" } = await request.json();

    if (!text) {
      return Response.json({ error: "Text is required" }, { status: 400 });
    }

    const ttsRequest = {
      input: { text },
      voice: {
        languageCode,
        name: languageCode === "id-ID" ? "id-ID-Standard-A" : "en-US-Journey-F",
        ssmlGender: "FEMALE" as const,
      },
      audioConfig: {
        audioEncoding: "MP3" as const,
        speakingRate: 1.0,
        pitch: 0.0,
      },
    };

    const [response] = await ttsClient.synthesizeSpeech(ttsRequest);

    if (!response.audioContent) {
      throw new Error("No audio content received from TTS");
    }

    const audioBuffer = Buffer.from(response.audioContent);
    const base64Audio = audioBuffer.toString("base64");

    return Response.json({
      success: true,
      audioContent: base64Audio,
      audioFormat: "mp3",
    });
  } catch (error) {
    console.error("TTS API error:", error);
    return Response.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
