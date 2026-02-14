import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, KeyRound, PhoneCall } from 'lucide-react';

interface Props {
  onActivate: () => void;
}

const ActivationScreen: React.FC<Props> = ({ onActivate }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  const handleActivation = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setIsActivating(true);

    setTimeout(() => {
      if (code.length >= 6) {
        onActivate();
      } else {
        setError(true);
      }
      setIsActivating(false);
    }, 1200);
  };

  const handleCallAdmin = () => {
    window.open('tel:+261342594678');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative w-full h-screen flex items-center justify-center px-6"
    >
      <div className="glass w-full max-w-md p-8 rounded-[40px] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] bg-black/70 backdrop-blur-xl">

        {/* HEADER */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-5 mb-
