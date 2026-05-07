"use client"

import { useState, useEffect } from "react"
import { Trash2 } from "lucide-react"
import { deleteSubject } from "@/app/dashboard/actions"

export function DeleteSubjectButton({ subjectId }: { subjectId: string }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [needsConfirm, setNeedsConfirm] = useState(false)

  useEffect(() => {
    console.log("DeleteSubjectButton mounted for:", subjectId)
  }, [subjectId])

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("handleDelete clicked for:", subjectId)
    
    if (!needsConfirm) {
      setNeedsConfirm(true)
      return
    }
    
    setIsDeleting(true)
    try {
      await deleteSubject(subjectId)
    } catch (err) {
      console.error("Failed to delete subject", err)
      alert("Failed to delete subject.")
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={`p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors ${
        isDeleting ? "opacity-50 cursor-not-allowed" : ""
      } ${needsConfirm ? "bg-destructive/20 text-destructive" : ""}`}
      title={needsConfirm ? "Click again to confirm" : "Delete subject"}
    >
      <Trash2 className="h-4 w-4" />
    </button>
  )
}
