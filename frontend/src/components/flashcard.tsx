"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, RotateCw, RefreshCw } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

interface FlashcardData {
  id: string
  front: string
  back: string
}

export function FlashcardView({ flashcards }: { flashcards: FlashcardData[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleNext = React.useCallback(() => {
    setIsFlipped(false)
    setTilt({ x: 0, y: 0 })
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % flashcards.length)
    }, 150)
  }, [flashcards.length])

  const handlePrev = React.useCallback(() => {
    setIsFlipped(false)
    setTilt({ x: 0, y: 0 })
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length)
    }, 150)
  }, [flashcards.length])

  // Keyboard navigation listener (Space to flip, arrows to navigate)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid firing if the user is typing in the chat sidebar or active inputs
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return
      }

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault()
        setIsFlipped((prev) => !prev)
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'l') {
        e.preventDefault()
        handleNext()
      }
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'h') {
        e.preventDefault()
        handlePrev()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handlePrev])

  if (!flashcards || flashcards.length === 0) {
    return <div className="text-center text-muted-foreground p-8 font-mono text-xs">No active study cards synthesized.</div>
  }

  // Real-time 3D Card Tilt Math based on mouse displacement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    
    // Compute distance from center of the card
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    
    // Rotate max 12 degrees
    const rotateX = -(y / (rect.height / 2)) * 12
    const rotateY = (x / (rect.width / 2)) * 12
    
    setTilt({ x: rotateX, y: rotateY })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

  const currentCard = flashcards[currentIndex]

  return (
    <div className="w-full max-w-xl flex flex-col items-center select-none font-sans">
      
      {/* 3D Scene View Box */}
      <div 
        className="relative w-full h-80 perspective-1000 cursor-pointer group"
        onClick={() => setIsFlipped(!isFlipped)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          className="w-full h-full duration-150 preserve-3d"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${isFlipped ? 180 - tilt.y : tilt.y}deg)`
          }}
        >
          {/* Card Front face */}
          <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-between p-8 text-center rounded-lg border border-border bg-card/60 backdrop-blur-md shadow-md transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] group-hover:border-primary/30 overflow-visible">
            <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">FRONT • STUDY CONCEPT</span>
            
            <div className="text-xl sm:text-2xl font-extrabold tracking-tight font-heading leading-snug max-w-md mx-auto my-auto text-foreground">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: false }]]}
                components={{ p: ({ children }) => <>{children}</> }}
              >
                {currentCard.front}
              </ReactMarkdown>
            </div>
            
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60 transition-colors group-hover:text-primary mt-auto">
              <RotateCw className="w-3.5 h-3.5" />
              <span className="font-mono uppercase tracking-wider">Click or Press space to flip</span>
            </div>
          </div>

          {/* Card Back face (reversed 180) */}
          <div className="absolute inset-0 [transform:rotateY(180deg)] backface-hidden flex flex-col items-center justify-between p-8 text-center rounded-lg border border-primary/20 bg-primary/[3%] backdrop-blur-md shadow-md transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] group-hover:border-primary/30 overflow-visible">
            <span className="font-mono text-[9px] text-primary uppercase tracking-widest font-bold">BACK • CORE SOLUTION</span>
            
            <div className="w-full max-w-md mx-auto my-auto text-foreground/90 overflow-y-auto max-h-[170px] pr-1 scrollbar-thin">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: false }]]}
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0 text-center leading-relaxed font-sans text-sm sm:text-base">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-4 text-left space-y-1 my-2 text-sm text-foreground/80">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-4 text-left space-y-1 my-2 text-sm text-foreground/80">{children}</ol>,
                  li: ({ children }) => <li className="text-xs sm:text-sm">{children}</li>,
                  code: ({ children, ...props }) => (
                    <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs text-primary" {...props}>
                      {children}
                    </code>
                  ),
                }}
              >
                {currentCard.back}
              </ReactMarkdown>
            </div>
            
            <div className="flex items-center gap-1 text-[10px] text-primary/70 mt-auto">
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="font-mono uppercase tracking-wider font-bold">Verifying Knowledge</span>
            </div>
          </div>

        </div>
      </div>

      {/* Tactile Monkeytype Controls Bar */}
      <div className="flex items-center justify-between w-full mt-8 px-2 font-mono">
        
        {/* Prev key badge */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handlePrev} 
          className="rounded border border-border h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted/40 cursor-pointer transition-all"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        {/* Dynamic Keybinding Helpers */}
        <div className="flex flex-col items-center gap-1.5 text-center">
          <div className="text-[11px] font-bold text-muted-foreground">
            Card <span className="text-foreground">{currentIndex + 1}</span> of {flashcards.length}
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[9px] text-muted-foreground/60 select-none">
            <span className="key-badge">space</span>
            <span>flip</span>
            <span className="text-border">|</span>
            <span className="key-badge">← / →</span>
            <span>swipe</span>
          </div>
        </div>
        
        {/* Next key badge */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleNext} 
          className="rounded border border-border h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted/40 cursor-pointer transition-all"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>

      </div>

    </div>
  )
}
