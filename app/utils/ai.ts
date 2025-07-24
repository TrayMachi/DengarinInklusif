import { SpeechClient } from "@google-cloud/speech";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { GoogleGenAI } from "@google/genai";

export const speechClient = new SpeechClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS || "",
});
export const ttsClient = new TextToSpeechClient();

export const llm = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY || "",
});
