"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Notification } from "@/types"
import { mockUsers } from "@/lib/mock-data"

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, "id" | "createdAt">) => void
  markAsRead: (notificationId: string) => void
  markAllAsRead: () => void
  clearNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    // Sample notifications
    {
      id: "1",
      userId: "1",
      type: "answer",
      title: "New Answer",
      message: "Rahul Kumar answered your question about IIT JEE preparation",
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      relatedId: "1",
      relatedType: "question",
      actionUserId: "2",
      actionUser: mockUsers[1],
    },
    {
      id: "2",
      userId: "1",
      type: "follow",
      title: "New Follower",
      message: "Sarah Johnson started following you",
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      actionUserId: "3",
      actionUser: mockUsers[2],
    },
    {
      id: "3",
      userId: "1",
      type: "upvote",
      title: "Answer Upvoted",
      message: "Your answer about startup advice received an upvote",
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      relatedId: "3",
      relatedType: "answer",
    },
  ])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const addNotification = (notificationData: Omit<Notification, "id" | "createdAt">) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      createdAt: new Date(),
    }

    setNotifications((prev) => [newNotification, ...prev])
  }

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
