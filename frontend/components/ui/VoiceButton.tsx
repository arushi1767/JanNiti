'use client'

import { useState, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Mic, MicOff, Loader2 } from 'lucide-react'

interface VoiceButtonProps {
  onTranscript: (text: string) => void
  language?: string
  className?: string
}

export function VoiceButton({ onTranscript, language = 'en', className }: VoiceButtonProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const chunks = useRef<Blob[]>([])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4',
      })
      chunks.current = []

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data)
      }

      mediaRecorder.current.onstop = async () => {
        const blob = new Blob(chunks.current, { type: 'audio/webm' })
        setIsProcessing(true)

        try {
          const formData = new FormData()
          formData.append('audio', blob, 'recording.webm')
          formData.append('language', language)

          const response = await fetch('http://localhost:8000/api/voice/stt', {
            method: 'POST',
            body: formData,
          })
          const data = await response.json()
          if (data.success) onTranscript(data.text)
        } catch (err) {
          console.error('STT failed, using fallback:', err)
        } finally {
          setIsProcessing(false)
          stream.getTracks().forEach(t => t.stop())
        }
      }

      mediaRecorder.current.start()
      setIsRecording(true)
    } catch (err) {
      console.error('Microphone access denied:', err)
    }
  }, [language, onTranscript])

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop()
      setIsRecording(false)
    }
  }, [])

  const toggleRecording = () => {
    if (isRecording) stopRecording()
    else startRecording()
  }

  return (
    <button
      onClick={toggleRecording}
      disabled={isProcessing}
      className={cn(
        'flex items-center justify-center w-14 h-14 rounded-full transition-all duration-200',
        isRecording
          ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30'
          : 'bg-primary-600 text-white hover:bg-primary-700 shadow-md',
        isProcessing && 'opacity-50 cursor-not-allowed',
        className
      )}
      aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
      title={isRecording ? 'Tap to stop' : 'Tap to speak'}
    >
      {isProcessing ? (
        <Loader2 className="w-6 h-6 animate-spin" />
      ) : isRecording ? (
        <MicOff className="w-6 h-6" />
      ) : (
        <Mic className="w-6 h-6" />
      )}
    </button>
  )
}
