'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { VoiceButton } from '@/components/ui/VoiceButton'
import { API_BASE } from '@/lib/utils'
import { Send, Loader2, Bot, User, Shield, AlertTriangle } from 'lucide-react'
import { cn, getConfidenceColor } from '@/lib/utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
  sources?: string[]
  confidence?: string
}

const SUGGESTED_QUESTIONS = [
  'Do I qualify for PM Kisan?',
  'What is the catch in Ayushman Bharat?',
  'What happens if I provide wrong information in MGNREGA?',
  'Compare PM Awas Yojana with PM SVANidhi',
  'How to apply for PM Ujjwala Yojana?',
  'Is there any hidden penalty in PM Mudra Yojana?',
]

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Namaste! I am JanNiti AI assistant. I can answer your questions about any Indian government scheme in simple language. Try asking "Do I qualify for PM Kisan?" or "What is the catch in Ayushman Bharat?"',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userMessage = input.trim()
    setInput('')

    const updatedMessages: Message[] = [...messages, { role: 'user', content: userMessage }]
    setMessages(updatedMessages)
    setLoading(true)

    try {
      // Build history (exclude the initial greeting, send last 10 turns)
      const history = updatedMessages.slice(-11, -1).map(m => ({
        role: m.role,
        content: m.content,
      }))

      const res = await fetch(`${API_BASE}/api/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          language: 'en',
          history,
        }),
      })
      const body = await res.json()
      const data = body.success ? body.data : null

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data?.reply || 'Sorry, I encountered an error. Please try again.',
        sources: data?.sources,
        confidence: data?.confidence,
      }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        confidence: 'Low',
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">AI Chatbot</h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">Ask anything about government schemes in natural language</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="h-[500px] overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-primary-600" />
                </div>
              )}
              <div className={cn(
                'max-w-[80%] rounded-2xl px-4 py-3',
                msg.role === 'user'
                  ? 'bg-primary-600 text-white rounded-br-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-md'
              )}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Shield className="w-3 h-3" />
                      Sources: {msg.sources.join(', ')}
                    </div>
                  </div>
                )}
                {msg.confidence && (
                  <span className={cn('text-xs font-medium mt-1 block', getConfidenceColor(msg.confidence))}>
                    Confidence: {msg.confidence}
                  </span>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-primary-600" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-md px-4 py-3">
                <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Ask a question about any scheme..."
                className="text-base"
                id="chat-input"
              />
            </div>
            <VoiceButton onTranscript={(text) => setInput(text)} />
            <Button onClick={handleSend} disabled={loading || !input.trim()} className="h-14 px-6">
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Try asking:</h3>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((q, i) => (
            <button key={i} onClick={() => setInput(q)}
              className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-400 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 transition-colors border border-gray-200 dark:border-gray-700">
              {q}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-sm text-amber-800 dark:text-amber-200">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>This AI assistant provides guidance based on publicly available information. Always verify with official government sources before applying.</span>
        </div>
      </div>
    </div>
  )
}
