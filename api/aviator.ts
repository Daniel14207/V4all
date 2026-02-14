import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenerativeAI } from "@google/genai";

// Instance UNIQUE (tsy miverimberina)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
You are a probability analysis engine.

Context:
- Aviator crash game
- No gambling advice
- No encouragement
- No emotional language

Task:
- Analyse statistical behavior patterns
- Estimate LOW RISK multiplier range
- Give ONE clear final result

Rules:
- Short
- Neutral
- Professional
- Result only

Output format (STRICT):
SAFE RANGE: x1.20 – x1.65
CONFIDENCE: LOW / MEDIUM / HIGH
`;

    const result = await model.generateContent(prompt);

    const text = result.response.text();

    return res.status(200).json({
      success: true,
      result: text.trim(),
    });
  } catch (error) {
    console.error("AVIATOR API ERROR:", error);
    return res.status(500).json({
      success: false,
      error: "Analysis unavailable",
    });
  }
}
