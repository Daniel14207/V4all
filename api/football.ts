import { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenAI } from "@google/genai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "API key not configured" });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Prompt ho an'ny prediction football (azonao ovaina raha tianao)
    const prompt = `
      Analyse les prochains matchs de football et génère plusieurs groupes de 
      prédictions de score et résultat. Réponds uniquement en format JSON:
      {
        "groups": [
          {
            "matches": [
              { "home": "TeamA", "away": "TeamB", "prediction": "1-1" },
              ...
            ]
          },
          ...
        ]
      }
    `;

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash", 
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const text = result.text || "{}";
    const data = JSON.parse(text);

    return res.status(200).json(data);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get predictions" });
  }
}
