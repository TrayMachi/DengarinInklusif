import { SpeechClient } from "@google-cloud/speech";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { GoogleGenAI } from "@google/genai";

export const speechClient = new SpeechClient({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT || "{}"),
});
export const ttsClient = new TextToSpeechClient();

export const llm = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY || "",
});
