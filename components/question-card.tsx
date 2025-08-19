"use client"

import React, { useState, useCallback, memo } from "react"
import { toDisplayDate } from "@/lib/date"
import type { Question } from "@/types"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { VoteButtons } from "./vote-buttons"
import { EditQuestionModal } from "./edit-question-modal"
import { DeleteConfirmationModal } from "./delete-confirmation-modal"
import { MessageCircleIcon, EditIcon, TrashIcon, MoreHorizontalIcon } from "@/components/ui/icons"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"

interface QuestionCardProps {
  question: Question
  onQuestionClick: (questionId: string) => void
  onEditQuestion?: (questionId: string, updates: { title: string; content: string; tags: string[] }) => void
  onDeleteQuestion?: (questionId: string) => void
}

const QuestionCardComponent: React.FC<QuestionCardProps> = ({
  question,
  onQuestionClick,
  onEditQuestion,
  onDeleteQuestion,
}) => {
  const { user } = useAuth()
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const isAuthor = user?.id === question.author.id

  const handleCardClick = useCallback(() => {
    onQuestionClick(question.id)
  }, [onQuestionClick, question.id])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onQuestionClick(question.id)
    }
  }, [onQuestionClick, question.id])

  const handleEdit = useCallback((updates: { title: string; content: string; tags: string[] }) => {
    onEditQuestion?.(question.id, updates)
  }, [onEditQuestion, question.id])

  const handleDelete = useCallback(() => {
    onDeleteQuestion?.(question.id)
    setShowDeleteModal(false)
  }, [onDeleteQuestion, question.id])

  return (
    <>
      <Card
        className="mb-4 hover:shadow-md transition-all duration-200 cursor-pointer focus-within:ring-2 focus-within:ring-red-500 focus-within:ring-offset-2"
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="article"
        aria-labelledby={`question-title-${question.id}`}
        aria-describedby={`question-content-${question.id} question-meta-${question.id}`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3
                id={`question-title-${question.id}`}
                className="font-semibold text-lg mb-2 text-gray-900 leading-tight"
              >
                {question.title}
              </h3>
              <p id={`question-content-${question.id}`} className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                {question.content}
              </p>
            </div>
            {isAuthor && (
              <div className="action-buttons flex-shrink-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label={`More actions for question: ${question.title}`}
                      className="hover:bg-gray-100 focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                    >
                      <MoreHorizontalIcon className="h-4 w-4" />
                      <span className="sr-only">More actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => setShowEditModal(true)} className="focus:bg-gray-100">
                      <EditIcon className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setShowDeleteModal(true)}
                      className="text-red-600 focus:bg-red-50 focus:text-red-700"
                    >
                      <TrashIcon className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div id={`question-meta-${question.id}`} className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={question.author.avatar || "/placeholder-user.jpg"} alt={question.author.name} />
                <AvatarFallback>{question.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{question.author.name}</span>
              <span className="text-gray-400">&middot;</span>
              <span>{toDisplayDate(question.createdAt)}</span>
            </div>
            <div className="flex items-center gap-4 action-buttons">
              <VoteButtons
                targetId={question.id}
                initialUpvotes={question.upvotes}
                initialDownvotes={question.downvotes}
                targetType="question"
              />
              <div className="flex items-center gap-1">
                <MessageCircleIcon className="h-4 w-4" />
                <span>{question.answerCount}</span>
              </div>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {question.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      {showEditModal && (
        <EditQuestionModal
          question={question}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={(id, updates) => onEditQuestion?.(id, updates)}
        />
      )}
      {showDeleteModal && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          title="Delete Question"
          description="Are you sure you want to delete this question? This action cannot be undone."
        />
      )}
    </>
  )
}

export const QuestionCard = memo(QuestionCardComponent)
