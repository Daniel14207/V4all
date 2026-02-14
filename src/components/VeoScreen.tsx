import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Film, Loader2 } from 'lucide-react'

const VeoScreen: React.FC = () => {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [videoUrl, setVideoUrl] = useState<string | null>(null)

  const generateVideo = async () => {
    if (!prompt.trim()) return

    setLoading(true)
    setProgress(0)
    setVideoUrl(null)

    const steps = [
      'Initialisation du moteur...',
     
