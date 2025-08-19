"use client"

import { useState } from "react"
import { toDisplayDate } from "@/lib/date"
import type { Answer, Comment } from "@/types"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { VoteButtons } from "./vote-buttons"
import { CommentCard } from "./comment-card"
import { CommentForm } from "./comment-form"
import { EditAnswerModal } from "./edit-answer-modal"
import { DeleteConfirmationModal } from "./delete-confirmation-modal"
import { Check, Edit, Trash2, MoreHorizontal, MessageCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"

interface AnswerCardProps {
  answer: Answer
  comments: Comment[]
  onEditAnswer?: (answerId: string, content: string) => void
  onDeleteAnswer?: (answerId: string) => void
  onAddComment?: (answerId: string, content: string) => void
  onEditComment?: (commentId: string, content: string) => void
  onDeleteComment?: (commentId: string) => void
}

export function AnswerCard({
  answer,
  comments,
  onEditAnswer,
  onDeleteAnswer,
  onAddComment,
  onEditComment,
  onDeleteComment,
}: AnswerCardProps) {
  const { user } = useAuth()
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showComments, setShowComments] = useState(false)

  const isAuthor = user?.id === answer.author.id
  const answerComments = comments.filter((comment) => comment.answerId === answer.id)

  const handleEdit = (answerId: string, content: string) => {
    onEditAnswer?.(answerId, content)
  }

  const handleDelete = () => {
    onDeleteAnswer?.(answer.id)
    setShowDeleteModal(false)
  }

  const handleAddComment = (answerId: string, content: string) => {
    onAddComment?.(answerId, content)
  }

  return (
    <>
      <Card className={`mb-4 ${answer.isAccepted ? "border-green-200 bg-green-50" : ""}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={answer.author.avatar || "/placeholder.svg"} />
                <AvatarFallback>{answer.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{answer.author.name}</p>
                <p className="text-xs text-slate-500">{toDisplayDate(answer.createdAt)}</p>
              </div>
              {answer.isAccepted && (
                <Badge variant="default" className="bg-green-600">
                  <Check className="h-3 w-3 mr-1" />
                  Accepted
                </Badge>
              )}
            </div>
            {isAuthor && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowDeleteModal(true)} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-slate-700 mb-4">{answer.content}</p>

          <div className="flex items-center justify-between mb-4">
            <VoteButtons
              targetId={answer.id}
              targetType="answer"
              initialUpvotes={answer.upvotes}
              initialDownvotes={answer.downvotes}
            />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="text-slate-600 hover:text-slate-900"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              {answerComments.length} {answerComments.length === 1 ? "Comment" : "Comments"}
            </Button>
          </div>

          {showComments && (
            <div className="border-t pt-4">
              {answerComments.length > 0 && (
                <div className="space-y-2 mb-4">
                  {answerComments.map((comment) => (
                    <CommentCard
                      key={comment.id}
                      comment={comment}
                      onEditComment={onEditComment}
                      onDeleteComment={onDeleteComment}
                    />
                  ))}
                </div>
              )}
              <CommentForm answerId={answer.id} onSubmit={handleAddComment} />
            </div>
          )}
        </CardContent>
      </Card>

      <EditAnswerModal
        answer={answer}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleEdit}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Answer"
        description="Are you sure you want to delete this answer? This action cannot be undone."
      />
    </>
  )
}
