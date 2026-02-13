import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Disc, RefreshCw, Zap, Binary, AlertTriangle } from 'lucide-react';

const RouletteScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [numbers, setNumbers] = useState<{n: number, c: 'red' | 'black' | 'green'}[]>([]);
  const [loading, setLoading] = useState(false);
  const [round, setRound] = useState(1);
  const [analysisStep, setAnalysisStep] = useState(0);

  // Confirmation Modal State
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; message: string; onConfirm: () => void } | null>(null);

  const handleBack = () => {
    if (numbers.length > 0 || loading) {
        setConfirmDialog({
            isOpen: true,
            message: "Quitter le module ? L'historique des tirages sera perdu.",
            onConfirm: () => {
                setConfirmDialog(null);
                onBack();
            }
        });
    } else {
        onBack();
    }
  };

  const handleGenerate = () => {
      if (numbers.length > 0) {
          setConfirmDialog({
              isOpen: true,
              message: "Générer une nouvelle série ? La série actuelle sera effacée.",
              onConfirm: () => {
                  setConfirmDialog(null);
                  generateRouletteCycle();
              }
          });
      } else {
          generateRouletteCycle();
      }
  };

  const generateRouletteCycle = () => {
    setLoading(true);
    setAnalysisStep(1);
    
    // Simulate complex analysis steps
    setTimeout(() => setAnalysisStep(2), 500);
    setTimeout(() => setAnalysisStep(3), 1000);

    setTimeout(() => {
      const red = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
      const results = Array.from({ length: 10 }).map(() => {
        const n = Math.floor(Math.random() * 37);
        const c: 'red' | 'black' | 'green' = n === 0 ? 'green' : red.includes(n) ? 'red' : 'black';
        return { n, c };
      });
      setNumbers(results);
      setLoading(false);
      setAnalysisStep(0);
      setRound(prev => prev + 1);
    }, 1500);
  };

  return (
    <div className="relative w-full h-screen bg-transparent overflow-hidden flex flex-col font-rajdhani">
      <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-4">
        <div className="flex items-center space-x-4">
          <motion.button whileTap={{ scale: 0.9 }} onClick={handleBack} className="p-3 glass rounded-2xl text-white shadow-lg border border-white/20">
            <ArrowLeft size={20} />
          </motion.button>
          <div className="flex flex-col">
            <h2 className="text-xl font-orbitron font-black text-white tracking-widest text-glow uppercase">Roulette FR</h2>
            <span className="text-[10px] font-bold text-white/50 tracking-[0.4em] uppercase">Rond {round}</span>
          </div>
        </div>
        <Disc size={20} className="text-white/30" />
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar px-6 space-y-8 pb-24">
        <div className="flex justify-center py-8">
          <motion.div 
            animate={{ rotate: loading ? 720 : 360 }}
            transition={{ repeat: Infinity, duration: loading ? 2 : 20, ease: loading ? "easeInOut" : "linear" }}
            className={`w-56 h-56 rounded-full glass border-8 flex items-center justify-center relative p-1 shadow-2xl bg-black/40 transition-colors duration-500
                ${loading ? 'border-red-500/50 shadow-[0_0_30px_#D10000]' : 'border-white/5'}`}
          >
            <div className={`absolute inset-0 rounded-full border-2 animate-pulse ${loading ? 'border-red-500/30' : 'border-green-500/20'}`} />
            <div className="w-full h-full rounded-full border border-white/5 flex flex-col items-center justify-center bg-black/80 shadow-inner overflow-hidden">
               <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                        key="analysis"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center"
                    >
                         <Binary size={32} className="text-red-500 animate-pulse mb-2" />
                         <span className="text-[9px] font-black text-red-400 tracking-widest uppercase">
                            {analysisStep === 1 ? 'LECTURE CYCLES' : analysisStep === 2 ? 'CALCUL PROBABILITÉS' : 'GÉNÉRATION...'}
                         </span>
                    </motion.div>
                  ) : (
                    <motion.div
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center"
                    >
                        <Zap size={32} className="text-green-500/50 mb-2" />
                        <span className="text-[10px] font-black text-white/20 tracking-widest uppercase">SYSTÈME PRÊT</span>
                    </motion.div>
                  )}
               </AnimatePresence>
            </div>
          </motion.div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-5 btn-premium rounded-3xl flex items-center justify-center space-x-4 shadow-xl text-white"
        >
          {loading ? <RefreshCw className="animate-spin text-white" /> : <RefreshCw className="text-white" />}
          <span className="font-orbitron font-bold text-sm tracking-[0.3em] uppercase">
             {loading ? 'ANALYSE EN COURS...' : 'GÉNÉRER 10 NUMÉROS'}
          </span>
        </motion.button>

        <div className="grid grid-cols-2 gap-4">
          {numbers.map((num, i) => (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              key={i}
              className={`p-8 rounded-[32px] glass text-center relative overflow-hidden group border-b-4 bg-black/60 ${
                num.c === 'red' ? 'border-red-600' : num.c === 'black' ? 'border-zinc-500' : 'border-green-600'
              }`}
            >
              <div className={`absolute top-0 right-0 w-12 h-12 opacity-10 blur-xl rounded-full ${num.c === 'red' ? 'bg-red-500' : num.c === 'black' ? 'bg-white' : 'bg-green-500'}`} />
              <p className="text-4xl font-orbitron font-black text-white">{num.n}</p>
              <p className={`text-[10px] font-black uppercase tracking-[0.4em] mt-2 ${
                num.c === 'red' ? 'text-red-500' : num.c === 'black' ? 'text-white/60' : 'text-green-500'
              }`}>
                {num.c}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Confirmation Modal */}
        <AnimatePresence>
            {confirmDialog && confirmDialog.isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="glass p-6 rounded-[32px] border border-white/10 shadow-2xl w-full max-w-sm bg-black/90"
                    >
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-12 h-12 rounded-full bg-red-900/30 flex items-center justify-center border border-red-500/30 shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                                <AlertTriangle className="text-red-500" size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-orbitron font-bold text-white uppercase tracking-widest text-glow">Confirmation</h3>
                                <p className="text-white/60 text-xs font-bold tracking-wider mt-2 uppercase leading-relaxed">{confirmDialog.message}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 w-full pt-4">
                                <button
                                    onClick={() => setConfirmDialog(null)}
                                    className="py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={confirmDialog.onConfirm}
                                    className="py-3 rounded-xl bg-red-600 border border-red-400 text-white font-bold text-xs uppercase tracking-widest hover:bg-red-500 transition-colors shadow-[0_0_10px_rgba(220,38,38,0.4)]"
                                >
                                    Confirmer
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RouletteScreen;
