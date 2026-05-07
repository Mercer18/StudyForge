"use client"

import React, { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { UploadCloud, File, X, Loader2 } from "lucide-react"
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
    setProgress(10) // Initial progress for starting

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error("Must be logged in to upload")
      }

      let generateRes;

      if (activeTab === "file" && file) {
        // 1a. Send file to FastAPI
        const formData = new FormData()
        formData.append("file", file)
        formData.append("title", file.name.replace(/\.[^/.]+$/, "")) // Remove extension for title
        formData.append("user_id", user.id)

        setProgress(30) // Text extraction and chunking

        generateRes = await fetch("http://127.0.0.1:8000/api/v1/subjects/generate", {
          method: "POST",
          body: formData,
        })
      } else {
        // 1b. Send YouTube URL to FastAPI
        const formData = new FormData()
        formData.append("youtube_url", youtubeUrl)
        formData.append("title", videoTitle || "YouTube Video Summary")
        formData.append("user_id", user.id)

        setProgress(30)

        generateRes = await fetch("http://127.0.0.1:8000/api/v1/subjects/generate-youtube", {
          method: "POST",
          body: formData,
        })
      }

      if (!generateRes.ok) {
        throw new Error("Failed to start generation")
      }

      const { subject_id } = await generateRes.json()

      // 2. Poll for completion
      const pollInterval = setInterval(async () => {
        try {
          const statusRes = await fetch(`http://127.0.0.1:8000/api/v1/subjects/${subject_id}/status`)
          if (statusRes.ok) {
            const data = await statusRes.json()
            
            if (data.status === "processing") {
              setProgress((prev) => (prev < 90 ? prev + 5 : prev)) // Fake progress while waiting
            } else if (data.status === "completed") {
              clearInterval(pollInterval)
              setProgress(100)
              
              // Success! Give it a tiny delay so user sees 100%, then redirect or close
              setTimeout(() => {
                setIsUploading(false)
                setOpen(false)
                setFile(null)
                // Teleport the user directly to the new microsite
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
      <DialogTrigger className={buttonVariants()}>Upload Document</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Forge a New Subject</DialogTitle>
          <DialogDescription>
            Upload a PDF or Word document. We will extract the text, analyze the concepts, and generate your personal textbook.
          </DialogDescription>
        </DialogHeader>

        {!isUploading ? (
          <div className="w-full">
            <div className="flex gap-2 p-1 bg-muted/50 rounded-lg mb-6 border border-white/5">
              <button 
                onClick={() => setActiveTab("file")}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === "file" ? "bg-background shadow-md border border-white/10" : "text-muted-foreground hover:text-foreground hover:bg-background/30"}`}
              >
                Document Upload
              </button>
              <button 
                onClick={() => setActiveTab("youtube")}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === "youtube" ? "bg-background shadow-md border border-white/10" : "text-muted-foreground hover:text-foreground hover:bg-background/30"}`}
              >
                YouTube Link
              </button>
            </div>
            
            {activeTab === "file" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                    ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"}
                    ${file ? "bg-muted/50" : ""}
                  `}
                >
                  <input {...getInputProps()} />
                  
                  {!file ? (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <UploadCloud className="h-10 w-10 mb-2" />
                      <p className="font-medium text-foreground">Click or drag file to this area</p>
                      <p className="text-sm">Supports PDF and DOCX</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-background p-4 rounded-md border shadow-sm">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <File className="h-8 w-8 text-primary shrink-0" />
                        <div className="flex flex-col items-start truncate">
                          <span className="text-sm font-medium truncate w-[200px] text-left">{file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={removeFile}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "youtube" && (
              <div className="space-y-4 p-5 border border-white/10 rounded-xl bg-card/50 backdrop-blur-sm shadow-inner animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">YouTube URL</label>
                  <Input 
                    placeholder="https://www.youtube.com/watch?v=..." 
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="h-12 bg-background/50 border-white/10 focus-visible:ring-primary"
                  />
                </div>
                <div className="space-y-2 pt-2">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Subject Title</label>
                  <Input 
                    placeholder="E.g. Machine Learning Full Course" 
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    className="h-12 bg-background/50 border-white/10 focus-visible:ring-primary"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-8">
              <Button variant="outline" className="border-white/10 hover:bg-white/5" onClick={() => setOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleUpload} 
                disabled={(activeTab === 'file' && !file) || (activeTab === 'youtube' && (!youtubeUrl || !videoTitle))}
                className="shadow-[0_0_20px_-5px_rgba(249,115,22,0.4)]"
              >
                Forge Workspace
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-8 flex flex-col items-center justify-center space-y-6">
            <div className="flex flex-col items-center space-y-2 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <h3 className="text-lg font-medium">Forging Your Workspace</h3>
              <p className="text-sm text-muted-foreground">Extracting text and analyzing concepts...</p>
            </div>
            <div className="w-full space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-right text-muted-foreground">{progress}%</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
