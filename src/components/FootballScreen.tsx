import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Shield, Target, AlertTriangle, TrendingUp, Info, RefreshCw, CheckCircle2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { FootballMatch, FootballGroup } from '../types';

const FootballScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [safeGroups, setSafeGroups] = useState<FootballGroup[]>([]);
  const [riskyGroups, setRiskyGroups] = useState<FootballGroup[]>([]);
  const [specialAlert, setSpecialAlert] = useState<{cote: string, team: string} | null>(null);
  const [loading, setLoading] = useState(false);
  const [historyImage, setHistoryImage] = useState<string | null>(null);
  const [matchesImage, setMatchesImage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadType, setActiveUploadType] = useState<'history' | 'matches' | null>(null);

  // Validation State
  const [shake, setShake] = useState(false);

  // Confirmation Modal State
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; message: string; onConfirm: () => void } | null>(null);

  const isFormValid = historyImage !== null && matchesImage !== null;

  const handleUploadClick = (type: 'history' | 'matches') => {
    setActiveUploadType(type);
    fileInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeUploadType) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (activeUploadType === 'history') setHistoryImage(base64);
        else setMatchesImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBack = () => {
    if (safeGroups.length > 0 || loading) {
        setConfirmDialog({
            isOpen: true,
            message: "Quitter l'analyse ? Les résultats actuels seront perdus.",
            onConfirm: () => {
                setConfirmDialog(null);
                onBack();
            }
        });
    } else {
        onBack();
    }
  };

  const handleRunAnalysis = () => {
      if (safeGroups.length > 0) {
          setConfirmDialog({
              isOpen: true,
              message: "Lancer une nouvelle analyse ? Les résultats actuels seront écrasés.",
              onConfirm: () => {
                  setConfirmDialog(null);
                  runFootballAnalysis();
              }
          });
      } else {
          runFootballAnalysis();
      }
  };

  const runFootballAnalysis = async () => {
    if (!isFormValid) {
        setShake(true);
        setTimeout(() => setShake(false), 500);
        if (!statusMessage) setStatusMessage("Veuillez charger les deux images requises.");
        return;
    }
    setLoading(true);
    setStatusMessage(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const parts: any[] = [
        { text: `TU ES LE MOTEUR D’ANALYSE INTERNE VICK V4 - VIRTUEL FOOT.

RÈGLES ABSOLUES :
1. L’interface ne doit jamais être modifiée (Structure JSON obligatoire).
2. La structure MULTIPLES FIABLES et MULTIPLES RISQUE doit être respectée dans la sortie.
3. Uniquement les résultats finaux structurés.

ÉTAPE 1 – ANALYSE HISTORIQUE (Image 1)
- Utiliser les données historiques fournies.
- Calculer tendances : Moyenne buts, Fréquence 1N2, Pattern déterministe.

ÉTAPE 2 – LECTURE IMAGE MATCHS (Image 2)
- Extraire TOUS les matchs visibles (Équipes, Cotes).
- Aucune correspondance ne doit être ignorée.

ÉTAPE 3 – ANALYSE COTE INTELLIGENTE
- Identifier anomalies (écart faible suspect), favoris clairs, pièges.
- Pondération : 60% Historique / 40% Structure des cotes.

ÉTAPE 4 – GÉNÉRATION SCORE EXACT
- Score autorisé uniquement :
  * Victoire : 1-0 à 4-1
  * Défaite : 0-1 à 1-4
  * Nul : 0-0 à 3-3
- Le score doit être cohérent avec la force historique et la structure des cotes.

FORMAT DE SORTIE JSON (Strictement respecté pour l'application) :
{
  "safe": [
    // Matchs analysés comme "Fiables" (Favoris, Cotes Basses, Confiance élevée)
    { "home": "Nom Équipe A", "away": "Nom Équipe B", "prediction": "2 - 1" },
    ...
  ],
  "risky": [
    // Matchs analysés comme "Risque" (Nuls probables, Pièges, Anomalies)
    { "home": "Nom Équipe C", "away": "Nom Équipe D", "prediction": "1 - 1" },
    ...
  ],
  "special": { "team": "Nom Équipe (Anomalie détectée)", "cote": "Cote" } // ou null
}

IMPORTANT :
- Tous les matchs détectés doivent apparaître (répartis entre safe et risky).
- Compléter à 30 matchs totaux avec des simulations réalistes si l'OCR ne trouve pas assez de matchs.
- Toujours les noms exacts des équipes.` }
      ];
      if (historyImage) parts.push({ inlineData: { data: historyImage.split(',')[1], mimeType: 'image/png' } });
      if (matchesImage) parts.push({ inlineData: { data: matchesImage.split(',')[1], mimeType: 'image/png' } });

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts }],
        config: { responseMimeType: 'application/json' }
      });

      const data = JSON.parse(response.text || '{}');
      const chunk = (arr: any[]) => {
        const res = [];
        for (let i = 0; i < (arr?.length || 0); i += 3) res.push({ matches: arr.slice(i, i + 3) });
        return res;
      };

      setSafeGroups(chunk(data.safe));
      setRiskyGroups(chunk(data.risky));
      setSpecialAlert(data.special);
      
      if ("vibrate" in navigator) navigator.vibrate(20);
    } catch (err) {
      console.error(err);
      setStatusMessage("Échec de l'analyse V4. Vérifiez vos images.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen bg-transparent overflow-hidden flex flex-col font-rajdhani">
      <header className="relative z-10 flex items-center justify-between px-6 pt-8 pb-4">
        <div className="flex items-center space-x-4">
          <motion.button whileTap={{ scale: 0.9 }} onClick={handleBack} className="p-3 glass rounded-2xl text-white shadow-lg border border-white/20">
            <ArrowLeft size={20} />
          </motion.button>
          <div className="flex flex-col">
            <h2 className="text-xl font-orbitron font-black text-white tracking-widest text-glow">VIRTUEL FOOT</h2>
            <span className="text-[10px] font-bold text-white/50 tracking-[0.3em] uppercase">V4 Analysis</span>
          </div>
        </div>
        <Info size={20} className="text-white/30" />
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar px-6 space-y-6 pb-24">
        
        <div className="glass p-6 rounded-[32px] border-l-4 border-l-red-600 space-y-6 bg-black/60 shadow-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-white/40 tracking-[0.4em] uppercase">Sources</span>
            {isFormValid && <CheckCircle2 size={16} className="text-green-500 animate-bounce" />}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => handleUploadClick('history')}
              className={`p-5 rounded-3xl flex flex-col items-center space-y-3 transition-all duration-300 border
                ${historyImage 
                    ? 'bg-red-900/40 border-red-500/40' 
                    : 'bg-black/40 border-white/5'}`}
            >
              <div className={`p-2 rounded-xl ${historyImage ? 'bg-red-500/20' : 'bg-white/5'}`}>
                <TrendingUp size={20} className={historyImage ? 'text-red-500' : 'text-white/20'} />
              </div>
              <span className={`text-[9px] font-bold tracking-widest uppercase text-center ${historyImage ? 'text-white' : 'text-white/30'}`}>
                {historyImage ? 'OK' : 'HISTORIQUE'}
              </span>
            </motion.button>

            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => handleUploadClick('matches')}
              className={`p-5 rounded-3xl flex flex-col items-center space-y-3 transition-all duration-300 border
                ${matchesImage 
                    ? 'bg-red-900/40 border-red-500/40' 
                    : 'bg-black/40 border-white/5'}`}
            >
              <div className={`p-2 rounded-xl ${matchesImage ? 'bg-red-500/20' : 'bg-white/5'}`}>
                <Target size={20} className={matchesImage ? 'text-red-500' : 'text-white/20'} />
              </div>
              <span className={`text-[9px] font-bold tracking-widest uppercase text-center ${matchesImage ? 'text-white' : 'text-white/30'}`}>
                {matchesImage ? 'OK' : 'MATCHS'}
              </span>
            </motion.button>
          </div>
        </div>
        <input type="file" ref={fileInputRef} onChange={onFileChange} className="hidden" accept="image/*" />

        {statusMessage && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                <div className="p-4 glass rounded-2xl border-l-2 border-red-500 bg-red-900/10 inline-block">
                     <span className="text-red-400 text-[10px] font-black tracking-widest uppercase italic">{statusMessage}</span>
                </div>
            </motion.div>
        )}

        <motion.button
          onClick={handleRunAnalysis}
          disabled={loading}
          className={`w-full py-5 rounded-2xl font-orbitron font-bold text-sm tracking-[0.3em] shadow-xl transition-all duration-500 btn-premium text-white
            ${loading ? 'opacity-80' : isFormValid ? '' : 'opacity-90 grayscale-[0.2]'}`}
        >
          {loading ? <RefreshCw className="animate-spin mx-auto" /> : 'LANCER ANALYSE V4'}
        </motion.button>

        <AnimatePresence>
          {specialAlert && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              className="glass p-6 rounded-[32px] border-l-4 border-l-red-500 bg-red-900/20 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10"><AlertTriangle size={64} className="text-red-500"/></div>
              <div className="relative z-10">
                <span className="text-[10px] font-black text-red-400 tracking-[0.4em] uppercase mb-1">Alerte V4</span>
                <p className="text-2xl font-orbitron font-black text-white uppercase text-glow-red">TENTE COTE {specialAlert.cote}</p>
                <p className="text-white/80 text-xs font-bold mt-2 tracking-widest uppercase">{specialAlert.team}</p>
              </div>
            </motion.div>
          )}

          {safeGroups.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 px-2">
                  <Shield size={16} className="text-green-500" />
                  <h3 className="text-green-400 font-orbitron text-[10px] tracking-[0.4em] uppercase">Multiples Fiables</h3>
                </div>
                {safeGroups.map((group, idx) => (
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: idx * 0.1 }} key={idx} className="glass rounded-[32px] p-6 space-y-4 bg-black/60">
                    <span className="text-[9px] font-black text-white/20 tracking-[0.5em] uppercase">Groupe #{idx + 1}</span>
                    {group.matches.map((match, midx) => (
                      <div key={midx} className="flex justify-between items-center border-b border-white/5 pb-3 last:border-0 last:pb-0">
                        <span className="text-xs font-bold text-white uppercase tracking-wider">{match.home} vs {match.away}</span>
                        <span className="text-lg font-orbitron font-black text-green-500">{match.prediction}</span>
                      </div>
                    ))}
                  </motion.div>
                ))}
              </div>

              <div className="space-y-4 pb-12">
                <div className="flex items-center space-x-2 px-2">
                  <Trophy size={16} className="text-white" />
                  <h3 className="text-white font-orbitron text-[10px] tracking-[0.4em] uppercase">Multiples Risque</h3>
                </div>
                {riskyGroups.map((group, idx) => (
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: idx * 0.1 }} key={idx} className="glass rounded-[32px] p-6 space-y-4 border-l-2 border-white/20 bg-black/60">
                    <span className="text-[9px] font-black text-white/20 tracking-[0.5em] uppercase">Risk Set #{idx + 1}</span>
                    {group.matches.map((match, midx) => (
                      <div key={midx} className="flex justify-between items-center border-b border-white/5 pb-3 last:border-0 last:pb-0">
                        <span className="text-xs font-bold text-white uppercase tracking-wider">{match.home} vs {match.away}</span>
                        <span className="text-lg font-orbitron font-black text-white/80">{match.prediction}</span>
                      </div>
                    ))}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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

export default FootballScreen;
