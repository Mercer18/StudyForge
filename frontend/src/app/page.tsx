"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  ArrowRight, 
  Sparkles, 
  BrainCircuit, 
  BookOpen, 
  Layers, 
  Zap, 
  Flame, 
  Terminal,
  MousePointerClick,
  ChevronRight,
  RefreshCw,
  GitBranch
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { AuthModal } from '@/components/auth-modal'

interface PresetTopic {
  title: string
  emoji: string
  rawText: string
  overview: string
  contentTitle: string
  content: string
  keyConcepts: string[]
  flashcard: { front: string; back: string }
  svgMap: React.ReactNode
}

const PRESETS: Record<string, PresetTopic> = {
  quantum: {
    title: "Quantum Physics 101",
    emoji: "🌌",
    rawText: "Quantum superposition allows particle-like systems to exist in multiple configurations simultaneously. The act of measurement collapses the wave function (Schrödinger's equation) into a single eigenvalue outcome. Quantum entanglement binds particle pairs regardless of distance.",
    overview: "A rapid synthesis of foundational quantum mechanics, illustrating wave-function superposition, Schrödinger collapse states, and instantaneous EPR entanglement.",
    contentTitle: "Quantum Mechanics & Superposition",
    content: "In classical physics, a coin is either heads or tails. In **quantum mechanics**, a system exists in a mathematical **superposition** of all possible configurations simultaneously. This state is mathematically described by Schrödinger's wave function Ψ. Only when a measurement is conducted does the wave function collapse into a single observable eigenvalue.",
    keyConcepts: ["Superposition", "Wave Function collapse", "Schrödinger Equation", "Quantum Entanglement"],
    flashcard: {
      front: "What is Quantum Superposition?",
      back: "A principle stating that physical systems exist in multiple states simultaneously until measured, mathematically defined by a wave function."
    },
    svgMap: (
      <svg viewBox="0 0 400 180" className="w-full h-full max-h-[160px] text-muted-foreground stroke-current fill-none">
        {/* Connection lines */}
        <line x1="200" y1="30" x2="100" y2="90" strokeWidth="1.5" className="stroke-primary/40" />
        <line x1="200" y1="30" x2="300" y2="90" strokeWidth="1.5" className="stroke-primary/40" />
        <line x1="100" y1="90" x2="100" y2="150" strokeWidth="1.5" strokeDasharray="3 3" className="stroke-muted-foreground/30" />
        <line x1="300" y1="90" x2="300" y2="150" strokeWidth="1.5" strokeDasharray="3 3" className="stroke-muted-foreground/30" />
        {/* Nodes */}
        <circle cx="200" cy="30" r="16" className="fill-card stroke-primary" strokeWidth="2" />
        <text x="200" y="34" textAnchor="middle" className="font-mono text-[9px] font-bold fill-foreground stroke-none">Ψ</text>
        <text x="200" y="10" textAnchor="middle" className="font-sans text-[10px] fill-foreground font-semibold stroke-none">Wave Function</text>

        <rect x="50" y="90" width="100" height="26" rx="4" className="fill-card stroke-border" strokeWidth="1" />
        <text x="100" y="106" textAnchor="middle" className="font-mono text-[9px] fill-primary font-bold stroke-none">SUPERPOSITION</text>

        <rect x="250" y="90" width="100" height="26" rx="4" className="fill-card stroke-border" strokeWidth="1" />
        <text x="300" y="106" textAnchor="middle" className="font-mono text-[9px] fill-primary font-bold stroke-none">ENTANGLEMENT</text>

        <circle cx="100" cy="150" r="10" className="fill-card stroke-muted-foreground" strokeWidth="1.5" />
        <text x="100" y="153" textAnchor="middle" className="font-mono text-[8px] fill-muted-foreground stroke-none">H/T</text>
        <text x="100" y="168" textAnchor="middle" className="font-sans text-[9px] fill-muted-foreground stroke-none">Measurement Collapse</text>

        <circle cx="300" cy="150" r="10" className="fill-card stroke-muted-foreground" strokeWidth="1.5" />
        <text x="300" y="153" textAnchor="middle" className="font-mono text-[8px] fill-muted-foreground stroke-none">EPR</text>
        <text x="300" y="168" textAnchor="middle" className="font-sans text-[9px] fill-muted-foreground stroke-none">Non-locality Spookiness</text>
      </svg>
    )
  },
  ai: {
    title: "Neural Nets & RAG",
    emoji: "🤖",
    rawText: "Neural networks utilize forward propagation to map inputs to weights, calculating loss. Backpropagation utilizes gradient descent to refine network weights. Retrieval-Augmented Generation (RAG) queries vector stores to fetch context for LLMs.",
    overview: "Deconstruction of Deep Learning optimization alongside state-of-the-art vector lookup retrieval architectures (RAG).",
    contentTitle: "Neural Networks & Vector RAG",
    content: "Deep **neural networks** learn patterns by passing inputs through layers of nodes (neurons), calculating a cost function, and using **backpropagation** via gradient descent to adjust internal weights. Modern LLM workspaces extend this using **RAG** (Retrieval-Augmented Generation), where documents are vectorized into semantic stores and queried in real-time.",
    keyConcepts: ["Deep Learning", "Gradient Descent", "Vector Embedding", "Context Retrieval"],
    flashcard: {
      front: "What is RAG in AI?",
      back: "Retrieval-Augmented Generation: A method that fetches external relevant document chunks from a vector database to ground LLM generation in factual data."
    },
    svgMap: (
      <svg viewBox="0 0 400 180" className="w-full h-full max-h-[160px] text-muted-foreground stroke-current fill-none">
        <line x1="60" y1="90" x2="160" y2="90" strokeWidth="1.5" className="stroke-primary/40" />
        <line x1="240" y1="90" x2="340" y2="90" strokeWidth="1.5" className="stroke-primary/40" />
        <path d="M 60 90 Q 200 10, 340 90" strokeWidth="1" strokeDasharray="3 3" className="stroke-muted-foreground/30" />

        <circle cx="60" cy="90" r="16" className="fill-card stroke-border" strokeWidth="1.5" />
        <text x="60" y="93" textAnchor="middle" className="font-mono text-[8px] fill-foreground stroke-none">INPUT</text>
        <text x="60" y="65" textAnchor="middle" className="font-sans text-[9px] fill-muted-foreground stroke-none">Academic Text</text>

        <rect x="160" y="70" width="80" height="40" rx="4" className="fill-card stroke-primary" strokeWidth="2" />
        <text x="200" y="90" textAnchor="middle" className="font-mono text-[9px] fill-primary font-bold stroke-none">EMBEDDING</text>
        <text x="200" y="102" textAnchor="middle" className="font-sans text-[8px] fill-muted-foreground stroke-none">Vector Space</text>

        <circle cx="340" cy="90" r="16" className="fill-card stroke-border" strokeWidth="1.5" />
        <text x="340" y="93" textAnchor="middle" className="font-mono text-[8px] fill-foreground stroke-none">LLM</text>
        <text x="340" y="65" textAnchor="middle" className="font-sans text-[9px] fill-muted-foreground stroke-none">Context Output</text>
      </svg>
    )
  }
}

