import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  Search,
  Layers,
  CheckCircle2,
  ScanEye,
} from 'lucide-react'

interface ScannerScreenProps {
  onBack?: () => void
}

const ScannerScreen: React.FC<ScannerScreenProps> = () => {
  const [gameMode, setGameMode] = useState<'single' | 'multiple'>('single')
  const [image, setImage] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handle
