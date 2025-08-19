"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Follow } from "@/types"

interface FollowContextType {
  follows: Follow[]
  followUser: (userId: string) => void
  unfollowUser: (userId: string) => void
  followTopic: (topicId: string) => void
  unfollowTopic: (topicId: string) => void
  isFollowingUser: (userId: string) => boolean
  isFollowingTopic: (topicId: string) => boolean
  getFollowers: (userId: string) => Follow[]
  getFollowing: (userId: string) => Follow[]
  getFollowedTopics: (userId: string) => Follow[]
}

const FollowContext = createContext<FollowContextType | undefined>(undefined)

export function FollowProvider({ children }: { children: ReactNode }) {
  const [follows, setFollows] = useState<Follow[]>([])

  const followUser = (userId: string) => {
    const currentUserId = "1" // This would come from auth context in real app
    if (currentUserId === userId) return

    const newFollow: Follow = {
      id: Date.now().toString(),
      followerId: currentUserId,
      followingId: userId,
      followingType: "user",
      createdAt: new Date(),
    }

    setFollows((prev) => [...prev, newFollow])
  }

  const unfollowUser = (userId: string) => {
    const currentUserId = "1"
    setFollows((prev) =>
      prev.filter((f) => !(f.followerId === currentUserId && f.followingId === userId && f.followingType === "user")),
    )
  }

  const followTopic = (topicId: string) => {
    const currentUserId = "1"
    const newFollow: Follow = {
      id: Date.now().toString(),
      followerId: currentUserId,
      followingId: topicId,
      followingType: "topic",
      createdAt: new Date(),
    }

    setFollows((prev) => [...prev, newFollow])
  }

  const unfollowTopic = (topicId: string) => {
    const currentUserId = "1"
    setFollows((prev) =>
      prev.filter((f) => !(f.followerId === currentUserId && f.followingId === topicId && f.followingType === "topic")),
    )
  }

  const isFollowingUser = (userId: string) => {
    const currentUserId = "1"
    return follows.some((f) => f.followerId === currentUserId && f.followingId === userId && f.followingType === "user")
  }

  const isFollowingTopic = (topicId: string) => {
    const currentUserId = "1"
    return follows.some(
      (f) => f.followerId === currentUserId && f.followingId === topicId && f.followingType === "topic",
    )
  }

  const getFollowers = (userId: string) => {
    return follows.filter((f) => f.followingId === userId && f.followingType === "user")
  }

  const getFollowing = (userId: string) => {
    return follows.filter((f) => f.followerId === userId && f.followingType === "user")
  }

  const getFollowedTopics = (userId: string) => {
    return follows.filter((f) => f.followerId === userId && f.followingType === "topic")
  }

  return (
    <FollowContext.Provider
      value={{
        follows,
        followUser,
        unfollowUser,
        followTopic,
        unfollowTopic,
        isFollowingUser,
        isFollowingTopic,
        getFollowers,
        getFollowing,
        getFollowedTopics,
      }}
    >
      {children}
    </FollowContext.Provider>
  )
}

export function useFollow() {
  const context = useContext(FollowContext)
  if (context === undefined) {
    throw new Error("useFollow must be used within a FollowProvider")
  }
  return context
}
