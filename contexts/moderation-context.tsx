"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Report } from "@/types"
import { mockUsers } from "@/lib/mock-data"

interface ModerationContextType {
  reports: Report[]
  submitReport: (report: Omit<Report, "id" | "createdAt" | "reporter">) => void
  reviewReport: (reportId: string, status: "resolved" | "dismissed", notes?: string) => void
  getPendingReports: () => Report[]
  getReportsByTarget: (targetId: string, targetType: string) => Report[]
}

const ModerationContext = createContext<ModerationContextType | undefined>(undefined)

export function ModerationProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<Report[]>([
    // Sample reports
    {
      id: "1",
      reporterId: "2",
      reporter: mockUsers[1],
      targetId: "4",
      targetType: "answer",
      reason: "inappropriate",
      description: "This answer contains offensive language and personal attacks.",
      status: "pending",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
      id: "2",
      reporterId: "3",
      reporter: mockUsers[2],
      targetId: "2",
      targetType: "question",
      reason: "spam",
      description: "This question appears to be promotional spam.",
      status: "pending",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    },
  ])

  const submitReport = (reportData: Omit<Report, "id" | "createdAt" | "reporter">) => {
    const currentUserId = "1" // This would come from auth context in real app
    const reporter = mockUsers.find((u) => u.id === currentUserId) || mockUsers[0]

    const newReport: Report = {
      ...reportData,
      id: Date.now().toString(),
      reporter,
      createdAt: new Date(),
      status: "pending",
    }

    setReports((prev) => [newReport, ...prev])
  }

  const reviewReport = (reportId: string, status: "resolved" | "dismissed", notes?: string) => {
    const currentUserId = "1" // Admin user ID
    setReports((prev) =>
      prev.map((report) =>
        report.id === reportId
          ? {
              ...report,
              status,
              reviewedAt: new Date(),
              reviewedBy: currentUserId,
              moderatorNotes: notes,
            }
          : report,
      ),
    )
  }

  const getPendingReports = () => {
    return reports.filter((report) => report.status === "pending")
  }

  const getReportsByTarget = (targetId: string, targetType: string) => {
    return reports.filter((report) => report.targetId === targetId && report.targetType === targetType)
  }

  return (
    <ModerationContext.Provider
      value={{
        reports,
        submitReport,
        reviewReport,
        getPendingReports,
        getReportsByTarget,
      }}
    >
      {children}
    </ModerationContext.Provider>
  )
}

export function useModeration() {
  const context = useContext(ModerationContext)
  if (context === undefined) {
    throw new Error("useModeration must be used within a ModerationProvider")
  }
  return context
}
