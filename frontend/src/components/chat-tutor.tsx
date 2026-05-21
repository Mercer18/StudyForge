"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, X, Loader2, Sparkles, Terminal } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
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

export function ChatTutor({ subjectId, onClose }: { subjectId: string, onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Tutor initialized. Ask any clarifying questions or click the shortcut chips below to evaluate facts.' }
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

      const response = await fetch(`http://127.0.0.1:8000/api/v1/chat/${subjectId}`, {
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

  return (
    <div className="flex flex-col h-full bg-card/95 backdrop-blur-md border-l border-border w-80 md:w-96 absolute right-0 top-0 bottom-0 z-40 transition-all duration-300 font-sans shadow-xl">
      
      {/* Header Deck */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20 select-none">
        <div className="flex items-center gap-1.5 text-primary">
          <Bot className="w-4 h-4 text-primary shrink-0" />
          <h3 className="font-mono text-[10px] uppercase font-bold tracking-widest leading-none">AI Study Tutor</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="key-badge">esc</span>
          <button 
            onClick={onClose} 
            className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/40 cursor-pointer flex items-center justify-center transition-all border border-transparent hover:border-border"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[90%] gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Minimalist Avatar */}
              <div className={`flex-shrink-0 h-7 w-7 rounded border flex items-center justify-center select-none ${
                msg.role === 'user' 
                  ? 'bg-primary/10 border-primary/20 text-primary' 
                  : 'bg-muted border-border text-muted-foreground'
              }`}>
                {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              {/* Message Bubble */}
              <div className={`p-3 rounded-lg text-xs leading-6 font-sans ${
                msg.role === 'user' 
                  ? 'bg-muted/40 text-foreground border border-border rounded-tr-none' 
                  : 'bg-primary/[2%] text-foreground/95 border border-primary/10 rounded-tl-none'
              }`}>
                {msg.role === 'user' ? (
                  <p className="font-mono">{msg.content}</p>
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none text-left prose-p:leading-6 prose-p:text-xs prose-pre:bg-muted/40 prose-pre:border prose-pre:border-border prose-ul:pl-4 prose-li:my-1 prose-strong:text-primary prose-strong:font-bold">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                  </div>
                )}
              </div>

            </div>
          </div>
        ))}

        {/* Loading Terminal State */}
        {isLoading && (
          <div className="flex w-full justify-start animate-pulse select-none">
            <div className="flex max-w-[90%] gap-2.5 flex-row">
              <div className="flex-shrink-0 h-7 w-7 rounded border border-border bg-muted flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="p-3 rounded-lg bg-card border border-border rounded-tl-none flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
                <Terminal className="w-3 h-3 text-primary animate-spin" />
                <span>{`>`} synthesizing answer</span>
                <span className="typing-caret w-1 h-3 bg-primary inline-block" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area & Prompts shortcuts Console */}
      <div className="p-4 border-t border-border bg-muted/10">
        
        {/* Helper prompt chips (Monkeytype DNA) */}
        <div className="flex flex-wrap gap-1.5 mb-3.5 select-none">
          {HELPER_PROMPTS.map((helper, idx) => (
            <button
              key={idx}
              onClick={() => triggerHelper(helper.prompt)}
              disabled={isLoading}
              className="text-[9px] font-mono font-bold uppercase py-1 px-2 rounded border border-border bg-card/60 text-muted-foreground hover:text-primary hover:border-primary/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
            placeholder="Query details..."
            className="pr-10 bg-card border-border focus-visible:ring-1 focus-visible:ring-primary h-10 rounded font-mono text-xs"
            disabled={isLoading}
          />
          <Button 
            onClick={() => handleSend()} 
            disabled={!input.trim() || isLoading}
            size="icon"
            className="absolute right-1.5 h-7 w-7 rounded bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>

      </div>
      
    </div>
  )
}
