"use client"

import type React from "react"

import { useState } from "react"
import { sanitizeInput, validateComment } from "@/lib/validation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"

interface CommentFormProps {
  answerId: string
  onSubmit: (answerId: string, content: string) => void
}

export function CommentForm({ answerId, onSubmit }: CommentFormProps) {
  const { user } = useAuth()
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  if (!content.trim() || !user) return
  const sanitized = sanitizeInput(content)
  const validation = validateComment(sanitized)
  if (!validation.isValid) return

    setIsSubmitting(true)
    try {
  onSubmit(answerId, sanitized)
      setContent("")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return <div className="text-sm text-slate-500 py-2">Please log in to comment on this answer.</div>
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex gap-3">
        <Avatar className="h-6 w-6">
          <AvatarImage src={user.avatar || "/placeholder.svg"} />
          <AvatarFallback className="text-xs">{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a comment..."
            rows={2}
            className="text-sm"
          />
          <div className="flex justify-end mt-2">
            <Button type="submit" size="sm" disabled={!content.trim() || isSubmitting}>
              {isSubmitting ? "Posting..." : "Comment"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
