"use client"

import { useState } from "react"
import { toDisplayDate } from "@/lib/date"
import type { Comment } from "@/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { EditCommentModal } from "./edit-comment-modal"
import { DeleteConfirmationModal } from "./delete-confirmation-modal"
import { Edit, Trash2, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"

interface CommentCardProps {
  comment: Comment
  onEditComment?: (commentId: string, content: string) => void
  onDeleteComment?: (commentId: string) => void
}

export function CommentCard({ comment, onEditComment, onDeleteComment }: CommentCardProps) {
  const { user } = useAuth()
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const isAuthor = user?.id === comment.author.id

  const handleEdit = (commentId: string, content: string) => {
    onEditComment?.(commentId, content)
  }

  const handleDelete = () => {
    onDeleteComment?.(comment.id)
    setShowDeleteModal(false)
  }

  return (
    <>
      <div className="flex gap-3 py-2 border-l-2 border-slate-100 pl-4">
        <Avatar className="h-6 w-6">
          <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
          <AvatarFallback className="text-xs">{comment.author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium">{comment.author.name}</span>
            <span className="text-xs text-slate-500">{toDisplayDate(comment.createdAt)}</span>
            {isAuthor && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                    <Edit className="h-3 w-3 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowDeleteModal(true)} className="text-red-600">
                    <Trash2 className="h-3 w-3 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <p className="text-sm text-slate-700">{comment.content}</p>
        </div>
      </div>

      <EditCommentModal
        comment={comment}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleEdit}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Comment"
        description="Are you sure you want to delete this comment? This action cannot be undone."
      />
    </>
  )
}
