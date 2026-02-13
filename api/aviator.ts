import { GoogleGenerativeAI } from "@google/genai";

export default async function handler(req, res) {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
Analyse aviator game.
Give safe multiplier range.
No gambling encouragement.
Only probability analysis.
`;

  const result = await model.generateContent(prompt);
  res.json({ result: result.response.text() });
}
