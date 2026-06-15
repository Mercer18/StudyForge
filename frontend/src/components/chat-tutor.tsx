"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, X, Loader2 } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import { createClient } from '@/utils/supabase/client'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const HELPER_PROMPTS = [
  { label: "🧬 core terms", prompt: "Extract the 5 most critical terms from this section and define them clearly." },
  { label: "📝 summarize", prompt: "Provide a high-fidelity 3-bullet summary of the main points in this section." },
  { label: "❓ quiz me", prompt: "Create a brief 3-question multiple choice quiz based on this content to test my retention." },
  { label: "✨ analogy", prompt: "Explain the core technical concepts of this section using a simple real-world analogy." }
]

export function ChatTutor({ 
  subjectId, 
  onClose,
  width,
  setWidth
}: { 
  subjectId: string, 
  onClose: () => void,
  width: number,
  setWidth: (w: number) => void
}) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am your StudyForge Tutor. Ask me any clarifying questions about the document or click the shortcut chips below to evaluate facts.' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll helper
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (textToSend = input) => {
    const text = textToSend.trim()
    if (!text || isLoading) return

    const userMessage: Message = { role: 'user', content: text }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8085"
      const response = await fetch(`${apiBase}/api/v1/chat/${subjectId}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`
        },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      })

      if (!response.ok) throw new Error('Failed to fetch chat response')
      
      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch (error) {
      console.error(error)
      setMessages(prev => [...prev, { role: 'assistant', content: '**Error:** Failed to connect to core LLM. Ensure your local FastAPI backend is active and try again.' }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const triggerHelper = (promptText: string) => {
    if (isLoading) return
    handleSend(promptText)
  }

  const startResizing = (mouseDownEvent: React.MouseEvent) => {
    mouseDownEvent.preventDefault()
    const startX = mouseDownEvent.clientX
    const startWidth = width

    const doDrag = (mouseMoveEvent: MouseEvent) => {
      const deltaX = mouseMoveEvent.clientX - startX
      const newWidth = Math.max(280, Math.min(600, startWidth - deltaX))
      setWidth(newWidth)
    }

    const stopDrag = () => {
      document.removeEventListener('mousemove', doDrag)
      document.removeEventListener('mouseup', stopDrag)
    }

    document.addEventListener('mousemove', doDrag)
    document.addEventListener('mouseup', stopDrag)
  }

  return (
    <div 
      className="flex flex-col bg-card/95 backdrop-blur-md border-l border-border fixed right-0 top-14 bottom-0 z-40 font-sans shadow-2xl animate-in slide-in-from-right duration-300"
      style={{ width }}
    >
      {/* Drag Resizer Handle */}
      <div
        onMouseDown={startResizing}
        className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-primary/45 active:bg-primary transition-colors z-50 flex items-center justify-center group select-none"
      >
        <div className="w-0.5 h-8 bg-border/60 group-hover:bg-primary/60 rounded" />
      </div>
      
      {/* Header Deck */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20 select-none">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          <h3 className="font-heading font-bold tracking-wider text-sm uppercase">StudyForge Tutor</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="key-badge">esc</span>
          <button 
            onClick={onClose} 
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/40 cursor-pointer flex items-center justify-center transition-all border border-transparent hover:border-border"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Minimalist Avatar */}
              <div className={`flex-shrink-0 h-8 w-8 rounded-full border flex items-center justify-center select-none ${
                msg.role === 'user' 
                  ? 'bg-primary text-primary-foreground border-primary/20 shadow-sm' 
                  : 'bg-muted border-border text-primary shadow-sm'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`p-3.5 rounded-2xl text-sm leading-relaxed font-sans shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-primary/10 text-foreground border border-primary/20 rounded-tr-sm' 
                  : 'bg-muted/50 text-foreground border border-border rounded-tl-sm'
              }`}>
                {msg.role === 'user' ? (
                  msg.content
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none text-left prose-p:leading-relaxed prose-p:text-sm prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border prose-ul:pl-4 prose-li:my-1 prose-strong:text-primary prose-strong:font-bold">
                    <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: false }]]}>{msg.content}</ReactMarkdown>
                  </div>
                )}
              </div>

            </div>
          </div>
        ))}

        {/* Loading State */}
        {isLoading && (
          <div className="flex w-full justify-start animate-pulse select-none">
            <div className="flex max-w-[85%] gap-3 flex-row">
              <div className="flex-shrink-0 h-8 w-8 rounded-full border border-border bg-muted flex items-center justify-center text-primary">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-muted/50 border border-border rounded-tl-sm flex items-center gap-2 text-xs text-muted-foreground font-medium">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                <span>Forging answer...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area & Prompts shortcuts Console */}
      <div className="p-4 border-t border-border bg-muted/10">
        
        {/* Helper prompt chips (Monkeytype DNA) */}
        <div className="flex flex-wrap gap-1.5 mb-3 select-none">
          {HELPER_PROMPTS.map((helper, idx) => (
            <button
              key={idx}
              onClick={() => triggerHelper(helper.prompt)}
              disabled={isLoading}
              className="text-[10px] font-mono font-bold uppercase py-1.5 px-2.5 rounded-lg border border-border bg-card/60 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {helper.label}
            </button>
          ))}
        </div>

        <div className="relative flex items-center">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about this document..."
            className="pr-12 bg-card border-border focus-visible:ring-1 focus-visible:ring-primary h-12 rounded-xl text-sm"
            disabled={isLoading}
          />
          <Button 
            onClick={() => handleSend()} 
            disabled={!input.trim() || isLoading}
            size="icon"
            className="absolute right-1.5 h-9 w-9 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all cursor-pointer flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

      </div>
      
    </div>
  )
}
