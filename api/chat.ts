import { GoogleGenerativeAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const { message } = req.body;
  const result = await model.generateContent(message);

  res.status(200).json({ reply: result.response.text() });
}
