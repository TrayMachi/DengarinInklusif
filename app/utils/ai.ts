import { SpeechClient } from "@google-cloud/speech";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

const rawCreds = process.env.GOOGLE_SERVICE_ACCOUNT;

if (rawCreds) {
  const credsPath = path.join("/tmp", "google-creds.json");
  fs.writeFileSync(credsPath, rawCreds);
  process.env.GOOGLE_APPLICATION_CREDENTIALS = credsPath;
}

export const speechClient = new SpeechClient();
export const ttsClient = new TextToSpeechClient();

export const llm = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY || "",
});
