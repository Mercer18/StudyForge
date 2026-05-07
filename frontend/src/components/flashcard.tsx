"use client"

import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, RotateCw } from "lucide-react"

interface FlashcardData {
  id: string
  front: string
  back: string
}

export function FlashcardView({ flashcards }: { flashcards: FlashcardData[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  if (!flashcards || flashcards.length === 0) {
    return <div className="text-center text-muted-foreground p-8">No flashcards generated for this document.</div>
  }

  const handleNext = () => {
    setIsFlipped(false)
    // Small timeout to allow the flip animation to reset before changing content
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % flashcards.length)
    }, 150)
  }

  const handlePrev = () => {
    setIsFlipped(false)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length)
    }, 150)
  }

  const currentCard = flashcards[currentIndex]

  return (
    <div className="w-full max-w-2xl flex flex-col items-center">
      
      {/* 3D Scene Container for the Flip Effect */}
      <div 
        className="relative w-full h-80 sm:h-96 [perspective:1000px] cursor-pointer group"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div 
          className={`w-full h-full transition-all duration-500 [transform-style:preserve-3d] ${
            isFlipped ? '[transform:rotateY(180deg)]' : ''
          }`}
        >
          {/* Front of Card */}
          <Card className="absolute inset-0 backface-hidden flex items-center justify-center p-8 text-center shadow-[0_0_40px_-15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_50px_-15px_rgba(249,115,22,0.2)] transition-all duration-500 border border-white/10 group-hover:border-primary/40 bg-card/40 backdrop-blur-2xl">
            <CardContent className="p-0 flex flex-col items-center justify-center h-full w-full">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6 font-heading border border-primary/20">
                Question
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold leading-tight font-heading max-w-lg mx-auto">
                {currentCard.front}
              </h3>
              <div className="absolute bottom-6 left-0 w-full flex justify-center text-muted-foreground/60 transition-opacity group-hover:text-primary/70">
                <span className="flex items-center text-sm font-medium">
                  <RotateCw className="w-4 h-4 mr-2 animate-spin-slow" /> Click to flip
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Back of Card */}
          <Card className="absolute inset-0 [transform:rotateY(180deg)] backface-hidden flex items-center justify-center p-8 text-center bg-primary/5 backdrop-blur-2xl border border-primary/30 shadow-[0_0_50px_-15px_rgba(249,115,22,0.15)]">
            <CardContent className="p-0 flex flex-col items-center justify-center h-full w-full">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest mb-6 font-heading shadow-lg shadow-primary/30">
                Answer
              </span>
              <h3 className="text-xl sm:text-2xl font-medium leading-relaxed max-w-xl mx-auto">
                {currentCard.back}
              </h3>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between w-full mt-10 px-4">
        <Button variant="outline" size="icon" onClick={handlePrev} className="rounded-full h-14 w-14 border border-white/10 bg-card/50 backdrop-blur-md hover:bg-primary/20 hover:text-primary hover:border-primary/50 transition-all shadow-lg">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        <div className="text-sm font-bold tracking-widest uppercase text-muted-foreground bg-card/30 px-4 py-2 rounded-full border border-white/5 backdrop-blur-sm">
          Card <span className="text-foreground">{currentIndex + 1}</span> of {flashcards.length}
        </div>
        
        <Button variant="outline" size="icon" onClick={handleNext} className="rounded-full h-14 w-14 border border-white/10 bg-card/50 backdrop-blur-md hover:bg-primary/20 hover:text-primary hover:border-primary/50 transition-all shadow-lg">
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

    </div>
  )
}
