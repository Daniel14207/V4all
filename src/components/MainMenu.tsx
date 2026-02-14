import React from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Wand2,
  Plane,
  BarChart3,
  ScanLine,
  Dice5
} from 'lucide-react';

/* =======================
   ENUM NAVIGATION
======================= */
export enum Screen {
  AVIATOR = 'AVIATOR',
  FOOTBALL = 'FOOTBALL',
  SCANNER = 'SCANNER',
  ROULETTE = 'ROULETTE',
  VEO = 'VEO',
  EDITOR = 'EDITOR',
}

interface Props {
  onNavigate: (screen: Screen) => void;
}

/* =======================
   MAIN MENU
======================= */
const MainMenu: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-black relative overflow-hidden">
      
      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ff004c22,transparent_60%)]" />

      <div className="relative z-10 w-full max-w-md px-6 space-y-6">

        {/* HEADER */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-orbitron font-black text-white tracking-[0.4em] text-glow">
            V4ALL
          </h1>
          <p className="text-[10px] text-white/50 tracking-[0.4em] uppercase font-bold">
            Neural Prediction Hub
          </p>
        </div>

        {/* MENU */}
        <main className="space-y-4">

          <MenuButton
            title="AVIATOR AI"
            subtitle="Analyse Prédictive"
            image="/images/aviator.jpg"
            color="red"
            icon={<Plane size={28} />}
            onClick={() => onNavigate(Screen.AVIATOR)}
          />

          <MenuButton
            title="FOOTBALL PRO"
            subtitle="Multi-Paris IA"
            image="/images/football.jpg"
            color="green"
            icon={<BarChart3 size={28} />}
            onClick={() => onNavigate(Screen.FOOTBALL)}
          />

          <MenuButton
            title="SMART SCANNER"
            subtitle="Vision Neuronale"
            image="/images/scanner.jpg"
            color="blue"
            icon={<ScanLine size={28} />}
            onClick={() => onNavigate(Screen.SCANNER)}
          />

          <MenuButton
            title="ROULETTE CORE"
            subtitle="Statistiques Avancées"
            image="/images/roulette.jpg"
            color="yellow"
            icon={<Dice5 size={28} />}
            onClick={() => onNavigate(Screen.ROULETTE)}
          />

          <MenuButton
            title="VEO ENGINE"
            subtitle="Simulation Visuelle"
            image="/images/veo.jpg"
            color="purple"
            icon={<Zap size={28} />}
            onClick={() => onNavigate(Screen.VEO)}
          />

          <MenuButton
            title="REALITY SHIFT"
            subtitle="Éditeur Neural"
            image="/images/editor.jpg"
            color="pink"
            icon={<Wand2 size={28} />}
            onClick={() => onNavigate(Screen.EDITOR)}
          />
        </main>

        {/* FOOTER */}
        <div className="glass p-4 rounded-2xl text-center">
          <p className="text-[10px] font-bold text-white/40 tracking-[0.4em] uppercase">
            Licence Active : MG-2025-VITAL
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;

/* =======================
   MENU BUTTON
======================= */
interface ButtonProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  image: string;
  onClick: () => void;
}

const MenuButton: React.FC<ButtonProps> = ({
  title,
  subtitle,
  icon,
  color,
  image,
  onClick
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="relative w-full h-24 rounded-[28px] overflow-hidden group shadow-2xl"
    >
      {/* IMAGE */}
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-700"
      />

      {/* OVERLAY */}
      <div className={`absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-${color}-900/30`} />

      {/* CONTENT */}
      <div className="relative z-10 h-full flex items-center px-6 space-x-5">
        <div className={`w-14 h-14 rounded-2xl bg-${color}-600/20 flex items-center justify-center border border-white/20 shadow-inner`}>
          {icon}
        </div>
        <div className="flex-1 text-left">
          <h3 className="text-white font-orbitron font-bold tracking-widest text-sm">
            {title}
          </h3>
          <p className="text-[9px] uppercase tracking-wider text-white/50 font-bold mt-1">
            {subtitle}
          </p>
        </div>
        <Zap className="text-white/30 group-hover:text-white transition-colors" />
      </div>
    </motion.button>
  );
};
