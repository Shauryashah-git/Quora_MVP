"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, MessageCircle, Plus, Check } from "lucide-react"
import type { Topic } from "@/types"

interface TopicCardProps {
  topic: Topic
  isFollowing?: boolean
  onFollow?: (topicId: string) => void
  onUnfollow?: (topicId: string) => void
  onClick?: (topicId: string) => void
}

export function TopicCard({ topic, isFollowing = false, onFollow, onUnfollow, onClick }: TopicCardProps) {
  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isFollowing) {
      onUnfollow?.(topic.id)
    } else {
      onFollow?.(topic.id)
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onClick?.(topic.id)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold"
              style={{ backgroundColor: topic.color }}
            >
              {topic.icon}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{topic.name}</h3>
              <p className="text-sm text-slate-600 line-clamp-2">{topic.description}</p>
            </div>
          </div>
          <Button
            variant={isFollowing ? "default" : "outline"}
            size="sm"
            onClick={handleFollowClick}
            className={isFollowing ? "bg-quora-red hover:bg-quora-red/90" : ""}
          >
            {isFollowing ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Following
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-1" />
                Follow
              </>
            )}
          </Button>
        </div>

        <div className="flex items-center gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span>{topic.questionCount.toLocaleString()} questions</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{topic.followerCount.toLocaleString()} followers</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
