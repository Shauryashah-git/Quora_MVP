"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useModeration } from "@/contexts/moderation-context"
import { useAuth } from "@/contexts/auth-context"
import { AlertTriangle } from "lucide-react"

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  targetId: string
  targetType: "question" | "answer" | "comment"
  targetTitle: string
}

export function ReportModal({ isOpen, onClose, targetId, targetType, targetTitle }: ReportModalProps) {
  const { user } = useAuth()
  const { submitReport } = useModeration()
  const [reason, setReason] = useState<string>("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const reasons = [
    { value: "spam", label: "Spam or promotional content" },
    { value: "harassment", label: "Harassment or bullying" },
    { value: "inappropriate", label: "Inappropriate or offensive content" },
    { value: "misinformation", label: "Misinformation or false claims" },
    { value: "other", label: "Other (please describe)" },
  ]

  const handleSubmit = async () => {
    if (!user || !reason) return

    setIsSubmitting(true)
    try {
      submitReport({
        reporterId: user.id,
        targetId,
        targetType,
        reason: reason as any,
        description,
      })

      // Reset form
      setReason("")
      setDescription("")
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Report Content
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-600 mb-4">
              You are reporting: <span className="font-medium">"{targetTitle}"</span>
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium mb-3 block">Why are you reporting this content?</Label>
            <RadioGroup value={reason} onValueChange={setReason}>
              {reasons.map((reasonOption) => (
                <div key={reasonOption.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={reasonOption.value} id={reasonOption.value} />
                  <Label htmlFor={reasonOption.value} className="text-sm">
                    {reasonOption.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Additional details (optional)</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide more context about why you're reporting this content..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!reason || isSubmitting} variant="destructive">
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
