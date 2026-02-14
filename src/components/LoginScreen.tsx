import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Lock, User } from 'lucide-react'

interface LoginScreenProps {
  onLogin: () => void
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(false)

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, pass }),
      })

      if (res.ok) {
        localStorage.setItem('auth', 'true')
        onLogin()
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center min-h-screen p-6 font-rajdhani"
    >
      <div className="w-full max-w-sm glass rounded-[40px] p-8 border border-white/20">
        <header className="text-center mb-10">
          <h1 className="text-6xl font-orbitron font-black text-white text-glow">
            VICK V4
          </h1>
          <p className="mt-2 text-[10px] tracking-[0.3em] uppercase text-red-400">
            VITAL PRONO
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="password"
              placeholder="VITAL"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
              className="w-full py-5 px-6 rounded-2xl bg-black/40 text-white text-center tracking-[1em] border border-white/10 focus:border-red-500/50 outline-none"
            />
            <User className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder="PRONOSTIC"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
              className="w-full py-5 px-6 rounded-2xl bg-black/40 text-white text-center tracking-[1em] border border-white/10 focus:border-green-500/50 outline-none"
            />
            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          </div>

          {error && (
            <div className="text-center text-red-400 text-xs font-bold uppercase tracking-widest">
              Accès refusé
            </div>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={isSubmitting}
            className="w-full py-5 rounded-2xl bg-gradient-to-r from-red-600 to-red-900 font-orbitron font-bold tracking-[0.2em] text-white flex justify-center items-center space-x-2"
          >
            {isSubmitting ? 'VERIFICATION...' : (
              <>
                <ShieldCheck size={20} />
                <span>CONNECTER</span>
              </>
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  )
}

export default LoginScreen
