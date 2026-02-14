import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenerativeAI } from "@google/genai";

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

    const { prompt } = req.body;
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Invalid prompt" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent(prompt);

    return res.status(200).json({
      result: result.response.text(),
    });
  } catch (error) {
    console.error("Gemini API error:", error);
    return res.status(500).json({ error: "Generation failed" });
  }
}