export default function Home() {
  const [inputText, setInputText] = useState(PRESETS.quantum.rawText)
  const [activePreset, setActivePreset] = useState<"quantum" | "ai">("quantum")
  const [forgeState, setForgeState] = useState<"idle" | "forging" | "completed">("idle")
  const [terminalLogs, setTerminalLogs] = useState<string[]>([])
  const [playgroundTab, setPlaygroundTab] = useState<"notes" | "flashcards" | "diagram">("notes")
  const [flashcardFlipped, setFlashcardFlipped] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Subtle Mouse Tracking for premium background glow
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const selectPreset = (key: "quantum" | "ai") => {
    setActivePreset(key)
    setInputText(PRESETS[key].rawText)
    setForgeState("idle")
    setTerminalLogs([])
    setFlashcardFlipped(false)
  }

  const triggerForgeSimulation = () => {
    if (forgeState === "forging") return
    setForgeState("forging")
    setTerminalLogs([])
    setPlaygroundTab("notes")
    setFlashcardFlipped(false)

    const logs = [
      "Connecting to StudyForge Core Engine...",
      "Analyzing multi-modal raw document input string...",
      "Executing advanced semantic chunking (15,000-char segments)...",
      "Calling Groq Llama-3 high-performance LLM API...",
      "Forging knowledge graph & generating markdown data schema...",
      "Extracting study flashcards and compiling visual diagrams...",
      "Microsite forged successfully! Opening Workspace..."
    ]

    logs.forEach((log, index) => {
      setTimeout(() => {
        setTerminalLogs((prev) => [...prev, `> ${log}`])
        if (index === logs.length - 1) {
          setTimeout(() => {
            setForgeState("completed")
          }, 450)
        }
      }, (index + 1) * 350)
    })
  }

  return (
    <div 
      className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-start pt-24 pb-12 selection:bg-primary/20 transition-all duration-300 ease-in-out font-sans"
      style={{
        // Dynamic variable mapping for custom CSS radial glow
        "--x": `${mousePosition.x}px`,
        "--y": `${mousePosition.y}px`
      } as React.CSSProperties}
    >
      <Navbar />
      
      {/* Background Orbs & Ambient Mouse Glow */}
      <div className="absolute inset-0 ambient-glow pointer-events-none z-0" />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none animate-pulse duration-10000" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[45%] bg-amber-600/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container px-6 mx-auto relative z-10 flex flex-col items-center text-center">
        
        {/* Banner Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted/60 text-muted-foreground text-xs md:text-sm font-mono mb-8 border border-border shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
          <span>Transform raw documents into structured textbooks.</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-4xl font-heading leading-[1.1] text-foreground">
          Forge chaotic documents into <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-amber-500 to-amber-600">
            pure knowledge.
          </span>
        </h1>

        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mb-12 leading-relaxed">
          Upload PDFs, DOCX, or YouTube lectures. StudyForge parses, chunks, and structures them into tactile, lightning-fast workspaces packed with formulas, diagrams, and flashcards.
        </p>

        {/* Main CTA */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16 items-center justify-center">
          <AuthModal initialTab="signup">
            <Button size="lg" className="h-12 px-8 text-base font-semibold group relative overflow-hidden transition-all duration-300 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground shadow-[0_4px_20px_-5px_rgba(226,183,20,0.4)] cursor-pointer">
              <span className="relative z-10 flex items-center gap-2">
                Start Forging Free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </AuthModal>
        </div>

        {/* ==================== INTERACTIVE PLAYGROUND (MONKEYTYPE STYLE) ==================== */}
        <div className="w-full max-w-4xl border border-border rounded-xl bg-card/60 backdrop-blur-md shadow-2xl p-1 text-left relative z-20 overflow-hidden mb-24">
          
          {/* Deck Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/40">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
              <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
              <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
              <span className="font-mono text-xs text-muted-foreground ml-2">forge-playground.sh</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="key-badge">esc</span>
              <span className="text-xs text-muted-foreground font-mono">active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[380px]">
            
            {/* Left Interactive Input Section (5 columns) */}
            <div className="md:col-span-5 p-6 border-b md:border-b-0 md:border-r border-border flex flex-col justify-between space-y-6">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground font-mono uppercase tracking-wider">Source Material Input</h3>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => selectPreset("quantum")}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded transition-all ${
                        activePreset === "quantum" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      Quantum
                    </button>
                    <button
                      onClick={() => selectPreset("ai")}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded transition-all ${
                        activePreset === "ai" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      Neural Net
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value)
                      setForgeState("idle")
                    }}
                    placeholder="Paste academic syllabus, raw notes, or text here..."
                    className="w-full h-44 bg-muted/30 border border-border rounded-lg p-3.5 text-xs font-mono text-foreground leading-relaxed focus:outline-none focus:border-primary resize-none transition-colors"
                  />
                  <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5">
                    <span className="key-badge font-mono text-[9px]">chars: {inputText.length}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Button 
                  onClick={triggerForgeSimulation}
                  disabled={!inputText.trim() || forgeState === "forging"}
                  className="w-full h-11 text-xs font-mono font-bold tracking-wider uppercase bg-primary hover:bg-primary/95 text-primary-foreground shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Flame className="w-4 h-4 animate-pulse" />
                  {forgeState === "forging" ? "Forging In Progress..." : "Forge Interactive Microsite"}
                </Button>
                <p className="text-[10px] text-muted-foreground font-mono text-center">
                  Press <kbd className="bg-muted px-1.5 py-0.5 rounded border border-border text-[9px]">enter</kbd> or click to process
                </p>
              </div>

            </div>

            {/* Right Result Simulator (7 columns) */}
            <div className="md:col-span-7 bg-muted/10 flex flex-col overflow-hidden relative">
              
              {/* Idle State */}
              {forgeState === "idle" && (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <div className="p-3 rounded-full bg-muted/40 border border-border animate-bounce">
                    <MousePointerClick className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold font-mono">Workspace Generation Pending</h4>
                    <p className="text-xs text-muted-foreground max-w-sm">
                      Input your content or choose a pre-loaded topic, then click the forge button to watch StudyForge dynamically assemble a microsite.
                    </p>
                  </div>
                </div>
              )}

              {/* Forging State (Terminal Console Logs) */}
              {forgeState === "forging" && (
                <div className="flex-1 p-6 font-mono text-[11px] text-foreground space-y-2.5 overflow-y-auto bg-black/35 select-none animate-in fade-in duration-300">
                  <div className="flex items-center gap-2 text-primary pb-2 border-b border-white/5">
                    <Terminal className="w-3.5 h-3.5 animate-spin" />
                    <span>PARSING ENGINE INITIALIZED</span>
                  </div>
                  {terminalLogs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-1 leading-relaxed text-muted-foreground">
                      <span className="text-primary select-none shrink-0 font-bold">{`>`}</span>
                      <span className={idx === terminalLogs.length - 1 ? "text-primary font-bold" : ""}>
                        {log.substring(2)}
                      </span>
                      {idx === terminalLogs.length - 1 && <span className="typing-caret w-1.5 h-3.5 bg-primary inline-block ml-0.5" />}
                    </div>
                  ))}
                </div>
              )}

              {/* Completed Workspace State */}
              {forgeState === "completed" && (
                <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-500">
                  
                  {/* Miniature Workspace Tabs */}
                  <div className="flex border-b border-border bg-card/30 p-1 gap-1">
                    <button
                      onClick={() => setPlaygroundTab("notes")}
                      className={`flex-1 py-2 text-[10px] font-mono font-bold uppercase rounded transition-all flex items-center justify-center gap-1.5 ${
                        playgroundTab === "notes" ? "bg-card text-primary border border-border" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Notes
                    </button>
                    <button
                      onClick={() => setPlaygroundTab("flashcards")}
                      className={`flex-1 py-2 text-[10px] font-mono font-bold uppercase rounded transition-all flex items-center justify-center gap-1.5 ${
                        playgroundTab === "flashcards" ? "bg-card text-primary border border-border" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      Flashcards
                    </button>
                    <button
                      onClick={() => setPlaygroundTab("diagram")}
                      className={`flex-1 py-2 text-[10px] font-mono font-bold uppercase rounded transition-all flex items-center justify-center gap-1.5 ${
                        playgroundTab === "diagram" ? "bg-card text-primary border border-border" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <GitBranch className="w-3.5 h-3.5" />
                      Diagram
                    </button>
                  </div>

                  {/* Playground Views */}
                  <div className="flex-1 p-6 overflow-y-auto max-h-[340px]">
                    
                    {playgroundTab === "notes" && (
                      <div className="space-y-4 animate-in fade-in duration-300">
                        <div className="space-y-2">
                          <h4 className="text-xl font-extrabold tracking-tight font-heading text-foreground">
                            {PRESETS[activePreset].contentTitle}
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {PRESETS[activePreset].keyConcepts.map((concept, index) => (
                              <span key={index} className="key-badge">{concept}</span>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground leading-6 font-sans">
                          {PRESETS[activePreset].content}
                        </p>
                        <div className="border border-primary/20 bg-primary/5 rounded-lg p-3">
                          <h5 className="text-[10px] font-bold text-primary uppercase font-mono tracking-wider mb-1">AI Document Overview</h5>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            {PRESETS[activePreset].overview}
                          </p>
                        </div>
                      </div>
                    )}

                    {playgroundTab === "flashcards" && (
                      <div className="h-full flex flex-col items-center justify-center py-4 animate-in fade-in duration-300 select-none">
                        {/* 3D Tactile Card Container */}
                        <div 
                          onClick={() => setFlashcardFlipped(!flashcardFlipped)}
                          className="w-full max-w-[280px] h-36 cursor-pointer perspective-1000 group/card"
                        >
                          <div className={`w-full h-full relative transition-transform duration-500 preserve-3d rounded-lg border border-border bg-card/65 shadow-md flex items-center justify-center p-4 text-center ${
                            flashcardFlipped ? "rotate-y-180" : ""
                          }`}>
                            
                            {/* Front Side */}
                            <div className="absolute inset-0 p-5 flex flex-col items-center justify-between backface-hidden">
                              <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">FRONT • STUDY CARD</span>
                              <p className="text-xs font-semibold text-foreground font-heading max-w-xs">{PRESETS[activePreset].flashcard.front}</p>
                              <span className="key-badge flex items-center gap-1">
                                Click to Flip <RefreshCw className="w-2.5 h-2.5" />
                              </span>
                            </div>

                            {/* Back Side */}
                            <div className="absolute inset-0 p-5 flex flex-col items-center justify-between backface-hidden rotate-y-180 bg-primary/5 border border-primary/20 rounded-lg">
                              <span className="font-mono text-[9px] text-primary uppercase tracking-widest font-bold">BACK • VERIFIED CORE ANSWER</span>
                              <p className="text-xs font-mono text-muted-foreground leading-relaxed">{PRESETS[activePreset].flashcard.back}</p>
                              <span className="key-badge font-mono text-[8px]">space to flip</span>
                            </div>

                          </div>
                        </div>
                      </div>
                    )}

                    {playgroundTab === "diagram" && (
                      <div className="h-full flex items-center justify-center py-2 animate-in fade-in duration-300">
                        <div className="w-full max-w-sm bg-card/40 border border-border/80 rounded-lg p-4 shadow-sm flex items-center justify-center">
                          {PRESETS[activePreset].svgMap}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Micro Footer CTA */}
                  <div className="border-t border-border px-6 py-2.5 bg-card/10 flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground font-mono">Dynamic learning workspace rendering engine v1.2</span>
                    <AuthModal initialTab="signup">
                      <button className="text-[10px] font-bold text-primary font-mono hover:underline flex items-center gap-1 cursor-pointer">
                        Forge personal files now <ChevronRight className="w-3 h-3" />
                      </button>
                    </AuthModal>
                  </div>

                </div>
              )}

            </div>

          </div>

        </div>

        {/* ==================== BENTO FEATURE CARDS SYSTEM ==================== */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-6 text-left relative z-20">
          
          {/* Card 1: Smart Microsites */}
          <div className="md:col-span-6 p-8 rounded-xl bg-card/40 border border-border/70 backdrop-blur-sm shadow-sm hover:border-primary/40 group transition-all duration-300">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary w-fit mb-6 transition-all duration-300 group-hover:scale-105">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-heading mb-2 text-foreground">Structured Workspaces</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Don't skim endless raw data. Our system categorizes content into crisp readings, summary overview badges, and formatted key takeaways automatically.
            </p>
          </div>

          {/* Card 2: Interactive Mind Maps */}
          <div className="md:col-span-6 p-8 rounded-xl bg-card/40 border border-border/70 backdrop-blur-sm shadow-sm hover:border-primary/40 group transition-all duration-300">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary w-fit mb-6 transition-all duration-300 group-hover:scale-105">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold font-heading mb-2 text-foreground">Tactile Concepts & Diagrams</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Generate native mathematical formatting via LaTeX expressions and visualize multi-node dependencies directly using dynamic SVG-rendered flow charts.
            </p>
          </div>

          {/* Card 3: Deep Processing Engine */}
          <div className="md:col-span-4 p-6 rounded-xl bg-card/40 border border-border/70 backdrop-blur-sm shadow-sm hover:border-primary/40 group transition-all duration-300">
            <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary w-fit mb-5 transition-all duration-300 group-hover:scale-105">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold font-heading mb-2 text-foreground">Map-Reduce Processing</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              No context size failures. Slices huge documentation or hours-long YouTube closed captions into neat semantic chunks and synthesizes them into books.
            </p>
          </div>

          {/* Card 4: Keyboard Driven UX */}
          <div className="md:col-span-4 p-6 rounded-xl bg-card/40 border border-border/70 backdrop-blur-sm shadow-sm hover:border-primary/40 group transition-all duration-300">
            <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary w-fit mb-5 transition-all duration-300 group-hover:scale-105">
              <Terminal className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold font-heading mb-2 text-foreground">Performance Keybindings</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Interact seamlessly without taking your hands off the keyboard. Tap spacebars to flip cards, arrow keys for review, and escape to toggle side chat.
            </p>
          </div>

          {/* Card 5: Gamified Streaks */}
          <div className="md:col-span-4 p-6 rounded-xl bg-card/40 border border-border/70 backdrop-blur-sm shadow-sm hover:border-primary/40 group transition-all duration-300">
            <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary w-fit mb-5 transition-all duration-300 group-hover:scale-105">
              <Flame className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold font-heading mb-2 text-foreground">Deep Flow Mode</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Immerse yourself completely in study sessions. Activate the dimming Pomodoro timer deck to lock out distraction, trace progress streaks, and boost retention.
            </p>
          </div>

        </div>

      </div>
    </div>
  )
}
