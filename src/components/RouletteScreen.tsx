import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

interface RouletteNumber {
  n: number
  c: 'red' | 'black' | 'green'
}

interface ConfirmDialog {
  isOpen: boolean
  message: string
  onConfirm: () => void
}

const RouletteScreen: React.FC = () => {
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialog | null>(null)

  const numbers: RouletteNumber[] = [
    { n: 0, c: 'green' },
    { n: 1, c: 'red' },
    { n: 2, c: 'black' },
    { n: 3, c: 'red' },
    { n: 4, c: 'black' },
  ]

  const handleDangerAction = () => {
    setConfirmDialog({
      isOpen: true,
      message: 'Voulez-vous vraiment quitter le module roulette ?',
      onConfirm: () => {
        setConfirm
