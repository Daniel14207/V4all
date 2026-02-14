import React from 'react'
import { motion } from 'framer-motion'

const WelcomeScreen: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center overflow-hidden bg-transparent"
    >
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />

      <div className="relative z-10 text-center px-8">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.7, rotateX: -45 }}
          animate={{
            opacity: [0, 1, 1],
            scale: [0.7, 1.1, 1],
            rotateX: [-45, 0, 0],
          }}
          transition={{
            duration: 6,
            ease: 'easeOut',
          }}
          className="text-4xl md:text-7xl font-orbitron font-black text-white tracking-[0.25em] uppercase text-glow"
        >
          BIENVENUE AU SIGNAL
        </motion.h1>

        {/* Divider line */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '
