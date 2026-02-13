import { GoogleGenerativeAI } from "@google/genai";

export default async function handler(req, res) {
  const { description } = req.body;

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(
    `Analyse this screenshot: ${description}`
  );

  res.json({ analysis: result.response.text() });
}
