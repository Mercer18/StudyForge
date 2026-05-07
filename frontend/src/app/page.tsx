import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, BrainCircuit, BookOpen } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center selection:bg-primary/30">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none animate-pulse duration-10000" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container px-4 mx-auto relative z-10 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 border border-primary/20 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Sparkles className="w-4 h-4" />
          <span>The next generation of AI studying is here.</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150 fill-mode-both">
          Forge raw documents into <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
            pure knowledge.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both leading-relaxed">
          Upload any PDF, lecture, or document. Our AI instantly extracts the core concepts, generates smart flashcards, and builds an interactive learning workspace just for you.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500 fill-mode-both">
          <Link href="/login">
            <Button size="lg" className="h-12 px-8 text-base group relative overflow-hidden transition-all shadow-[0_0_40px_-10px_rgba(249,115,22,0.5)] hover:shadow-[0_0_60px_-15px_rgba(249,115,22,0.7)]">
              <span className="relative z-10 flex items-center gap-2">
                Start Forging Free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-background/50 backdrop-blur-md border-white/10 hover:bg-white/5">
              Explore Features
            </Button>
          </Link>
        </div>

        {/* Feature Highlights Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 animate-in fade-in duration-1000 delay-700 fill-mode-both w-full max-w-5xl">
          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
            <div className="p-3 rounded-xl bg-primary/20 text-primary mb-4">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Extraction</h3>
            <p className="text-sm text-muted-foreground">Instantly turns heavy reading into a structured, easily digestible overview.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
            <div className="p-3 rounded-xl bg-primary/20 text-primary mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">AI Flashcards</h3>
            <p className="text-sm text-muted-foreground">Automatically generates spaced-repetition flashcards to lock in memory.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
            <div className="p-3 rounded-xl bg-primary/20 text-primary mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Interactive Reader</h3>
            <p className="text-sm text-muted-foreground">Read alongside the AI. Ask questions, clarify concepts, and master subjects.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
