import React, { useState } from "react";
import { motion } from "framer-motion";
import { Zap, RefreshCw, AlertTriangle } from "lucide-react";

const AviatorScreen: React.FC = () => {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

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
    } catch {
      setError("Analyse impossible. Réessayez plus tard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center px-6 bg-black text-white">
      <div className="w-full max-w-lg glass p-8 rounded-[32px] border border-white/10 shadow-2xl bg-black/60 backdrop-blur-xl">

        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-600/20 border border-red-500/30 mb-4">
            <Zap className="text-red-500" size={32} />
          </div>
          <h2 className="text-2xl font-orbitron font-black tracking-[0.3em] uppercase text-glow">
            AVIATOR AI
          </h2>
          <p className="text-white/50 text-xs tracking-widest mt-2 uppercase">
            Analyse prédictive automatique
          </p>
        </div>

        {/* ACTION */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          disabled={loading}
          onClick={runAnalysis}
          className={`w-full py-5 rounded-2xl font-orbitron font-bold tracking-[0.4em] uppercase transition-all btn-premium
            ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <RefreshCw className="animate-spin" size={18} />
              Analyse en cours…
            </span>
          ) : (
            "Lancer l'analyse"
          )}
        </motion.button>

        {/* ERROR */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex items-center gap-3 bg-red-900/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-xs font-bold tracking-widest uppercase"
          >
            <AlertTriangle size={16} />
            {error}
          </motion.div>
        )}

        {/* RESULT */}
        {result && (
          <motion.pre
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-black/70 border border-white/10 rounded-2xl p-5 text-sm text-green-400 font-mono whitespace-pre-wrap shadow-inner"
          >
            {result}
          </motion.pre>
        )}
      </div>
    </div>
  );
};

export default AviatorScreen;
