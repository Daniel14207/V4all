import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Disc, Plane } from 'lucide-react'

const SplashScreen: React.FC<{ onFinish?: () => void }> = ({ onFinish }) => {
  const [stage, setStage] = useState(1)

  useEffect(() => {
    const t1 = setTimeout(() => setStage(2), 700)
    const t2 = setTimeout(() => setStage(3), 1400)
    const t3 = setTimeout(() => onFinish?.(), 2200)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [onFinish])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden"
    >
      <div className="relative w-64 h-64">

        <AnimatePresence>
          {stage >= 2 && (
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 shadow-[0_0_40px_rgba(168,85,247,0.6)]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🎱 Casino Black Ball */}
        <motion.div
          initial={{ x: 100, y: -100, opacity: 0, scale: 0 }}
          animate={
            stage === 3
              ? { x: -30, y: 60, opacity: 1, scale: 1 }
              : { x: 120, y: -80, opacity: 1, scale: 1.2, rotate: -360 }
          }
          transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.1 }}
          className="absolute"
        >
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            <span className="text-white font-black text-xs">8</span>
          </div>
        </motion.div>

        {/* 🎡 Roulette */}
        <motion.div
          initial={{ x: -100, y: 100, opacity: 0, scale: 0 }}
          animate={
            stage === 3
              ? { x: 30, y: 60, opacity: 1, scale: 1 }
              : { x: -120, y: 80, opacity: 1, scale: 1.2, rotate: 720 }
          }
          transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.2 }}
          className="absolute"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-900 rounded-full flex items-center justify-center shadow-[0_0_15px_#008A3D]">
            <Disc size={24} className="text-white animate-spin-slow" />
          </div>
        </motion.div>

        {/* ✈️ Aviator */}
        <motion.div
          initial={{ x: 100, y: 100, opacity: 0, scale: 0 }}
          animate={
            stage === 3
              ? { x: 90, y: 60, opacity: 1, scale: 1 }
              : { x: 120, y: [80, 60, 80], opacity: 1, scale: 1.2 }
          }
          transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.3 }}
          className="absolute"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-900 rounded-full flex items-center justify-center shadow-[0_0_15px_#D10000]">
            <Plane size={24} className="text-white" />
          </div>
        </motion.div>

      </div>
    </motion.div>
  )
}

export default SplashScreen
