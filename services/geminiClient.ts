import { GoogleGenAI } from "@google/genai";

// FIX: Per coding guidelines, the Gemini API key must be sourced exclusively from `process.env.API_KEY`.
// The check for a placeholder key has been removed, and the client is now initialized directly with the environment variable.
export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
