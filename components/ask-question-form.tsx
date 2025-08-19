"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/toast"
import { validateQuestion, sanitizeInput, type ValidationError } from "@/lib/validation"
import { X, Loader2, AlertCircle } from "lucide-react"

interface AskQuestionFormProps {
  onSubmit: (question: { title: string; content: string; tags: string[] }) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export function AskQuestionForm({ onSubmit, onCancel, isSubmitting = false }: AskQuestionFormProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [isValidating, setIsValidating] = useState(false)
  const { addToast } = useToast()

  const getFieldError = (field: string) => errors.find((e) => e.field === field)?.message

  const handleAddTag = () => {
    const sanitizedTag = sanitizeInput(tagInput)
    if (sanitizedTag && !tags.includes(sanitizedTag) && tags.length < 5) {
      if (sanitizedTag.length >= 2 && sanitizedTag.length <= 20) {
        setTags([...tags, sanitizedTag])
        setTagInput("")
        // Clear tag-related errors
        setErrors((prev) => prev.filter((e) => e.field !== "tags"))
      } else {
        addToast({
          type: "error",
          title: "Invalid Tag",
          description: "Tags must be between 2-20 characters long",
        })
      }
    } else if (tags.length >= 5) {
      addToast({
        type: "error",
        title: "Too Many Tags",
        description: "Maximum 5 tags allowed",
      })
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
    // Clear tag-related errors when removing tags
    if (tags.length <= 5) {
      setErrors((prev) => prev.filter((e) => e.field !== "tags"))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsValidating(true)

    try {
      const sanitizedTitle = sanitizeInput(title)
      const sanitizedContent = sanitizeInput(content)
      const sanitizedTags = tags.map((tag) => sanitizeInput(tag))

      const validation = validateQuestion({
        title: sanitizedTitle,
        content: sanitizedContent,
        tags: sanitizedTags,
      })

      setErrors(validation.errors)

      if (!validation.isValid) {
        addToast({
          type: "error",
          title: "Validation Error",
          description: "Please fix the errors below and try again",
        })
        return
      }

      await onSubmit({
        title: sanitizedTitle,
        content: sanitizedContent,
        tags: sanitizedTags,
      })

      // Reset form on success
      setTitle("")
      setContent("")
      setTags([])
      setTagInput("")
      setErrors([])

      addToast({
        type: "success",
        title: "Question Posted",
        description: "Your question has been posted successfully!",
      })
    } catch (error) {
      console.error("[v0] Error submitting question:", error)
      addToast({
        type: "error",
        title: "Submission Failed",
        description: "Failed to post question. Please try again.",
      })
    } finally {
      setIsValidating(false)
    }
  }

  const titleError = getFieldError("title")
  const contentError = getFieldError("content")
  const tagsError = getFieldError("tags")

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Ask a Question</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="What's your question? (minimum 10 characters)"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                // Clear title errors on change
                setErrors((prev) => prev.filter((e) => e.field !== "title"))
              }}
              className={`text-lg ${titleError ? "border-red-500 focus:border-red-500" : ""}`}
              maxLength={200}
              disabled={isSubmitting || isValidating}
            />
            {titleError && (
              <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                {titleError}
              </div>
            )}
            <div className="text-xs text-gray-500 mt-1">{title.length}/200 characters</div>
          </div>

          <div>
            <Textarea
              placeholder="Provide more details about your question... (minimum 20 characters)"
              value={content}
              onChange={(e) => {
                setContent(e.target.value)
                // Clear content errors on change
                setErrors((prev) => prev.filter((e) => e.field !== "content"))
              }}
              rows={4}
              className={contentError ? "border-red-500 focus:border-red-500" : ""}
              maxLength={5000}
              disabled={isSubmitting || isValidating}
            />
            {contentError && (
              <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                {contentError}
              </div>
            )}
            <div className="text-xs text-gray-500 mt-1">{content.length}/5000 characters</div>
          </div>

          <div>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Add tags (2-20 characters, max 5 tags)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                maxLength={20}
                disabled={isSubmitting || isValidating || tags.length >= 5}
              />
              <Button
                type="button"
                onClick={handleAddTag}
                variant="outline"
                disabled={!tagInput.trim() || tags.length >= 5 || isSubmitting || isValidating}
              >
                Add Tag
              </Button>
            </div>

            {tagsError && (
              <div className="flex items-center gap-1 mb-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                {tagsError}
              </div>
            )}

            <div className="flex gap-2 flex-wrap">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X className="h-3 w-3 cursor-pointer hover:text-red-600" onClick={() => handleRemoveTag(tag)} />
                </Badge>
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-1">{tags.length}/5 tags</div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting || isValidating} className="flex items-center gap-2">
              {(isSubmitting || isValidating) && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Posting..." : isValidating ? "Validating..." : "Post Question"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting || isValidating}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
