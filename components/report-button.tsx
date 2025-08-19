"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ReportModal } from "./report-modal"
import { Flag } from "lucide-react"

interface ReportButtonProps {
  targetId: string
  targetType: "question" | "answer" | "comment"
  targetTitle: string
  variant?: "ghost" | "outline"
  size?: "sm" | "default"
}

export function ReportButton({ targetId, targetType, targetTitle, variant = "ghost", size = "sm" }: ReportButtonProps) {
  const [showReportModal, setShowReportModal] = useState(false)

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setShowReportModal(true)}
        className="text-gray-500 hover:text-red-600"
      >
        <Flag className="h-4 w-4 mr-1" />
        Report
      </Button>

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        targetId={targetId}
        targetType={targetType}
        targetTitle={targetTitle}
      />
    </>
  )
}
