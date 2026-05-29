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
import { AnimatedLogo } from '@/components/animated-logo'

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
      className="min-h-screen bg-background text-foreground relative overflow-x-hidden flex flex-col items-center justify-start pb-20 selection:bg-amber-500/25 selection:text-foreground transition-all duration-300 ease-in-out font-sans w-full"
      style={{
        "--x": `${mousePosition.x}px`,
        "--y": `${mousePosition.y}px`
      } as React.CSSProperties}
    >
      <Navbar />
      
      {/* Background Gradients Layer */}
      <div className="absolute inset-0 ambient-glow pointer-events-none z-0 opacity-80" />
      <div className="absolute top-[-10%] left-[-15%] w-[60%] h-[50%] bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08)_0%,transparent_70%)] blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-15%] w-[55%] h-[55%] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.06)_0%,transparent_75%)] blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-[20%] right-[10%] w-[350px] h-[350px] bg-primary/5 blur-[90px] rounded-full pointer-events-none animate-rotate-slow duration-30000 z-0" />
 
      {/* Main Hero Split Grid Container */}
      <div className="container px-4 sm:px-6 mx-auto relative z-10 max-w-7xl pt-16 sm:pt-24 lg:pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column (6 cols): Typography & Branding CTA */}
          <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6 relative z-10">
            

 
            {/* Giant Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] sm:leading-[1.1] font-heading">
              Forge chaotic files <br className="hidden sm:block" />
              into <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-amber-400 to-amber-500 drop-shadow-[0_2px_15px_rgba(245,158,11,0.15)]">pure knowledge.</span>
            </h1>
 
            {/* Premium Description */}
            <p className="text-sm sm:text-base text-muted-foreground max-w-lg leading-relaxed">
              Upload notes, complex textbooks, PDFs, slides, or YouTube lectures. StudyForge parses, chunks, and structures them into tactile, high-performance study workspaces packed with formulas, flippable cards, and interactive diagrams.
            </p>
 
            {/* Master CTA Actions */}
            <div className="flex flex-wrap gap-4 pt-2">
              <AuthModal initialTab="signup">
                <Button size="lg" className="h-11 px-6 text-xs font-bold font-mono tracking-wider uppercase bg-primary hover:bg-primary/95 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all rounded-full hover:scale-[1.02] cursor-pointer">
                  Start Forging Free <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </AuthModal>
              <a 
                href="#features" 
                className="h-11 px-6 rounded-full border border-border/80 hover:border-border bg-muted/40 hover:bg-muted/70 text-xs font-bold font-mono tracking-wider text-foreground transition-all flex items-center justify-center cursor-pointer"
              >
                EXPLORE FEATURES
              </a>
            </div>
 

 
          </div>
 
          {/* Right Column (6 cols): The Interactive Playground Deck inside Hero Card */}
          <div id="demo" className="lg:col-span-6 w-full relative z-20 scroll-mt-28">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-amber-500/10 blur-[40px] rounded-2xl opacity-60 pointer-events-none" />
            
            <div className="w-full border border-border/80 rounded-2xl bg-card/60 backdrop-blur-md shadow-2xl p-1 text-left relative overflow-hidden transition-all duration-300 hover:border-border">
              
              {/* Deck Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/20">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-foreground/10" />
                  <span className="font-mono text-[10px] text-muted-foreground ml-2">forge-playground.sh</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="key-badge">esc</span>
                  <span className="text-[10px] text-muted-foreground/70 font-mono">active</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 min-h-[380px]">
                
                {/* Left Interactive Input Section (5 columns) */}
                <div className="md:col-span-5 p-5 border-b md:border-b-0 md:border-r border-border/40 flex flex-col justify-between space-y-4">
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[10px] font-bold text-foreground font-mono uppercase tracking-wider">Raw Material</h3>
                      <div className="flex gap-1">
                        <button
                          onClick={() => selectPreset("quantum")}
                          className={`text-[9px] font-mono px-2 py-0.5 rounded transition-all ${
                            activePreset === "quantum" ? "bg-primary text-primary-foreground font-bold" : "bg-muted/40 text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          Quantum
                        </button>
                        <button
                          onClick={() => selectPreset("ai")}
                          className={`text-[9px] font-mono px-2 py-0.5 rounded transition-all ${
                            activePreset === "ai" ? "bg-primary text-primary-foreground font-bold" : "bg-muted/40 text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          Neural
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
                        placeholder="Paste lecture notes or transcripts..."
                        className="w-full h-40 bg-muted/20 border border-border/80 rounded-lg p-3 pb-10 text-[11px] font-mono text-foreground leading-relaxed focus:outline-none focus:border-primary/50 resize-none transition-colors"
                      />
                      <div className="absolute bottom-2 right-2">
                        <span className="key-badge font-mono text-[8px]">chars: {inputText.length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button 
                      onClick={triggerForgeSimulation}
                      disabled={!inputText.trim() || forgeState === "forging"}
                      className="w-full h-10 text-[10px] font-mono font-bold tracking-wider uppercase bg-primary hover:bg-primary/95 text-primary-foreground shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-[0.98]"
                    >
                      <Flame className="w-3.5 h-3.5 animate-pulse" />
                      {forgeState === "forging" ? "Forging..." : "Forge Workspace"}
                    </Button>
                    <p className="text-[9px] text-muted-foreground/60 font-mono text-center">
                      Click to process raw text inside AI Sandbox
                    </p>
                  </div>

                </div>

                {/* Right Result Simulator (7 columns) */}
                <div className="md:col-span-7 bg-muted/[0.03] dark:bg-white/[0.01] flex flex-col overflow-hidden relative">
                  
                  {/* Idle State */}
                  {forgeState === "idle" && (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
                      <div className="relative group p-4">
                        <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full scale-75 group-hover:scale-100 transition-transform duration-500 opacity-60 pointer-events-none" />
                        <AnimatedLogo size={72} className="relative z-10 animate-pulse duration-[3000ms]" />
                      </div>
                      <div className="space-y-1 relative z-10">
                        <h4 className="text-xs font-semibold font-mono text-foreground tracking-wide uppercase">Forge Sandbox Idle</h4>
                        <p className="text-[10px] text-muted-foreground max-w-[220px] leading-relaxed mx-auto">
                          Select a lecture preset or paste custom texts, then trigger the forge to assemble.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Forging State (Terminal Console Logs + Assembly Hologram) */}
                  {forgeState === "forging" && (
                    <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-muted/20 dark:bg-black/40 divide-y md:divide-y-0 md:divide-x divide-border/40 select-none animate-in fade-in duration-300">
                      {/* Left: Terminal Console Logs */}
                      <div className="flex-1 p-5 font-mono text-[10px] text-foreground/90 space-y-2 overflow-y-auto min-h-[160px] md:min-h-0">
                        <div className="flex items-center gap-2 text-primary pb-2 border-b border-border/40">
                          <Terminal className="w-3 h-3 animate-spin" />
                          <span>CORE ENGINE PROCESSING</span>
                        </div>
                        {terminalLogs.map((log, idx) => (
                          <div key={idx} className="flex items-start gap-1 leading-relaxed text-muted-foreground">
                            <span className="text-primary select-none shrink-0 font-bold">{`>`}</span>
                            <span className={idx === terminalLogs.length - 1 ? "text-primary font-bold" : ""}>
                              {log.substring(2)}
                            </span>
                            {idx === terminalLogs.length - 1 && <span className="typing-caret w-1 h-3 bg-primary inline-block ml-0.5" />}
                          </div>
                        ))}
                      </div>

                      {/* Right: Assembly Hologram Visualization */}
                      <div className="w-full md:w-44 flex flex-col items-center justify-center p-6 bg-muted/[0.03] dark:bg-white/[0.01] shrink-0 space-y-3">
                        <div className="relative">
                          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse pointer-events-none" />
                          <AnimatedLogo size={80} className="relative z-10" />
                        </div>
                        <div className="text-center">
                          <span className="font-mono text-[8px] font-bold text-amber-500 uppercase tracking-widest animate-pulse">
                            Forging: 78%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Completed Workspace State */}
                  {forgeState === "completed" && (
                    <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-500">
                      
                      {/* Miniature Workspace Tabs */}
                      <div className="flex border-b border-border/50 bg-muted/20 p-1 gap-1">
                        <button
                          onClick={() => setPlaygroundTab("notes")}
                          className={`flex-1 py-1.5 text-[9px] font-mono font-bold uppercase rounded transition-all flex items-center justify-center gap-1.5 ${
                            playgroundTab === "notes" ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <BookOpen className="w-3 h-3" />
                          Notes
                        </button>
                        <button
                          onClick={() => setPlaygroundTab("flashcards")}
                          className={`flex-1 py-1.5 text-[9px] font-mono font-bold uppercase rounded transition-all flex items-center justify-center gap-1.5 ${
                            playgroundTab === "flashcards" ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Layers className="w-3 h-3" />
                          Cards
                        </button>
                        <button
                          onClick={() => setPlaygroundTab("diagram")}
                          className={`flex-1 py-1.5 text-[9px] font-mono font-bold uppercase rounded transition-all flex items-center justify-center gap-1.5 ${
                            playgroundTab === "diagram" ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <GitBranch className="w-3 h-3" />
                          Mind Map
                        </button>
                      </div>

                      {/* Playground Views */}
                      <div className="flex-1 p-5 overflow-y-auto max-h-[300px]">
                        
                        {playgroundTab === "notes" && (
                          <div className="space-y-4 animate-in fade-in duration-300 text-left">
                            <div className="space-y-2">
                              <h4 className="text-base font-extrabold tracking-tight font-heading text-foreground">
                                {PRESETS[activePreset].contentTitle}
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {PRESETS[activePreset].keyConcepts.map((concept, index) => (
                                  <span key={index} className="key-badge text-[8px]">{concept}</span>
                                ))}
                              </div>
                            </div>
                            <p className="text-[10px] text-muted-foreground leading-relaxed font-sans">
                              {PRESETS[activePreset].content}
                            </p>
                            <div className="border border-primary/20 bg-primary/5 rounded-lg p-2.5">
                              <h5 className="text-[8px] font-bold text-primary uppercase font-mono tracking-wider mb-0.5">AI Summary Badge</h5>
                              <p className="text-[9px] text-muted-foreground/85 leading-relaxed">
                                {PRESETS[activePreset].overview}
                              </p>
                            </div>
                          </div>
                        )}

                        {playgroundTab === "flashcards" && (
                          <div className="h-full flex flex-col items-center justify-center py-2 animate-in fade-in duration-300 select-none">
                            <div 
                              onClick={() => setFlashcardFlipped(!flashcardFlipped)}
                              className="w-full max-w-[240px] h-28 cursor-pointer perspective-1000 group/card"
                            >
                              <div className={`w-full h-full relative transition-transform duration-500 preserve-3d rounded-lg border border-border/80 bg-muted/10 hover:bg-muted/20 shadow-md flex items-center justify-center p-4 text-center ${
                                flashcardFlipped ? "rotate-y-180" : ""
                              }`}>
                                
                                {/* Front Side */}
                                <div className="absolute inset-0 p-4 flex flex-col items-center justify-between backface-hidden">
                                  <span className="font-mono text-[8px] text-muted-foreground uppercase tracking-widest">FRONT • STUDY</span>
                                  <p className="text-[10px] font-semibold text-foreground font-heading max-w-xs">{PRESETS[activePreset].flashcard.front}</p>
                                  <span className="key-badge flex items-center gap-1 text-[8px]">
                                    Click to Flip <RefreshCw className="w-2 h-2" />
                                  </span>
                                </div>

                                {/* Back Side */}
                                <div className="absolute inset-0 p-4 flex flex-col items-center justify-between backface-hidden rotate-y-180 bg-primary/5 border border-primary/20 rounded-lg">
                                  <span className="font-mono text-[8px] text-primary uppercase tracking-widest font-bold">BACK • ANSWER</span>
                                  <p className="text-[10px] font-mono text-muted-foreground leading-relaxed">{PRESETS[activePreset].flashcard.back}</p>
                                  <span className="key-badge font-mono text-[7px]">click to flip back</span>
                                </div>

                              </div>
                            </div>
                          </div>
                        )}

                        {playgroundTab === "diagram" && (
                          <div className="h-full flex items-center justify-center py-1 animate-in fade-in duration-300">
                            <div className="w-full max-w-xs bg-muted/10 border border-border/60 rounded-lg p-3 shadow-sm flex items-center justify-center">
                              {PRESETS[activePreset].svgMap}
                            </div>
                          </div>
                        )}

                      </div>

                      {/* Micro Footer CTA */}
                      <div className="border-t border-border/40 px-4 py-2.5 bg-muted/[0.03] flex items-center justify-between shrink-0">
                        <span className="text-[8px] text-muted-foreground/60 font-mono">Workspace Engine v1.2</span>
                        <AuthModal initialTab="signup">
                          <button className="text-[9px] font-bold text-primary font-mono hover:underline flex items-center gap-0.5 cursor-pointer bg-transparent border-none outline-none">
                            Forge your files <ChevronRight className="w-2.5 h-2.5" />
                          </button>
                        </AuthModal>
                      </div>

                    </div>
                  )}

                </div>

              </div>

            </div>
          </div>

        </div>
      </div>



      {/* ==================== BENTO GRID FEATURES ==================== */}
      <section id="features" className="container px-4 sm:px-6 mx-auto relative z-10 max-w-5xl py-24 sm:py-32 scroll-mt-28">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-foreground">
            The last study workspace you'll ever need
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            StudyForge handles mapping, organizing, and synthesizing academic workloads like an expert teaching assistant.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-fr">
          
          {/* Card 1: Structured Workspaces (6 cols) */}
          <div className="md:col-span-6 p-8 rounded-2xl bg-card/40 hover:bg-card/60 border border-border/80 hover:border-amber-500/40 backdrop-blur-sm shadow-xl group transition-all duration-300 relative flex flex-col justify-between overflow-hidden">
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-primary w-fit mb-6 transition-all duration-300 group-hover:scale-105">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-heading mb-2 text-foreground">Structured Workspaces</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Skip raw pages. StudyForge slices and maps incoming texts into gorgeous, legible reading segments with automatic bulleted core concept tags.
              </p>
            </div>
          </div>

          {/* Card 2: Interactive Mind Maps (6 cols) */}
          <div className="md:col-span-6 p-8 rounded-2xl bg-card/40 hover:bg-card/60 border border-border/80 hover:border-amber-500/40 backdrop-blur-sm shadow-xl group transition-all duration-300 relative flex flex-col justify-between overflow-hidden">
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div>
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 dark:text-purple-300 w-fit mb-6 transition-all duration-300 group-hover:scale-105">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-heading mb-2 text-foreground">Tactile Mind Map Diagrams</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Visualize syllabus taxonomies directly. Render dynamic units in colorful grids connected by flowing SVG arrows to track units, topics, and bottom-drawer cross-cutting concepts.
              </p>
            </div>
          </div>

          {/* Card 3: Deep Map-Reduce Processing (4 cols) */}
          <div className="md:col-span-4 p-6 rounded-2xl bg-card/40 hover:bg-card/60 border border-border/80 hover:border-amber-500/40 backdrop-blur-sm shadow-xl group transition-all duration-300 relative flex flex-col justify-between overflow-hidden">
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div>
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-primary w-fit mb-5 transition-all duration-300 group-hover:scale-105">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold font-heading mb-2 text-foreground">Map-Reduce Processing</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Zero context failures. Slices extensive textbook syllabi or transcripts into neat vectors and parses them securely in seconds.
              </p>
            </div>
          </div>

          {/* Card 4: Keyboard Driven UX (4 cols) */}
          <div className="md:col-span-4 p-6 rounded-2xl bg-card/40 hover:bg-card/60 border border-border/80 hover:border-amber-500/40 backdrop-blur-sm shadow-xl group transition-all duration-300 relative flex flex-col justify-between overflow-hidden">
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div>
              <div className="p-2.5 rounded-lg bg-muted/60 dark:bg-white/10 border border-border/80 dark:border-white/20 text-foreground dark:text-gray-300 w-fit mb-5 transition-all duration-300 group-hover:scale-105">
                <Terminal className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold font-heading mb-2 text-foreground">Tactile UX Keybindings</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Fly through flashcards using arrow keys and press escape to toggle focus states instantly. Perfect for high-speed active recall training.
              </p>
            </div>
          </div>

          {/* Card 5: Gamified Streaks (4 cols) */}
          <div className="md:col-span-4 p-6 rounded-2xl bg-card/40 hover:bg-card/60 border border-border/80 hover:border-amber-500/40 backdrop-blur-sm shadow-xl group transition-all duration-300 relative flex flex-col justify-between overflow-hidden">
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div>
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-primary w-fit mb-5 transition-all duration-300 group-hover:scale-105">
                <Flame className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold font-heading mb-2 text-foreground">Deep Flow Mode</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Activate the pomodoro focus console. Study inside a distraction-free screen while logging analytics to trace daily session streaks.
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  )
}
