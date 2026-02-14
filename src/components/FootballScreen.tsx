import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, AlertTriangle } from "lucide-react";

type Match = {
  home: string;
  away: string;
  prediction: string;
};

type RiskGroup = {
  matches: Match[];
};

interface FootballScreenProps {
  onBack: () => void;
}

const FootballScreen: React.FC<FootballScreenProps> = ({ onBack }) => {
  const [riskyGroups, setRiskyGroups] = useState<RiskGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmDialog, setConfirmDialog] = useState(false);

  // ===============================
  // LOAD FOOTBALL PREDICTIONS
  // ===============================
  const loadPredictions = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/football");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Erreur serveur");
      }

      setRiskyGroups(data.groups || []);
    } catch (err) {
      setError("Impossible de charger les prédictions football.");
    } finally {
      setLoading(false);
    }
  };

  // Load on screen open
  useEffect(() => {
    loadPredictions();
  }, []);

  const handleBack = () => {
    if (riskyGroups.length > 0) {
      setConfirmDialog(true);
    } else {
      onBack();
    }
  };

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden flex flex-col">
      {/* HEADER */}
      <header className="flex items-center justify-between px-6 pt-6 pb-4">
        <button
          onClick={handleBack}
          className="p-3 rounded-2xl bg-white/5 border border-white/10"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-sm font-bold tracking-[0.4em] uppercase">
          Football AI
        </h2>
        <div />
      </header>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto px-6 pb-24 space-y-6">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center pt-20 text-white/60"
            >
              Chargement des prédictions...
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center pt-20 text-red-400"
            >
              {error}
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h3 className="text-white font-bold text-[10px] tracking-[0.4em] uppercase">
                Multiples Risque
              </h3>

              {riskyGroups.map((group, idx) => (
                <motion.div
                  key={idx}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="rounded-[28px] p-6 space-y-4 border border-white/10 bg-white/5"
                >
                  <span className="text-[9px] font-bold text-white/30 tracking-[0.5em] uppercase">
                    Risk Set #{idx + 1}
                  </span>

                  {group.matches.map((match, midx) => (
                    <div
                      key={midx}
                      className="flex justify-between items-center border-b border-white/10 pb-3 last:border-0"
                    >
                      <span className="text-xs font-bold uppercase">
                        {match.home} vs {match.away}
                      </span>
                      <span className="text-lg font-black">
                        {match.prediction}
                      </span>
                    </div>
                  ))}
                </motion.div>
              ))}

              {riskyGroups.length === 0 && (
                <p className="text-center text-white/40 text-xs pt-10">
                  Aucune prédiction disponible.
                </p>
              )}
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
