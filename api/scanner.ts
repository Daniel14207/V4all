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

    const { description } = req.body;
    if (!description || typeof description !== "string") {
      return res.status(400).json({ error: "Invalid description" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
Analyse this screenshot description.
Give technical and probabilistic analysis only.
No encouragement to gamble.
No guarantees.
Be concise.

DESCRIPTION:
${description}
`;

    const result
