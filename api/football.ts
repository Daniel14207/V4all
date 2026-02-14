import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenAI } from "@google/genai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GOOGLE_API_KEY missing" });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
Analyse football matches.
Return ONLY valid JSON.
No explanations.
No gambling encouragement.

Format STRICT:
{
  "groups": [
    {
      "matches": [
        { "home": "Team A", "away": "Team B", "prediction": "1-1" }
      ]
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ text: prompt }],
      config: {
        responseMimeType: "application/json",
       
