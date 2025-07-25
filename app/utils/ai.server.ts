import { SpeechClient } from "@google-cloud/speech";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { GoogleGenAI } from "@google/genai";

export const speechClient = new SpeechClient({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT || "{}"),
});
export const ttsClient = new TextToSpeechClient({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT || "{}"),
});

export const llm = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY || "",
});

export const generateText = async (prompt: string): Promise<string> => {
  const response = await llm.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
  });

  return response.text || '';
}
