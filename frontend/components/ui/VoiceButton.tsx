'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { cn, API_BASE } from '@/lib/utils'
import { Mic, MicOff, Loader2 } from 'lucide-react'

// Extend window for browser Speech Recognition
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition
    webkitSpeechRecognition?: new () => SpeechRecognition
  }
}

interface VoiceButtonProps {
  onTranscript: (text: string) => void
  language?: string
  className?: string
}

// Browser language codes for Web Speech API
const SPEECH_LANG_MAP: Record<string, string> = {
  en: 'en-IN', hi: 'hi-IN', bn: 'bn-IN', te: 'te-IN',
  ta: 'ta-IN', mr: 'mr-IN', gu: 'gu-IN', kn: 'kn-IN',
  ml: 'ml-IN', pa: 'pa-IN',
}

export function VoiceButton({ onTranscript, language = 'en', className }: VoiceButtonProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [useServerSTT, setUseServerSTT] = useState(true)
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const chunks = useRef<Blob[]>([])
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // Probe whether server STT is available on first load
  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then(r => r.json())
      .then(data => {
        // If no OpenAI key, server STT won't work — prefer browser STT
        const hasOpenAI = data?.openai_configured === true
        setUseServerSTT(hasOpenAI)
      })
      .catch(() => setUseServerSTT(false))
  }, [])

  // === Browser Web Speech API (free, no server needed) ===
  const startBrowserSTT = useCallback(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognitionAPI) {
      alert('Voice input is not supported in this browser. Please use Chrome.')
      return
    }
    const recognition = new SpeechRecognitionAPI()
    recognition.lang = SPEECH_LANG_MAP[language] || 'en-IN'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = e.results[0][0].transcript
      onTranscript(transcript)
    }
    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      console.error('Browser STT error:', e.error)
      setIsRecording(false)
    }
    recognition.onend = () => setIsRecording(false)

    recognitionRef.current = recognition
    recognition.start()
    setIsRecording(true)
  }, [language, onTranscript])

  const stopBrowserSTT = useCallback(() => {
    recognitionRef.current?.stop()
    setIsRecording(false)
  }, [])

  // === Server STT via OpenAI Whisper (optional) ===
  const startServerSTT = useCallback(async () => {
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
          const response = await fetch(`${API_BASE}/api/voice/stt`, { method: 'POST', body: formData })
          const data = await response.json()
          if (data.success && data.data?.text) {
            onTranscript(data.data.text)
          } else {
            // Server STT unavailable — switch to browser
            setUseServerSTT(false)
          }
        } catch {
          setUseServerSTT(false)
        } finally {
          setIsProcessing(false)
          stream.getTracks().forEach(t => t.stop())
        }
      }

      mediaRecorder.current.start()
      setIsRecording(true)
    } catch {
      // Microphone denied — fall back to browser STT
      startBrowserSTT()
    }
  }, [language, onTranscript, startBrowserSTT])

  const stopServerSTT = useCallback(() => {
    if (mediaRecorder.current?.state !== 'inactive') {
      mediaRecorder.current?.stop()
      setIsRecording(false)
    }
  }, [])

  const toggleRecording = () => {
    if (isRecording) {
      useServerSTT ? stopServerSTT() : stopBrowserSTT()
    } else {
      useServerSTT ? startServerSTT() : startBrowserSTT()
    }
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
