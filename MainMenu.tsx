
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plane, Zap, Activity, Shield, Trophy, Disc, MessageSquare, Eye, Clapperboard, Wand2 } from 'lucide-react';
import { Screen, Sphere } from '../types';

interface MainMenuProps {
  onNavigate: (screen: Screen) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onNavigate }) => {
  return (
    <div className="relative w-full h-screen bg-transparent overflow-hidden flex flex-col p-6 font-rajdhani">
      <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col h-full space-y-6 overflow-y-auto no-scrollbar">
        
        {/* Header Panel */}
        <div className="glass rounded-[30px] p-6 mt-4 flex justify-between items-center shadow-lg">
          <div>
            <h2 className="text-3xl font-orbitron font-black text-white text-glow">VICK V4</h2>
            <div className="flex items-center mt-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2 shadow-[0_0_8px_#008A3D]" />
              <p className="text-white/60 font-bold tracking-[0.3em] text-[10px] uppercase">
                Système Opérationnel
              </p>
            </div>
          </div>
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
            <Activity className="text-green-400" size={20} />
          </div>
        </div>

        <main className="flex-1 flex flex-col justify-start space-y-5 pb-8">
          <MenuButton 
            title="AVIATOR STUDIO" 
            subtitle="Analyse Haute Fréquence" 
            icon={<Plane size={36} className="text-red-500 -rotate-45" />} 
            color="red"
            onClick={() => onNavigate(Screen.AVIATOR)}
          />

          <MenuButton 
            title="VIRTUEL FOOT" 
            subtitle="Algorithme Déterministe" 
            icon={<Trophy size={36} className="text-green-500" />} 
            color="green"
            onClick={() => onNavigate(Screen.FOOTBALL)}
          />

          <MenuButton 
            title="ROULETTE FR" 
            subtitle="Cycles Probabilistes" 
            icon={<Disc size={36} className="text-white" />} 
            color="white"
            onClick={() => onNavigate(Screen.ROULETTE)}
          />

          <div className="w-full h-[1px] bg-white/10 my-2" />
          <p className="text-[9px] font-black text-white/30 tracking-[0.4em] uppercase ml-2">Modules IA Experimental</p>

          <MenuButton 
            title="ORACLE CHAT" 
            subtitle="Assistant Stratégique" 
            icon={<MessageSquare size={36} className="text-blue-400" />} 
            color="blue"
            onClick={() => onNavigate(Screen.CHAT)}
          />

          <MenuButton 
            title="VISUAL SCANNER" 
            subtitle="Analyse d'Images Pro" 
            icon={<Eye size={36} className="text-purple-400" />} 
            color="purple"
            onClick={() => onNavigate(Screen.SCANNER)}
          />

          <MenuButton 
            title="HOLO-GEN" 
            subtitle="Générateur Vidéo Veo" 
            icon={<Clapperboard size={36} className="text-yellow-400" />} 
            color="yellow"
            onClick={() => onNavigate(Screen.VEO)}
          />

          <MenuButton 
            title="REALITY SHIFT" 
            subtitle="Éditeur Neural" 
            icon={<Wand2 size={36} className="text-pink-400" />} 
            color="pink"
            onClick={() => onNavigate(Screen.EDITOR)}
          />
        </main>

        <div className="glass p-4 rounded-2xl text-center mb-4">
            <p className="text-[10px] font-bold text-white/40 tracking-[0.4em] uppercase">
                Licence Active : MG-2025-VITAL
            </p>
        </div>
      </div>
    </div>
  );
};

const MenuButton: React.FC<{ title: string; subtitle: string; icon: React.ReactNode; color: string; onClick: () => void }> = ({ title, subtitle, icon, color, onClick }) => {
  const getGradient = () => {
      switch(color) {
          case 'red': return 'bg-gradient-to-br from-red-900/40 to-transparent';
          case 'green': return 'bg-gradient-to-br from-green-900/40 to-transparent';
          case 'blue': return 'bg-gradient-to-br from-blue-900/40 to-transparent';
          case 'purple': return 'bg-gradient-to-br from-purple-900/40 to-transparent';
          case 'yellow': return 'bg-gradient-to-br from-yellow-900/40 to-transparent';
          case 'pink': return 'bg-gradient-to-br from-pink-900/40 to-transparent';
          default: return 'bg-gradient-to-br from-white/10 to-transparent';
      }
  };

  const getHoverColor = () => {
    switch(color) {
        case 'red': return 'group-hover:bg-red-500';
        case 'green': return 'group-hover:bg-green-500';
        case 'blue': return 'group-hover:bg-blue-500';
        case 'purple': return 'group-hover:bg-purple-500';
        case 'yellow': return 'group-hover:bg-yellow-500';
        case 'pink': return 'group-hover:bg-pink-500';
        default: return 'group-hover:bg-white';
    }
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-[32px] glass p-[1px] shadow-2xl transition-all"
    >
      <div className="relative bg-black/60 rounded-[31px] p-5 flex items-center space-x-6 backdrop-blur-xl border border-white/5">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner border border-white/10 ${getGradient()}`}>
          {icon}
        </div>
        <div className="flex-1 text-left">
          <h3 className="text-lg font-orbitron font-bold text-white tracking-widest text-glow">{title}</h3>
          <p className="text-white/50 font-bold text-[9px] mt-1 tracking-wider uppercase group-hover:text-white transition-colors">{subtitle}</p>
        </div>
        <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center ${getHoverColor()} group-hover:text-black transition-all`}>
             <Zap size={16} />
        </div>
      </div>
    </motion.button>
  );
};

export default MainMenu;
