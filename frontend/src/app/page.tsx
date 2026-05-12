import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, BrainCircuit, BookOpen } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { AuthModal } from '@/components/auth-modal'

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-start pt-24 pb-12 selection:bg-primary/30">
      <Navbar />
      
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none animate-pulse duration-10000" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container px-4 mx-auto relative z-10 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-medium mb-8 border border-primary/20 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-700 whitespace-nowrap shadow-[0_0_20px_-5px_rgba(249,115,22,0.3)]">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>Transforming chaotic study materials into interactive microsites.</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-4xl animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150 fill-mode-both">
          Forge raw documents into <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
            pure knowledge.
          </span>
        </h1>

        <p className="text-base md:text-lg text-muted-foreground max-w-3xl mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both leading-relaxed">
          Upload any PDF, PPT, DOCX, or YouTube link. Our AI instantly forges them into <strong>personalized interactive microsites</strong> featuring smart flashcards, comprehensive notes, dynamic mindmaps, and technical diagrams designed to lock in knowledge.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500 fill-mode-both items-center justify-center">
          <AuthModal>
            <Button size="lg" className="h-14 px-10 text-lg group relative overflow-hidden transition-all shadow-[0_0_40px_-10px_rgba(249,115,22,0.5)] hover:shadow-[0_0_60px_-15px_rgba(249,115,22,0.7)] rounded-full">
              <span className="relative z-10 flex items-center gap-2">
                Start Forging Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </AuthModal>
        </div>

        {/* Feature Highlights Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 animate-in fade-in duration-1000 delay-700 fill-mode-both w-full max-w-5xl">
          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card/50 backdrop-blur-md border border-border hover:border-primary/50 transition-colors shadow-sm">
            <div className="p-3 rounded-xl bg-primary/20 text-primary mb-4">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Microsites</h3>
            <p className="text-sm text-muted-foreground">Instantly turns heavy files into structured, lightning-fast interactive microsites.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card/50 backdrop-blur-md border border-border hover:border-primary/50 transition-colors shadow-sm">
            <div className="p-3 rounded-xl bg-primary/20 text-primary mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Dynamic Mindmaps</h3>
            <p className="text-sm text-muted-foreground">Visualize complex relationships automatically with AI-generated diagrams and maps.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card/50 backdrop-blur-md border border-border hover:border-primary/50 transition-colors shadow-sm">
            <div className="p-3 rounded-xl bg-primary/20 text-primary mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Interactive Workspace</h3>
            <p className="text-sm text-muted-foreground">Chat with your docs, solve questionnaires, and master any subject in a specialized UI.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
