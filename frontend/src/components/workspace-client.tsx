"use client"

import React, { useState, useEffect } from 'react'
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
import { MindMap, type MindMapData } from './mind-map'
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
  mind_map?: MindMapData
}

export function WorkspaceClient({ data, subjectTitle }: { data: StudyData | null, subjectTitle: string }) {
  const [activeTab, setActiveTab] = useState<'reader' | 'flashcards' | 'mindmap'>('reader')
  const [activeSectionId, setActiveSectionId] = useState<string | null>(data?.sections?.[0]?.id || null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [chatWidth, setChatWidth] = useState(384)
  
  // Focus Flow Mode Timer States
  const [isFlowActive, setIsFlowActive] = useState(false)
  const [flowTime, setFlowTime] = useState(25 * 60) // Default 25 min Pomodoro
  const [timerRunning, setTimerRunning] = useState(false)
  const [customMinutes, setCustomMinutes] = useState(25)
  const [totalTimeSpent, setTotalTimeSpent] = useState(0)

  const params = useParams()
  const subjectId = params.id as string

  // Load accumulated study time from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTime = localStorage.getItem(`studyforge_time_spent_${subjectId}`)
      const parsedTime = savedTime ? parseInt(savedTime, 10) : 0
      setTimeout(() => {
        setTotalTimeSpent(parsedTime)
      }, 0)
    }
  }, [subjectId])

  // Timer runner
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timerRunning && flowTime > 0) {
      interval = setInterval(() => {
        setFlowTime((prev) => prev - 1)
        setTotalTimeSpent((prevTotal) => {
          const nextTotal = prevTotal + 1
          localStorage.setItem(`studyforge_time_spent_${subjectId}`, nextTotal.toString())
          return nextTotal
        })
      }, 1000)
    } else if (flowTime === 0 && timerRunning) {
      setTimeout(() => {
        setTimerRunning(false)
      }, 0)
      // Play a subtle notification beep if supported by browser
      try {
        const WebkitAudioContext = (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        const audioCtx = new (window.AudioContext || WebkitAudioContext)()
        const osc = audioCtx.createOscillator()
        const gain = audioCtx.createGain()
        osc.connect(gain)
        gain.connect(audioCtx.destination)
        osc.frequency.setValueAtTime(800, audioCtx.currentTime)
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime)
        osc.start()
        osc.stop(audioCtx.currentTime + 0.3)
      } catch {
        // Ignored
      }
      alert("Flow session completed! Time for a short break.")
      setTimeout(() => {
        setFlowTime(customMinutes * 60)
      }, 0)
    }
    return () => clearInterval(interval)
  }, [timerRunning, flowTime, customMinutes, subjectId])

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
        className={`border-r border-border bg-card/25 flex flex-col h-full shrink-0 transition-all duration-300 relative select-none z-20 overflow-hidden ${
          isSidebarOpen ? 'w-80' : 'w-0 border-r-0'
        }`}
      >
        <div className="overflow-y-auto flex-1 flex flex-col h-full w-80">
          
          {/* AI Synopsis Container */}
          <div className="p-5 border-b border-border bg-card/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[1.5%] via-transparent to-transparent pointer-events-none" />
            <div className="flex items-center gap-1.5 text-primary mb-2.5 select-none">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="font-mono text-[10px] uppercase font-black tracking-widest">ai abstract</span>
            </div>
            <p className="text-xs md:text-[13px] leading-relaxed text-muted-foreground/90 font-sans">
              {data.overview}
            </p>
          </div>

          {/* Module Switch Tab Pills */}
          <div className="p-5 flex-1 flex flex-col min-h-0">
            <div className="flex p-1 bg-muted/40 border border-border/60 rounded-lg mb-6 shrink-0 gap-1 select-none">
              <button
                onClick={() => setActiveTab('reader')}
                className={`flex-grow flex items-center justify-center py-2 px-1 text-xs font-sans font-semibold rounded-md transition-all cursor-pointer ${
                  activeTab === 'reader' 
                    ? 'bg-card text-primary border border-border/70 shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/15'
                }`}
              >
                <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                Reader
              </button>
              <button
                onClick={() => setActiveTab('mindmap')}
                className={`flex-grow flex items-center justify-center py-2 px-1 text-xs font-sans font-semibold rounded-md transition-all cursor-pointer ${
                  activeTab === 'mindmap' 
                    ? 'bg-card text-primary border border-border/70 shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/15'
                }`}
              >
                <Workflow className="h-3.5 w-3.5 mr-1.5" />
                ForgeMap
              </button>
              <button
                onClick={() => setActiveTab('flashcards')}
                className={`flex-grow flex items-center justify-center py-2 px-1 text-xs font-sans font-semibold rounded-md transition-all cursor-pointer ${
                  activeTab === 'flashcards' 
                    ? 'bg-card text-primary border border-border/70 shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/15'
                }`}
              >
                <Layers className="h-3.5 w-3.5 mr-1.5" />
                ForgeCards
              </button>
            </div>

            {/* Table of Contents View */}
            {activeTab === 'reader' && (
              <div className="space-y-1.5 flex-1 overflow-y-auto no-scrollbar pr-1">
                <div className="flex items-center justify-between mb-4 px-2 select-none">
                  <h3 className="text-[10px] font-bold font-sans text-muted-foreground/80 uppercase tracking-widest font-semibold">table of contents</h3>
                  <span className="key-badge">alt + b</span>
                </div>
                
                {data.sections.map((section, idx) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSectionId(section.id)}
                    className={`w-full text-left transition-all flex items-center cursor-pointer border ${
                      activeSectionId === section.id 
                        ? 'bg-primary/[4%] text-primary border-l-2 border-l-primary font-bold pl-3 pr-2 py-2.5 rounded-r-lg rounded-l-none border-y-transparent border-r-transparent' 
                        : 'border-transparent text-muted-foreground/85 hover:text-foreground hover:bg-muted/20 pl-3.5 pr-2 py-2.5 rounded-lg'
                    }`}
                  >
                    <span className={`font-mono text-[10px] mr-2.5 w-4 text-right shrink-0 select-none ${
                      activeSectionId === section.id ? 'text-primary font-bold' : 'text-muted-foreground/45'
                    }`}>
                      {(idx + 1).toString().padStart(2, '0')}
                    </span>
                    <span className="truncate text-[13px] font-sans tracking-wide">{section.title}</span>
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
      <main 
        className="flex-grow overflow-y-auto bg-background flex flex-col items-center relative"
        style={{ marginRight: isChatOpen ? chatWidth : 0 }}
      >
        
        {/* Floating Timer Console and Chat controls */}
        {/* Floating Timer Console and Chat controls */}
        <div className={`w-full px-8 lg:px-12 py-5 border-b border-border/50 shrink-0 sticky top-0 bg-background/95 backdrop-blur z-10 transition-all duration-300 ${activeTab === 'mindmap' ? 'max-w-[96%]' : 'max-w-5xl'}`}>
          <div className="bg-card/45 backdrop-blur-md border border-border/80 rounded-xl p-4.5 w-full flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 shadow-sm">
            {/* Left Section: Focus Mode & Clock Console */}
            <div className="flex items-center gap-3.5 flex-wrap">
              <button 
                onClick={() => setIsFlowActive(true)}
                className="h-9 px-4 rounded-lg text-xs md:text-sm font-mono uppercase font-bold text-muted-foreground hover:text-foreground hover:border-primary/40 cursor-pointer border border-border flex items-center gap-1.5 transition-all bg-card/30"
                title="Ignite Full Screen Focus Deck (Alt + F)"
              >
                <Timer className="w-4 h-4 text-primary" />
                <span>Deep Focus</span>
                <span className="key-badge text-[10px]">alt + f</span>
              </button>

              {/* Running Clock Widget */}
              <div className="flex items-center gap-3 border border-border/85 rounded-lg px-3 py-1.5 bg-background/50 text-sm font-mono select-none">
                <span className={`w-2 h-2 rounded-full ${timerRunning ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground/50'}`} />
                <span className="text-xs sm:text-sm font-bold text-foreground tabular-nums tracking-wide">{formatTime(flowTime)}</span>
                <div className="flex items-center gap-1 border-l border-border/60 pl-2.5 ml-1">
                  <button 
                    onClick={() => setTimerRunning(!timerRunning)} 
                    className="text-[10px] sm:text-xs text-muted-foreground hover:text-foreground cursor-pointer px-1.5 py-0.5 hover:bg-muted/40 rounded transition-all uppercase font-bold"
                  >
                    {timerRunning ? "pause" : "start"}
                  </button>
                  <button 
                    onClick={() => {
                      setTimerRunning(false)
                      setFlowTime(customMinutes * 60)
                    }}
                    className="text-[10px] sm:text-xs text-muted-foreground hover:text-foreground cursor-pointer px-1.5 py-0.5 hover:bg-muted/40 rounded transition-all uppercase font-bold"
                    title="Reset Focus Clock"
                  >
                    reset
                  </button>
                </div>
              </div>

              {/* Quick Duration Selector Presets */}
              <div className="hidden lg:flex items-center gap-1.5 bg-muted/20 border border-border/40 p-0.5 rounded-lg">
                {[5, 15, 25, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => {
                      setTimerRunning(false)
                      setCustomMinutes(mins)
                      setFlowTime(mins * 60)
                    }}
                    className={`px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-mono cursor-pointer border transition-all ${
                      customMinutes === mins 
                        ? "bg-card text-primary border-border shadow-sm font-extrabold" 
                        : "text-muted-foreground border-transparent hover:border-border/50 hover:bg-muted/20"
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>
            
            {/* Right Section: Total Study Time */}
            <div className="flex flex-col items-end font-mono select-none shrink-0 pl-2 border-l border-border/30 sm:border-l-0">
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest hidden sm:inline font-semibold">
                Total Time Spent on This Microsite
              </span>
              <span className="text-sm sm:text-base font-extrabold text-primary tabular-nums mt-0.5 tracking-wide">
                {Math.floor(totalTimeSpent / 60)}m {totalTimeSpent % 60}s
              </span>
            </div>
          </div>
        </div>

        {/* Text Pane */}
        <div className={`w-full flex-1 px-8 lg:px-12 py-10 pb-20 transition-all duration-300 ${activeTab === 'mindmap' ? 'max-w-[96%]' : 'max-w-5xl'}`}>
          
          {activeTab === 'reader' && activeSection && (
            <div className="animate-in fade-in duration-300 max-w-4xl mx-auto">
              
              {/* Header Title section */}
              <div className="mb-10">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
                  Section {(data.sections.findIndex((s) => s.id === activeSection.id) + 1).toString().padStart(2, '0')}
                </span>
                <h1 className="mt-3 text-4xl md:text-5xl font-light tracking-tight font-heading leading-[1.05] text-foreground">
                  {activeSection.title}
                </h1>

                {/* Concept tags */}
                {activeSection.key_concepts && activeSection.key_concepts.length > 0 && (
                  <div className="flex flex-wrap gap-2.5 items-center mt-5">
                    <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mr-1">concepts</span>
                    {activeSection.key_concepts.map((concept, idx) => (
                      <span key={idx} className="font-mono text-[11px] px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full">
                        {concept}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Renders beautiful customized markdown */}
              <div className="prose prose-slate dark:prose-invert max-w-none text-left prose-p:leading-relaxed prose-p:text-base md:prose-p:text-[17px] prose-p:text-foreground/90 prose-headings:font-heading prose-headings:tracking-tight prose-strong:text-primary prose-strong:font-bold prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-5 prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-li:text-base md:prose-li:text-[17px] prose-li:my-2.5 prose-ul:my-4 prose-ol:my-4 prose-blockquote:border-l-primary prose-blockquote:bg-primary/[2%] prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:rounded-r-xl prose-blockquote:text-muted-foreground prose-blockquote:not-italic">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: false }]]}
                  components={{
                    code({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: React.ReactNode }) {
                      const match = /language-(\w+)/.exec(className || '')
                      if (!inline && match && match[1] === 'mermaid') {
                        return <Mermaid chart={String(children).replace(/\n$/, '')} />
                      }
                      return <code className={`${className} font-mono bg-muted/40 p-1.5 px-2 rounded text-xs sm:text-sm border border-border text-foreground`} {...props}>{children}</code>
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
              <MindMap data={data.mind_map || null} />
            </div>
          )}

          {activeTab === 'flashcards' && (
            <div className="animate-in fade-in duration-300 h-full flex flex-col items-center pt-6 max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">Recall deck</span>
                <h2 className="mt-2 text-3xl font-light font-heading tracking-tight">Forge cards</h2>
                <p className="mt-2 text-sm text-muted-foreground">Flip through synthesized Q&amp;A to test retention.</p>
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
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full border border-primary/30 bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all z-50 cursor-pointer flex items-center justify-center"
          title="Open AI Tutor"
        >
          <MessageSquareText className="w-5 h-5" />
        </Button>
      )}

      {/* Chat Tutor sliding panel */}
      {isChatOpen && (
        <ChatTutor 
          subjectId={subjectId} 
          onClose={() => setIsChatOpen(false)} 
          width={chatWidth}
          setWidth={setChatWidth}
        />
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
              <h3 className="text-xl font-extrabold font-heading text-foreground break-words w-full px-2">
                {subjectTitle.replace(/_/g, ' ')}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">Tracks your active study session on this workspace.</p>
            </div>

            {/* Time Duration Customization Dashboard */}
            <div className="space-y-4 pt-2 border-t border-border/30">
              <div className="flex flex-col gap-1.5 items-center justify-center">
                <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-mono">Select Duration</span>
                <div className="flex items-center gap-2">
                  {[5, 15, 25, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => {
                        setTimerRunning(false)
                        setCustomMinutes(mins)
                        setFlowTime(mins * 60)
                      }}
                      className={`px-3 py-1 rounded text-xs font-mono cursor-pointer border transition-all ${
                        customMinutes === mins 
                          ? "bg-primary/20 text-primary border-primary/40 font-bold" 
                          : "text-muted-foreground border-border/80 hover:border-primary/30 bg-card/25"
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 justify-center text-xs">
                <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-mono">Custom Mins:</span>
                <input
                  type="number"
                  min="1"
                  max="480"
                  value={customMinutes}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10)
                    if (!isNaN(val) && val > 0) {
                      setTimerRunning(false)
                      setCustomMinutes(val)
                      setFlowTime(val * 60)
                    }
                  }}
                  className="w-16 h-8 px-2 bg-card/60 border border-border/80 rounded font-mono text-xs text-foreground text-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>
            </div>

            {/* Glowing Focus Clock (Monkeytype inspired metrics) */}
            <div className="relative py-8 flex items-center justify-center">
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
                  setFlowTime(customMinutes * 60)
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
