"use client"

import React, { useCallback, useState, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { UploadCloud, File, X, Loader2, Link2, FileText, Sparkles, Terminal } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button, buttonVariants } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

export function UploadModal() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [videoTitle, setVideoTitle] = useState("")
  const [activeTab, setActiveTab] = useState<"file" | "youtube">("file")
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [activeStage, setActiveStage] = useState("Initializing workspace parser...")

  // Simulated active terminal stages during background polling
  useEffect(() => {
    if (!isUploading) return
    const stages = [
      "Ingesting raw document bytes...",
      "Stripping character tables and links...",
      "Slicing document into 15k semantic chunks...",
      "Running Map-Reduce chunk analysis...",
      "Interfacing with Groq Llama-3 AI...",
      "Structuring Table of Contents metadata...",
      "Synthesizing 3D interactive flashcards...",
      "Generating responsive concept diagram mappings...",
      "Compiling final ForgeBook JSON payload..."
    ]

    const interval = setInterval(() => {
      const currentStageIndex = Math.min(
        Math.floor((progress / 100) * stages.length),
        stages.length - 1
      )
      setActiveStage(stages[currentStageIndex])
    }, 1000)

    return () => clearInterval(interval)
  }, [isUploading, progress])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  })

  const handleUpload = async () => {
    if (activeTab === "file" && !file) return
    if (activeTab === "youtube" && !youtubeUrl) return

    setIsUploading(true)
    setProgress(10)

    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      
      if (!token) {
        throw new Error("Must be logged in to upload")
      }

      let generateRes;

      if (activeTab === "file" && file) {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("title", file.name.replace(/\.[^/.]+$/, ""))

        setProgress(25)

        generateRes = await fetch("http://127.0.0.1:8000/api/v1/subjects/generate", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          },
          body: formData,
        })
      } else {
        const formData = new FormData()
        formData.append("youtube_url", youtubeUrl)
        formData.append("title", videoTitle || "YouTube Video Summary")

        setProgress(25)

        generateRes = await fetch("http://127.0.0.1:8000/api/v1/subjects/generate-youtube", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          },
          body: formData,
        })
      }

      if (!generateRes.ok) {
        throw new Error("Failed to start generation")
      }

      const { subject_id } = await generateRes.json()

      const pollInterval = setInterval(async () => {
        try {
          const statusRes = await fetch(`http://127.0.0.1:8000/api/v1/subjects/${subject_id}/status`, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          })
          if (statusRes.ok) {
            const data = await statusRes.json()
            
            if (data.status === "processing") {
              setProgress((prev) => (prev < 92 ? prev + 4 : prev))
            } else if (data.status === "completed") {
              clearInterval(pollInterval)
              setProgress(100)
              
              setTimeout(() => {
                setIsUploading(false)
                setOpen(false)
                setFile(null)
                router.push(`/subject/${subject_id}`)
              }, 1000)
            } else if (data.status === "failed") {
              clearInterval(pollInterval)
              throw new Error("Generation failed: " + data.description)
            }
          }
        } catch (err) {
          clearInterval(pollInterval)
          console.error(err)
          setIsUploading(false)
          alert("Error checking status")
        }
      }, 3000)

    } catch (error) {
      console.error(error)
      setIsUploading(false)
      alert("An error occurred during upload")
    }
  }

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation()
    setFile(null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={`${buttonVariants()} font-mono text-xs uppercase tracking-wider h-10 px-5 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm cursor-pointer rounded`}>
        + forge new subject
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md border border-border bg-card/95 backdrop-blur-md rounded-xl p-6 transition-all duration-300">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-1.5 text-primary">
            <Sparkles className="w-4 h-4 shrink-0 animate-pulse" />
            <span className="font-mono text-[10px] uppercase font-bold tracking-widest">engine control panel</span>
          </div>
          <DialogTitle className="text-xl font-extrabold tracking-tight font-heading">Forge Learning Workspace</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground font-mono leading-relaxed">
            Ingest textbook files or YouTube lectures to synthesize structured ForgeBooks.
          </DialogDescription>
        </DialogHeader>

        {!isUploading ? (
          <div className="w-full mt-4">
            
            {/* Minimalist Switch Tabs (Monkeytype Style) */}
            <div className="flex gap-2 p-1 bg-muted/30 border border-border/80 rounded-md mb-6">
              <button 
                onClick={() => setActiveTab("file")}
                className={`flex-1 py-2 text-xs font-mono font-bold uppercase rounded transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "file" 
                    ? "bg-card text-primary border border-border/70 shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/10"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>file upload</span>
              </button>
              <button 
                onClick={() => setActiveTab("youtube")}
                className={`flex-1 py-2 text-xs font-mono font-bold uppercase rounded transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "youtube" 
                    ? "bg-card text-primary border border-border/70 shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/10"
                }`}
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>youtube url</span>
              </button>
            </div>
            
            {/* File Ingestion View */}
            {activeTab === "file" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-1 duration-200">
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200
                    ${isDragActive ? "border-primary bg-primary/5" : "border-border/80 hover:border-primary/50"}
                    ${file ? "bg-muted/10 border-solid" : ""}
                  `}
                >
                  <input {...getInputProps()} />
                  
                  {!file ? (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground select-none">
                      <UploadCloud className="h-8 w-8 mb-1 text-muted-foreground/80" />
                      <p className="text-xs font-bold font-mono uppercase tracking-wider text-foreground">Click or drag document here</p>
                      <p className="text-[10px] text-muted-foreground/75 font-mono">Supports academic PDFs & DOCX files</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-muted/40 p-3.5 rounded border border-border shadow-inner">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <File className="h-6 w-6 text-primary shrink-0" />
                        <div className="flex flex-col items-start truncate font-mono">
                          <span className="text-xs font-bold truncate w-[200px] text-left text-foreground">{file.name}</span>
                          <span className="text-[9px] text-muted-foreground mt-0.5">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={removeFile} className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer">
                        <X className="h-3.5 h-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* YouTube Ingestion View */}
            {activeTab === "youtube" && (
              <div className="space-y-4 p-5 border border-border bg-muted/10 rounded-lg animate-in fade-in slide-in-from-bottom-1 duration-200 font-mono">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">youtube address</label>
                  <Input 
                    placeholder="https://www.youtube.com/watch?v=..." 
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="h-10 bg-card/60 border-border focus-visible:ring-1 focus-visible:ring-primary font-mono text-xs rounded"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">custom title (optional)</label>
                  <Input 
                    placeholder="E.g. Quantum Physics Lecture 3" 
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    className="h-10 bg-card/60 border-border focus-visible:ring-1 focus-visible:ring-primary font-mono text-xs rounded"
                  />
                </div>
              </div>
            )}

            {/* Footer buttons */}
            <div className="flex justify-end gap-3 mt-8 font-mono">
              <Button 
                variant="ghost" 
                className="h-10 px-4 text-xs uppercase text-muted-foreground hover:text-foreground cursor-pointer rounded border border-border hover:bg-muted/40" 
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpload} 
                disabled={(activeTab === 'file' && !file) || (activeTab === 'youtube' && !youtubeUrl)}
                className="h-10 px-5 text-xs uppercase bg-primary hover:bg-primary/90 text-primary-foreground font-bold tracking-wider shadow-sm cursor-pointer rounded"
              >
                ⚡ ignite forge
              </Button>
            </div>

          </div>
        ) : (
          /* High-Performance Active Terminal Progress view */
          <div className="py-6 flex flex-col items-center justify-center space-y-6 font-mono select-none">
            
            <div className="w-full bg-black/40 border border-border p-4 rounded-md space-y-2 text-[10px] text-muted-foreground leading-relaxed animate-in fade-in duration-300">
              <div className="flex items-center gap-1.5 text-primary border-b border-white/5 pb-2 mb-2 font-bold">
                <Terminal className="w-3.5 h-3.5 animate-spin shrink-0" />
                <span>ACTIVE PIPELINE METRICS</span>
              </div>
              <div className="flex items-start gap-1">
                <span className="text-primary font-bold">{`>`}</span>
                <span className="text-foreground font-semibold">{activeStage}</span>
                <span className="typing-caret w-1 h-3 bg-primary inline-block ml-0.5" />
              </div>
              <div className="text-[9px] text-muted-foreground/60 mt-1">
                Allocating Groq token bandwidth... [OK]
              </div>
            </div>

            <div className="w-full space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground px-1">
                <span>overall completion</span>
                <span className="text-primary font-bold">{progress}%</span>
              </div>
              <Progress value={progress} className="h-1.5 bg-muted/40" />
            </div>

          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
