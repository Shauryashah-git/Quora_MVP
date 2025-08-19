"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useModeration } from "@/contexts/moderation-context"
import { formatDistanceToNow } from "date-fns"
import { Shield, AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react"
import type { Report } from "@/types"

export function AdminDashboard() {
  const { reports, reviewReport, getPendingReports } = useModeration()
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [moderatorNotes, setModeratorNotes] = useState("")

  const pendingReports = getPendingReports()
  const totalReports = reports.length
  const resolvedReports = reports.filter((r) => r.status === "resolved").length
  const dismissedReports = reports.filter((r) => r.status === "dismissed").length

  const handleReview = (reportId: string, status: "resolved" | "dismissed") => {
    reviewReport(reportId, status, moderatorNotes)
    setSelectedReport(null)
    setModeratorNotes("")
  }

  const getReasonLabel = (reason: string) => {
    const labels = {
      spam: "Spam",
      harassment: "Harassment",
      inappropriate: "Inappropriate",
      misinformation: "Misinformation",
      other: "Other",
    }
    return labels[reason as keyof typeof labels] || reason
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "dismissed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">Moderation Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{pendingReports.length}</p>
                <p className="text-sm text-gray-600">Pending Reports</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{totalReports}</p>
                <p className="text-sm text-gray-600">Total Reports</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{resolvedReports}</p>
                <p className="text-sm text-gray-600">Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <XCircle className="h-8 w-8 text-gray-600" />
              <div>
                <p className="text-2xl font-bold">{dismissedReports}</p>
                <p className="text-sm text-gray-600">Dismissed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No reports to review</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={report.reporter.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{report.reporter.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{report.reporter.name}</p>
                        <p className="text-xs text-gray-500">
                          {formatDistanceToNow(report.createdAt, { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{getReasonLabel(report.reason)}</Badge>
                      <span className="text-sm text-gray-500">• {report.targetType}</span>
                    </div>
                    <p className="text-sm text-gray-700">{report.description}</p>
                  </div>

                  {report.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedReport(report)}
                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                      >
                        Review
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReview(report.id, "resolved")}
                        className="text-green-600 border-green-600 hover:bg-green-50"
                      >
                        Resolve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReview(report.id, "dismissed")}
                        className="text-gray-600 border-gray-600 hover:bg-gray-50"
                      >
                        Dismiss
                      </Button>
                    </div>
                  )}

                  {report.moderatorNotes && (
                    <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                      <p className="text-sm font-medium text-blue-800">Moderator Notes:</p>
                      <p className="text-sm text-blue-700">{report.moderatorNotes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Review Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Report Details:</p>
                <p className="text-sm text-gray-600">{selectedReport.description}</p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Moderator Notes (optional)</label>
                <Textarea
                  value={moderatorNotes}
                  onChange={(e) => setModeratorNotes(e.target.value)}
                  placeholder="Add notes about your decision..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedReport(null)}>
                  Cancel
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleReview(selectedReport.id, "dismissed")}
                  className="text-gray-600 border-gray-600"
                >
                  Dismiss
                </Button>
                <Button
                  onClick={() => handleReview(selectedReport.id, "resolved")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Resolve
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
