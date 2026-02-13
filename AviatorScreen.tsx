
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Upload, RefreshCw, Zap, Settings, BarChart3, CheckCircle2, Copy, Check, PlayCircle, AlertTriangle } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { AviatorSignal } from '../types';

const AviatorScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [signals, setSignals] = useState<AviatorSignal[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastCote, setLastCote] = useState('');
  const [lastTime, setLastTime] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation State
  const [shake, setShake] = useState(false);

  // Confirmation Modal State
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; message: string; onConfirm: () => void } | null>(null);

  // Validation strictly HH:MM:SS
  const isTimeValid = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(lastTime);
  const isCoteValid = lastCote.trim().length > 0;
  const isFormValid = image !== null && isCoteValid && isTimeValid;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const base64 = readerEvent.target?.result as string;
        setImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopy = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleBack = () => {
    if (signals.length > 0 || loading) {
        setConfirmDialog({
            isOpen: true,
            message: "Quitter le module ? Les données actuelles seront perdues.",
            onConfirm: () => {
                setConfirmDialog(null);
                onBack();
            }
        });
    } else {
        onBack();
    }
  };

  const handleResetCycle = () => {
    setConfirmDialog({
        isOpen: true,
        message: "Lancer une nouvelle analyse ? L'historique actuel sera effacé.",
        onConfirm: () => {
            setSignals([]);
            setImage(null);
            setLastCote('');
            setLastTime('');
            setStatusMessage(null);
            setConfirmDialog(null);
        }
    });
  };

  const runAnalysis = async () => {
    if (!isFormValid) {
        setShake(true);
        setTimeout(() => setShake(false), 500);
        if (!statusMessage) setStatusMessage("Données incomplètes ou invalides.");
        return;
    }
    setLoading(true);
    setStatusMessage(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = image!.split(',')[1];
      
      const promptText = `
        TU ES LE MOTEUR PRÉDICTIF AVIATOR VICK V4.
        TA MISSION : Générer une séquence de prédiction ultra-réaliste pour 1 heure.

        INPUTS :
        - Image Historique fournie.
        - Dernière Cote Connue : ${lastCote}
        - Heure de Démarrage : ${lastTime}

        RÈGLES STRICTES DE GÉNÉRATION (ALGORITHME V4) :
        1. GÉNÉRER EXACTEMENT 30 SIGNAUX.
        2. FENÊTRE TEMPORELLE : 1 HEURE (60 minutes) à partir de ${lastTime}.
        3. FORMAT DE COTE : Triplet obligatoire (ex: "2.45x / 1.10x / 5.00x").
        4. CALCUL DE L'HEURE :
           - Signal 1 : Heure de Démarrage + 1 minute.
           - Signaux suivants : Ajouter un intervalle dynamique basé sur la cote précédente.
             * Si cote < 10.00x : +30 à 90 secondes.
             * Si cote >= 10.00x : +2 à 4 minutes.
           - Les heures doivent être formatées HH:MM:SS.
           - Aucune heure ne doit dépasser Heure de Démarrage + 60min.
        5. DISTRIBUTION DES COTES (Basée sur l'image et la volatilité) :
           - Mélange réaliste de cotes bleues (1.xx), violettes (2.xx - 9.xx) et roses (10.xx+).
        
        SORTIE JSON UNIQUEMENT :
        {
          "predictions": [
            { "cotes": "2.12x / 1.50x / 3.20x", "heure": "HH:MM:SS" },
            ... (30 items)
          ]
        }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            parts: [
              { inlineData: { data: base64Data, mimeType: 'image/png' } },
              { text: promptText }
            ]
          }
        ],
        config: { responseMimeType: 'application/json' }
      });

      const data = JSON.parse(response.text || '{}');
      if (data.predictions && Array.isArray(data.predictions)) {
        setSignals(data.predictions);
      } else {
        throw new Error("Format invalide");
      }
      
      if ("vibrate" in navigator) navigator.vibrate(20);
    } catch (error) {
      console.error(error);
      setStatusMessage("Échec de la synchronisation V4. Veuillez réessayer avec une image plus claire.");
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
            <h2 className="text-xl font-orbitron font-black text-white tracking-widest text-glow">AVIATOR STUDIO</h2>
            <div className="flex items-center space-x-2">
               <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
               <span className="text-[10px] font-bold text-white/60 tracking-[0.3em] uppercase">V4 Engine Live</span>
            </div>
          </div>
        </div>
        <Settings size={20} className="text-white/40" />
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar px-6 space-y-6 pb-24">
        <AnimatePresence mode="wait">
          {signals.length === 0 ? (
            <motion.div 
              key="inputs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="glass p-6 rounded-[32px] border-l-4 border-l-red-600 space-y-6 shadow-2xl bg-black/60">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-white/40 tracking-[0.4em] uppercase">Configuration V4</span>
                    {isFormValid && <CheckCircle2 size={16} className="text-green-500 animate-bounce" />}
                 </div>

                 <div className="space-y-4">
                    {/* Image Upload - No validation shake or red border */}
                    <div className="relative">
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-full py-5 px-6 rounded-2xl border flex items-center justify-between transition-all duration-300
                          ${image 
                            ? 'bg-red-900/20 border-red-500/40 shadow-inner' 
                            : 'bg-black/40 border-white/10'}`}
                      >
                        <div className="flex items-center space-x-3">
                          <Upload size={18} className={image ? 'text-red-500' : 'text-white/20'} />
                          <span className={`text-xs font-bold tracking-widest uppercase ${image ? 'text-white' : 'text-white/40'}`}>
                            {image ? 'HISTORIQUE CHARGÉ' : 'UPLOAD HISTORIQUE'}
                          </span>
                        </div>
                        {image && <Check size={14} className="text-red-500" />}
                      </motion.button>
                      <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                    </div>

                    {/* Inputs Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <motion.div 
                        className="space-y-2"
                        animate={shake && !isCoteValid ? { x: [0, -5, 5, -5, 5, 0] } : {}}
                        transition={{ duration: 0.4 }}
                      >
                        <label className={`text-[9px] font-black tracking-[0.4em] uppercase ml-2 ${shake && !isCoteValid ? 'text-red-400' : 'text-white/30'}`}>Dernière Cote</label>
                        <input 
                          type="text" 
                          placeholder="Ex: 2.18x"
                          value={lastCote}
                          onChange={(e) => setLastCote(e.target.value)}
                          className={`w-full bg-black/40 border py-5 px-5 rounded-2xl text-white font-orbitron font-bold placeholder:text-white/10 focus:outline-none transition-all text-sm text-center
                            ${(shake && !isCoteValid) ? 'border-red-500/60 shadow-[0_0_10px_rgba(220,38,38,0.2)]' : 'border-white/10 focus:border-red-500/50'}`}
                        />
                      </motion.div>
                      <motion.div 
                        className="space-y-2"
                        animate={shake && !isTimeValid ? { x: [0, -5, 5, -5, 5, 0] } : {}}
                        transition={{ duration: 0.4 }}
                      >
                        <label className={`text-[9px] font-black tracking-[0.4em] uppercase ml-2 ${shake && !isTimeValid ? 'text-red-400' : 'text-white/30'}`}>Heure (HH:MM:SS)</label>
                        <input 
                          type="text" 
                          placeholder="10:48:22"
                          value={lastTime}
                          onChange={(e) => setLastTime(e.target.value)}
                          className={`w-full bg-black/40 border py-5 px-5 rounded-2xl text-white font-orbitron font-bold placeholder:text-white/10 focus:outline-none transition-all text-sm text-center
                            ${(lastTime && !isTimeValid) || (shake && !isTimeValid) ? 'border-red-500/60 shadow-[0_0_10px_rgba(220,38,38,0.2)]' : 'border-white/10 focus:border-green-500/50'}`}
                        />
                      </motion.div>
                    </div>
                 </div>
              </div>

              {/* Status or Error Message */}
              {statusMessage && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                    <span className="text-red-400 text-[10px] font-bold tracking-widest uppercase bg-red-900/20 px-4 py-2 rounded-full border border-red-500/20">
                      {statusMessage}
                    </span>
                 </motion.div>
              )}

              <motion.button
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={runAnalysis}
                className={`w-full py-6 rounded-2xl font-orbitron font-bold tracking-[0.5em] flex items-center justify-center space-x-3 shadow-2xl transition-all duration-500 btn-premium text-white
                  ${loading ? 'opacity-80' : isFormValid ? '' : 'opacity-90 grayscale-[0.2]'}`}
              >
                {loading ? <RefreshCw className="animate-spin" size={20} /> : <Zap size={20} className={isFormValid ? 'animate-pulse' : ''} />}
                <span>{loading ? 'CALCUL V4...' : 'LANCER ANALYSE'}</span>
              </motion.button>

              {!loading && (
                <div className="flex flex-col items-center justify-center py-4 space-y-4 opacity-30">
                  <BarChart3 size={32} className="text-white" />
                  <p className="text-[9px] font-black tracking-[0.5em] uppercase text-center text-white">Attente données synchronisées</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 pb-12"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 px-2">
                <div>
                    <h3 className="text-white font-orbitron text-xs tracking-[0.4em] uppercase text-glow">Prédictions V4</h3>
                    <p className="text-[9px] text-white/40 font-bold tracking-widest mt-1">FENÊTRE 1 HEURE • 30 SIGNAUX</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                    <PlayCircle size={16} className="text-green-500" />
                </div>
              </div>
              
              <div className="space-y-4">
                {signals.map((sig, idx) => (
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    key={idx} 
                    className="group relative overflow-hidden glass p-5 rounded-[24px] border border-white/5 flex flex-col justify-between bg-black/40 backdrop-blur-md"
                  >
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                            <span className="text-[9px] text-white/30 font-bold uppercase tracking-[0.2em]">Signal #{idx + 1}</span>
                        </div>
                        <span className="text-sm font-orbitron font-bold text-white/80">{sig.heure}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex space-x-1 font-orbitron font-black text-lg">
                             {/* Styling the triplets slightly differently for readability */}
                             {sig.cotes.split('/').map((part, pIdx) => (
                                <span key={pIdx} className={`${
                                    pIdx === 0 ? 'text-green-400' : pIdx === 1 ? 'text-red-400' : 'text-white'
                                }`}>
                                    {part.trim()}{pIdx < 2 ? ' / ' : ''}
                                </span>
                             ))}
                        </div>
                        <button 
                          onClick={() => handleCopy(`${sig.cotes} @ ${sig.heure}`, idx)}
                          className="p-2 bg-white/5 rounded-xl text-white/20 hover:text-white hover:bg-white/10 transition-all"
                        >
                          {copiedId === idx ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                        </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Next Prediction Button */}
              <div className="pt-4 pb-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleResetCycle}
                    className="w-full py-6 btn-premium rounded-3xl font-orbitron font-black text-sm tracking-[0.4em] uppercase text-white shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center justify-center space-x-3 border border-white/20"
                  >
                    <RefreshCw size={18} />
                    <span>SUIVANT - PROCHAINE PRÉDICTION</span>
                  </motion.button>
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

export default AviatorScreen;
