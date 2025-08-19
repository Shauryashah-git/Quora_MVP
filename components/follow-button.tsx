"use client"

import { Button } from "@/components/ui/button"
import { UserPlus, UserCheck } from "lucide-react"
import { useFollow } from "@/contexts/follow-context"
import { useAuth } from "@/contexts/auth-context"

interface FollowButtonProps {
  userId: string
  userName: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

export function FollowButton({ userId, userName, variant = "default", size = "default" }: FollowButtonProps) {
  const { user } = useAuth()
  const { isFollowingUser, followUser, unfollowUser } = useFollow()

  if (!user || user.id === userId) {
    return null
  }

  const isFollowing = isFollowingUser(userId)

  const handleClick = () => {
    if (isFollowing) {
      unfollowUser(userId)
    } else {
      followUser(userId)
    }
  }

  return (
    <Button
      variant={isFollowing ? "outline" : variant}
      size={size}
      onClick={handleClick}
      className={
        isFollowing
          ? "border-quora-red text-quora-red hover:bg-quora-red hover:text-white"
          : "bg-quora-red hover:bg-quora-red/90 text-white"
      }
    >
      {isFollowing ? (
        <>
          <UserCheck className="h-4 w-4 mr-1" />
          Following
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4 mr-1" />
          Follow
        </>
      )}
    </Button>
  )
}
