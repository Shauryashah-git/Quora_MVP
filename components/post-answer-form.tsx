"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/toast"
import { validateAnswer, sanitizeInput, type ValidationError } from "@/lib/validation"
import { Loader2, AlertCircle } from "lucide-react"

interface PostAnswerFormProps {
  questionId: string
  onSubmit: (content: string) => Promise<void>
  onCancel?: () => void
  isSubmitting?: boolean
}

export function PostAnswerForm({ questionId, onSubmit, onCancel, isSubmitting = false }: PostAnswerFormProps) {
  const [content, setContent] = useState("")
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [isValidating, setIsValidating] = useState(false)
  const { user } = useAuth()
  const { addToast } = useToast()

  const getFieldError = (field: string) => errors.find((e) => e.field === field)?.message

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsValidating(true)

    try {
      const sanitizedContent = sanitizeInput(content)
      const validation = validateAnswer(sanitizedContent)

      setErrors(validation.errors)

      if (!validation.isValid) {
        addToast({
          type: "error",
          title: "Validation Error",
          description: "Please fix the errors below and try again",
        })
        return
      }

      await onSubmit(sanitizedContent)

      // Reset form on success
      setContent("")
      setErrors([])

      addToast({
        type: "success",
        title: "Answer Posted",
        description: "Your answer has been posted successfully!",
      })
    } catch (error) {
      console.error("[v0] Error submitting answer:", error)
      addToast({
        type: "error",
        title: "Submission Failed",
        description: "Failed to post answer. Please try again.",
      })
    } finally {
      setIsValidating(false)
    }
  }

  const contentError = getFieldError("content")

  if (!user) {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6">
          <p className="text-gray-600 text-center">Please sign in to post an answer.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Your Answer</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Textarea
              placeholder="Write your answer here... (minimum 10 characters)"
              value={content}
              onChange={(e) => {
                setContent(e.target.value)
                // Clear content errors on change
                setErrors((prev) => prev.filter((e) => e.field !== "content"))
              }}
              rows={6}
              className={`min-h-[120px] ${contentError ? "border-red-500 focus:border-red-500" : ""}`}
              maxLength={10000}
              disabled={isSubmitting || isValidating}
            />
            {contentError && (
              <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                {contentError}
              </div>
            )}
            <div className="text-xs text-gray-500 mt-1">{content.length}/10,000 characters</div>
          </div>
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isSubmitting || isValidating}
              className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
            >
              {(isSubmitting || isValidating) && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Posting..." : isValidating ? "Validating..." : "Post Answer"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting || isValidating}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
