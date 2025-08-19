"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useNotifications } from "@/contexts/notification-context"
import { formatDistanceToNow } from "date-fns"
import { MessageCircle, UserPlus, ThumbsUp, HelpCircle, Bell } from "lucide-react"
import type { Notification } from "@/types"

interface NotificationItemProps {
  notification: Notification
  onClick: () => void
}

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const { markAsRead } = useNotifications()

  const handleClick = () => {
    if (!notification.isRead) {
      markAsRead(notification.id)
    }
    onClick()
  }

  const getIcon = () => {
    switch (notification.type) {
      case "answer":
        return <MessageCircle className="h-4 w-4 text-blue-600" />
      case "follow":
        return <UserPlus className="h-4 w-4 text-green-600" />
      case "comment":
        return <MessageCircle className="h-4 w-4 text-purple-600" />
      case "upvote":
        return <ThumbsUp className="h-4 w-4 text-orange-600" />
      case "new_question":
        return <HelpCircle className="h-4 w-4 text-indigo-600" />
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div
      className={`flex items-start gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
        !notification.isRead ? "bg-blue-50" : ""
      }`}
      onClick={handleClick}
    >
      <div className="flex-shrink-0">
        {notification.actionUser ? (
          <Avatar className="h-8 w-8">
            <AvatarImage src={notification.actionUser.avatar || "/placeholder.svg"} />
            <AvatarFallback>{notification.actionUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
        ) : (
          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">{getIcon()}</div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-medium text-sm text-gray-900">{notification.title}</p>
          {!notification.isRead && <div className="w-2 h-2 bg-quora-red rounded-full flex-shrink-0" />}
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{notification.message}</p>
        <p className="text-xs text-gray-500 mt-1">{formatDistanceToNow(notification.createdAt, { addSuffix: true })}</p>
      </div>
    </div>
  )
}
