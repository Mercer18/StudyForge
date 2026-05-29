"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import { FlashcardView } from './flashcard'
import { ChatTutor } from './chat-tutor'
import { useParams } from 'next/navigation'
import { Mermaid } from './mermaid'
import { MindMap } from './mind-map'
import { 
  BookOpen, 
  Layers, 
  Workflow,
  MessageSquareText, 
  ChevronLeft, 
  ChevronRight, 
  Timer, 
  Play, 
  Pause, 
  RotateCcw,
  Sparkles,
  Maximize2,
  Minimize2,
  X
} from 'lucide-react'

interface Section {
  id: string
  title: string
  content: string
  key_concepts: string[]
}

interface FlashcardData {
  id: string
  front: string
  back: string
}

interface StudyData {
  title: string
  overview: string
  sections: Section[]
  flashcards: FlashcardData[]
  mind_map?: any
}

export function WorkspaceClient({ data, subjectTitle }: { data: StudyData | null, subjectTitle: string }) {
  const [activeTab, setActiveTab] = useState<'reader' | 'flashcards' | 'mindmap'>('reader')
  const [activeSectionId, setActiveSectionId] = useState<string | null>(data?.sections?.[0]?.id || null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  
  // Focus Flow Mode Timer States
  const [isFlowActive, setIsFlowActive] = useState(false)
  const [flowTime, setFlowTime] = useState(25 * 60) // Default 25 min Pomodoro
  const [timerRunning, setTimerRunning] = useState(false)

  const params = useParams()
  const subjectId = params.id as string

  // Timer runner
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timerRunning && flowTime > 0) {
      interval = setInterval(() => {
        setFlowTime((prev) => prev - 1)
      }, 1000)
    } else if (flowTime === 0) {
      setTimerRunning(false)
      // Play a subtle notification beep if supported by browser
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
        const osc = audioCtx.createOscillator()
        const gain = audioCtx.createGain()
        osc.connect(gain)
        gain.connect(audioCtx.destination)
        osc.frequency.setValueAtTime(800, audioCtx.currentTime)
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime)
        osc.start()
        osc.stop(audioCtx.currentTime + 0.3)
      } catch (e) {}
      alert("Flow session completed! Time for a short break.")
      setFlowTime(25 * 60)
    }
    return () => clearInterval(interval)
  }, [timerRunning, flowTime])

  // Key bindings helper: Esc closes chat, Space flips flashcards (handled in flashcard view)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsChatOpen(false)
        setIsFlowActive(false)
      }
      // Alt + B to toggle sidebar
      if (e.altKey && e.key.toLowerCase() === 'b') {
        e.preventDefault()
        setIsSidebarOpen((prev) => !prev)
      }
      // Alt + F to toggle Flow focus timer
      if (e.altKey && e.key.toLowerCase() === 'f') {
        e.preventDefault()
        setIsFlowActive((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!data) return null

  const activeSection = data.sections.find(s => s.id === activeSectionId) || data.sections[0]

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  };

  return (
    <div className="flex flex-1 overflow-hidden h-[calc(100vh-3.5rem)] relative font-sans">
      
      {/* ==================== LEFT COLLAPSIBLE SIDEBAR ==================== */}
      <aside 
        className={`border-r border-border bg-card/25 flex flex-col h-full shrink-0 transition-all duration-300 relative select-none z-20 ${
          isSidebarOpen ? 'w-80' : 'w-0 border-r-0'
        }`}
      >
        <div className="overflow-y-auto flex-1 flex flex-col h-full w-80">
          
          {/* AI Synopsis Container */}
          <div className="p-6 border-b border-border bg-card/10">
            <div className="flex items-center gap-1.5 text-primary mb-3">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span className="font-mono text-[9px] uppercase font-bold tracking-widest">ai abstract</span>
            </div>
            <p className="text-xs leading-6 text-muted-foreground font-sans">
              {data.overview}
            </p>
          </div>

          {/* Module Switch Tab Pills */}
          <div className="p-5 flex-1 flex flex-col">
            <div className="flex p-1 bg-muted/40 border border-border/80 rounded-md mb-6 shrink-0 gap-1">
              <button
                onClick={() => setActiveTab('reader')}
                className={`flex-grow flex items-center justify-center py-2 text-[10px] font-mono font-bold uppercase rounded transition-all cursor-pointer ${
                  activeTab === 'reader' 
                    ? 'bg-card text-primary border border-border/70 shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <BookOpen className="h-3.5 w-3.5 mr-1" />
                Reader
              </button>
              <button
                onClick={() => setActiveTab('mindmap')}
                className={`flex-grow flex items-center justify-center py-2 text-[10px] font-mono font-bold uppercase rounded transition-all cursor-pointer ${
                  activeTab === 'mindmap' 
                    ? 'bg-card text-primary border border-border/70 shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Workflow className="h-3.5 w-3.5 mr-1" />
                ForgeMap
              </button>
              <button
                onClick={() => setActiveTab('flashcards')}
                className={`flex-grow flex items-center justify-center py-2 text-[10px] font-mono font-bold uppercase rounded transition-all cursor-pointer ${
                  activeTab === 'flashcards' 
                    ? 'bg-card text-primary border border-border/70 shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Layers className="h-3.5 w-3.5 mr-1" />
                ForgeCards
              </button>
            </div>

            {/* Table of Contents View */}
            {activeTab === 'reader' && (
              <div className="space-y-1 flex-1 overflow-y-auto">
                <div className="flex items-center justify-between mb-4 px-2">
                  <h3 className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-widest">table of contents</h3>
                  <span className="key-badge">alt + b</span>
                </div>
                
                {data.sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSectionId(section.id)}
                    className={`w-full text-left px-3 py-2.5 rounded text-xs font-mono transition-all flex items-center gap-2 cursor-pointer border ${
                      activeSectionId === section.id 
                        ? 'bg-primary/5 text-primary border-primary/20 font-bold' 
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'
                    }`}
                  >
                    {/* Active DOT indicator (Monkeytype settings style) */}
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      activeSectionId === section.id ? 'bg-primary animate-pulse' : 'bg-transparent'
                    }`} />
                    <span className="truncate">{section.title}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Flashcard Stats Panel */}
            {activeTab === 'flashcards' && (
              <div className="px-2 text-xs text-muted-foreground leading-relaxed font-mono space-y-4">
                <div className="border border-border p-4 rounded bg-muted/10 space-y-2">
                  <p>Loaded <span className="text-primary font-bold">{data.flashcards.length}</span> verified flashcards.</p>
                  <p className="text-[10px] text-muted-foreground/75 leading-relaxed">
                    Test key terminology and algebraic relationships. Flipping tracks cognitive retention records.
                  </p>
                </div>
                <div className="flex items-center justify-between text-[9px] text-muted-foreground bg-muted/20 p-2 rounded">
                  <span>keyboard swipe</span>
                  <span className="key-badge">arrows</span>
                </div>
              </div>
            )}

            {/* Mind Map Stats Panel */}
            {activeTab === 'mindmap' && (
              <div className="px-2 text-xs text-muted-foreground leading-relaxed font-mono space-y-4">
                <div className="border border-border p-4 rounded bg-muted/10 space-y-2">
                  <p>Synthesized <span className="text-primary font-bold">1 interactive</span> syllabus map.</p>
                  <p className="text-[10px] text-muted-foreground/75 leading-relaxed">
                    View structural hierarchy and key chapters. Interactive nodes map curriculum domains.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      </aside>

      {/* Sidebar Expand / Collapse Toggle Pin */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute bottom-5 left-5 z-30 h-8 w-8 rounded-full border border-border bg-card shadow-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 cursor-pointer"
        title="Toggle Sidebar (Alt + B)"
      >
        {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      {/* ==================== CENTER READER CONTENT AREA ==================== */}
      <main className="flex-grow overflow-y-auto bg-background flex flex-col items-center relative">
        
        {/* Floating Timer Console and Chat controls */}
        {/* Floating Timer Console and Chat controls */}
        <div className={`w-full px-8 lg:px-12 py-4 flex items-center justify-between border-b border-border/50 shrink-0 sticky top-0 bg-background/90 backdrop-blur z-10 transition-all duration-300 ${activeTab === 'mindmap' ? 'max-w-[96%]' : 'max-w-4xl'}`}>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsFlowActive(true)}
              className="h-8 px-3 rounded text-[10px] font-mono uppercase font-bold text-muted-foreground hover:text-foreground hover:border-primary/40 cursor-pointer border border-border flex items-center gap-1.5 transition-all bg-card/30"
              title="Ignite Pomodoro Focus Deck (Alt + F)"
            >
              <Timer className="w-3.5 h-3.5 text-primary" />
              <span>flow timer</span>
              <span className="key-badge">alt + f</span>
            </button>
          </div>
          
          <span className="font-mono text-[9px] text-muted-foreground select-none uppercase tracking-widest hidden sm:inline">
            studyforge workspace client v1.2
          </span>
        </div>

        {/* Text Pane */}
        <div className={`w-full flex-1 px-8 lg:px-12 py-10 pb-20 transition-all duration-300 ${activeTab === 'mindmap' ? 'max-w-[96%]' : 'max-w-4xl'}`}>
          
          {activeTab === 'reader' && activeSection && (
            <div className="animate-in fade-in duration-300 max-w-3xl mx-auto">
              
              {/* Header Title section */}
              <div className="mb-10 space-y-4">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-heading leading-tight text-foreground">
                  {activeSection.title}
                </h1>
                
                {/* Concept Keybadges (Monkeytype Tags) */}
                {activeSection.key_concepts && activeSection.key_concepts.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <span className="font-mono text-[9px] text-muted-foreground uppercase py-0.5 tracking-wider mr-1">concepts:</span>
                    {activeSection.key_concepts.map((concept, idx) => (
                      <span key={idx} className="key-badge text-[9px] font-mono leading-none flex items-center h-5">
                        {concept}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Renders beautiful customized markdown */}
              <div className="prose prose-slate dark:prose-invert max-w-none text-left prose-p:leading-8 prose-p:text-sm prose-p:text-foreground/90 prose-headings:font-heading prose-headings:tracking-tight prose-strong:text-primary prose-strong:font-bold">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={{
                    code({node, inline, className, children, ...props}: any) {
                      const match = /language-(\w+)/.exec(className || '')
                      if (!inline && match && match[1] === 'mermaid') {
                        return <Mermaid chart={String(children).replace(/\n$/, '')} />
                      }
                      return <code className={`${className} font-mono bg-muted/40 p-1 rounded text-xs border border-border text-foreground`} {...props}>{children}</code>
                    }
                  }}
                >
                  {activeSection.content}
                </ReactMarkdown>
              </div>

            </div>
          )}

          {activeTab === 'mindmap' && (
            <div className="animate-in fade-in duration-300 w-full">
              <MindMap data={data.mind_map} />
            </div>
          )}

          {activeTab === 'flashcards' && (
            <div className="animate-in fade-in duration-300 h-full flex flex-col items-center pt-6 max-w-2xl mx-auto">
              <div className="text-center mb-8 font-mono">
                <h2 className="text-2xl font-extrabold font-heading mb-1.5">Ember Forge Flashcards</h2>
                <p className="text-xs text-muted-foreground">Synthesized questions and answers to evaluate terminology retention.</p>
              </div>
              <FlashcardView flashcards={data.flashcards} />
            </div>
          )}

        </div>
      </main>

      {/* ==================== RIGHT FLOATING CHAT WIDGET ==================== */}
      {!isChatOpen && (
        <Button 
          onClick={() => setIsChatOpen(true)}
          className="absolute bottom-6 right-6 h-12 w-12 rounded-lg border border-primary/25 bg-primary text-primary-foreground shadow-[0_4px_25px_-5px_rgba(226,183,20,0.5)] hover:shadow-[0_4px_30px_0px_rgba(226,183,20,0.6)] hover:-translate-y-1 transition-all z-30 cursor-pointer flex items-center justify-center"
          title="Open AI Chat Assistant"
        >
          <MessageSquareText className="w-5 h-5" />
        </Button>
      )}

      {/* Chat Tutor sliding panel */}
      {isChatOpen && (
        <ChatTutor subjectId={subjectId} onClose={() => setIsChatOpen(false)} />
      )}

      {/* ==================== CINEMATIC FULL SCREEN FOCUS TIMER OVERLAY ==================== */}
      {isFlowActive && (
        <div className="absolute inset-0 bg-background/98 z-50 flex flex-col items-center justify-center animate-in fade-in duration-300 select-none">
          
          {/* Close Focus Overlay button */}
          <button 
            onClick={() => setIsFlowActive(false)}
            className="absolute top-6 right-6 h-10 w-10 border border-border/80 rounded hover:border-primary/50 text-muted-foreground hover:text-foreground cursor-pointer flex items-center justify-center bg-card/25"
            title="Exit Focus Mode (Esc)"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-center space-y-8 max-w-sm w-full font-mono px-6">
            
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-primary mb-1">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span className="text-[9px] uppercase tracking-widest font-bold font-mono">deep focus ignited</span>
              </div>
              <h3 className="text-xl font-extrabold font-heading text-foreground">{subjectTitle}</h3>
              <p className="text-xs text-muted-foreground">Dimmed distraction deck. Study in peace.</p>
            </div>

            {/* Glowing Focus Clock (Monkeytype inspired metrics) */}
            <div className="relative py-12 flex items-center justify-center">
              {/* Subtle background spinning or pulse orb */}
              <div className={`absolute w-44 h-44 rounded-full border border-primary/20 blur-md transition-all ${
                timerRunning ? 'scale-105 opacity-100 bg-primary/5' : 'scale-100 opacity-50'
              }`} />
              <span className="text-6xl font-extrabold tracking-tight text-foreground font-mono relative z-10 tabular-nums">
                {formatTime(flowTime)}
              </span>
            </div>

            {/* Timer Commands */}
            <div className="flex justify-center items-center gap-4">
              <button 
                onClick={() => setTimerRunning(!timerRunning)}
                className="h-11 px-6 text-xs uppercase font-bold bg-primary text-primary-foreground rounded hover:bg-primary/95 shadow-sm cursor-pointer flex items-center gap-2 transition-all"
              >
                {timerRunning ? (
                  <>
                    <Pause className="w-4.5 h-4.5" />
                    <span>pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4.5 h-4.5" />
                    <span>start</span>
                  </>
                )}
              </button>
              <button 
                onClick={() => {
                  setTimerRunning(false)
                  setFlowTime(25 * 60)
                }}
                className="h-11 w-11 border border-border/80 hover:border-primary/40 rounded flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer bg-card/25 transition-all"
                title="Reset Focus Clock"
              >
                <RotateCcw className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="text-[10px] text-muted-foreground/60">
              Press <kbd className="bg-muted/40 px-1 py-0.5 rounded border border-border text-[9px] font-bold">esc</kbd> to return to workspace
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
