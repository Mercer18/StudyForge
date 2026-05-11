"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, X, Loader2 } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function ChatTutor({ subjectId, onClose }: { subjectId: string, onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am your StudyForge Tutor. Ask me anything about the document you are currently reading.' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/chat/${subjectId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      })

      if (!response.ok) throw new Error('Failed to fetch chat response')
      
      const data = await response.json()
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch (error) {
      console.error(error)
      setMessages(prev => [...prev, { role: 'assistant', content: '**Error:** I am having trouble connecting to the forge right now. Please try again later.' }])
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

  return (
    <div className="flex flex-col h-full bg-card/95 backdrop-blur-3xl border-l shadow-2xl border-white/10 w-80 md:w-96 absolute right-0 top-0 bottom-0 z-50 transition-transform duration-300 transform translate-x-0">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-background/50">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          <h3 className="font-heading font-bold tracking-wider text-sm uppercase">StudyForge Tutor</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 hover:bg-white/5 rounded-full">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center shadow-md ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted border border-white/10'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-primary" />}
              </div>
              <div className={`p-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user' ? 'bg-primary/10 text-foreground border border-primary/20 rounded-tr-sm' : 'bg-muted/50 text-muted-foreground border border-white/5 rounded-tl-sm'}`}>
                {msg.role === 'user' ? (
                  msg.content
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-background/50 prose-pre:border prose-pre:border-white/10 prose-ul:pl-4 prose-li:my-1 prose-strong:text-primary">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex w-full justify-start">
            <div className="flex max-w-[85%] gap-3 flex-row">
              <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-muted border border-white/10 shadow-md">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="p-4 rounded-2xl bg-muted/50 border border-white/5 rounded-tl-sm flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-xs text-muted-foreground font-medium">Forging answer...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10 bg-background/50">
        <div className="relative flex items-center">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about this document..."
            className="pr-12 bg-card/50 border-white/10 focus-visible:ring-primary h-12 rounded-xl"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || isLoading}
            size="icon"
            className="absolute right-1.5 h-9 w-9 rounded-lg bg-primary hover:bg-primary/80 text-primary-foreground shadow-md transition-all"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
