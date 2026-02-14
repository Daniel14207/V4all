import { useState } from "react";

export default function Analyse() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const analyse = async () => {
    setLoading(true);

    try {
      const res = await fetch("/.netlify/functions/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: "Analyse aviator match"
        })
      });

      const data = await res.json();

      setResult(
        data?.reply ||
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Tsy nisy valiny"
      );
    } catch (err) {
      setResult("Erreur analyse");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={analyse}>
        {loading ? "Analyse..." : "Lancer analyse"}
      </button>

      <pre style={{ whiteSpace: "pre-wrap", marginTop: 10 }}>
        {result}
      </pre>
    </div>
  );
}
