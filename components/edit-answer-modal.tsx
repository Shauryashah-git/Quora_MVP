"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { Answer } from "@/types"

interface EditAnswerModalProps {
  answer: Answer
  isOpen: boolean
  onClose: () => void
  onSave: (answerId: string, content: string) => void
}

export function EditAnswerModal({ answer, isOpen, onClose, onSave }: EditAnswerModalProps) {
  const [content, setContent] = useState(answer.content)

  const handleSave = () => {
    if (content.trim()) {
      onSave(answer.id, content.trim())
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Answer</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Your Answer</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your knowledge..."
              rows={8}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!content.trim()}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
