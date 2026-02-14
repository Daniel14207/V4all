import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Upload, Wand2, Image as ImageIcon, AlertTriangle } from 'lucide-react'

const ImageEditorScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [image, setImage] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = e => setImage(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleEdit = async () => {
    if (!image || !prompt.trim()) {
      setShake(true)
      setTimeout(() => setShake(false), 400)
      return
    }

    setLoading(true)
    setResultImage(null)

    const res = await fetch('/api/image-edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: image.split(',')[1],
        prompt,
      }),
    })

    const data = await res.json()
    if (res.ok) setResultImage(data.image)
    setLoading(false)
  }

  return (
    <div className="h-screen px-6">
      <button onClick={onBack}><ArrowLeft /></button>

      <motion.div onClick={() => fileInputRef.current?.click()}>
        {image ? <img src={image} /> : <Upload />}
        <input type="file" hidden ref={fileInputRef} onChange={handleFileUpload} />
      </motion.div>

      <motion.input
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        animate={shake ? { x: [-5, 5, -5, 5, 0] } : {}}
      />

      <button onClick={handleEdit} disabled={loading}>
        {loading ? <Wand2 /> : <ImageIcon />}
        CONFIRMER SIGNAL
      </button>

      <AnimatePresence>
        {resultImage && (
          <motion.div>
            <AlertTriangle />
            <img src={resultImage} />
            <a href={resultImage} download>SAUVEGARDER</a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ImageEditorScreen
