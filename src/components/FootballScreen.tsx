import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, AlertTriangle, RefreshCw } from "lucide-react";
import { FootballGroup } from "../types";

interface Props {
  onBack: () => void;
}

const FootballScreen: React.FC<Props> = ({ onBack }) => {
  const [riskyGroups, setRiskyGroups] = useState<FootballGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmDialog, setConfirmDialog] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    setError("");
    setRiskyGroups([]);

    try {
      const res = await fetch("/api/football");
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Erreur serveur");

      setRiskyGroups(data.groups || []);
    } catch {
      setError("Analyse impossible. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden flex flex-col">
      {/* HEADER */}
      <header className="flex items-center justify-between px-6 py-5 border-b border-white/10">
        <button
          onClick={() => setConfirmDialog(true)}
          className="p-3 rounded-xl bg-white/5 hover:bg-white/10"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="text-sm font-black tracking-[0.4em] uppercase">
          Football AI
        </h2>
        <div className="w-10" />
      </header>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar">
        <AnimatePresence mode="wait">
          {riskyGroups.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center text-center pt-20 space-y-6"
            >
              <button
                onClick={runAnalysis}
                disabled={loading}
                className="px-8 py-4 rounded-2xl bg-green-600 hover:bg-green-500 font-black tracking-widest uppercase"
              >
                {loading ? "Analyse..." : "Lancer Analyse"}
              </button>

              {error && (
                <p className="text-red-400 text-xs uppercase tracking-widest">
                  {error}
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {riskyGroups.map((group, idx) => (
                <motion.div
                  key={idx}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4"
                >
                  <span className="text-[10px] tracking-widest uppercase text-white/40">
                    Risk Group #{idx + 1}
                  </span>

                  {group.matches.map((match, midx) => (
                    <div
                      key={midx}
                      className="flex justify-between items-center border-b border-white/10 pb-3 last:border-0"
                    >
                      <span className="text-xs font-bold uppercase">
                        {match.home} vs {match.away}
                      </span>
                      <span className="text-lg font-black text-green-400">
                        {match.prediction}
                      </span>
                    </div>
                  ))}
                </motion.div>
              ))}

              <button
                onClick={runAnalysis}
                className="w-full py-4 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center space-x-3"
              >
                <RefreshCw size={16} />
                <span className="text-xs tracking-widest uppercase font-bold">
                  Nouvelle analyse
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CONFIRM MODAL */}
      <AnimatePresence>
        {confirmDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-black border border-white/10 rounded-3xl p-6 w-full max-w-sm"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <AlertTriangle className="text-red-500" size={28} />
                <p className="text-xs uppercase tracking-widest">
                  Quitter le module ?
                </p>
                <div className="grid grid-cols-2 gap-4 w-full pt-4">
                  <button
                    onClick={() => setConfirmDialog(false)}
                    className="py-3 rounded-xl bg-white/5 border border-white/10"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={onBack}
                    className="py-3 rounded-xl bg-red-600"
                  >
                    Quitter
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FootballScreen;
