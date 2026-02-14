import { useState } from "react";

export default function AviatorScreen() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runAnalysis = async () => {
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/aviator");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur serveur");
      }

      setResult(data.result);
    } catch (err: any) {
      setError("Analyse impossible. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, color: "white" }}>
      <h2>Aviator AI</h2>

      <button onClick={runAnalysis} disabled={loading}>
        {loading ? "Analyse en cours..." : "Lancer l'analyse"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <pre
          style={{
            marginTop: 20,
            background: "#111",
            padding: 15,
            borderRadius: 8,
          }}
        >
          {result}
        </pre>
      )}
    </div>
  );
}
