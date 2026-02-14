import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/* =======================
   SCREENS
======================= */
import SplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';
import ActivationScreen from './components/ActivationScreen';
import WelcomeScreen from './components/WelcomeScreen';
import MainMenu, { Screen } from './components/MainMenu';

import AviatorScreen from './components/AviatorScreen';
import FootballScreen from './components/FootballScreen';
import RouletteScreen from './components/RouletteScreen';
import ChatScreen from './components/ChatScreen';
import ScannerScreen from './components/ScannerScreen';
import VeoScreen from './components/VeoScreen';
import ImageEditorScreen from './components/ImageEditorScreen';

/* =======================
   APP ROOT
======================= */
const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.SPLASH);

  /* =======================
     AUTO TRANSITIONS
  ======================= */
  useEffect(() => {
    let timer:
