"use client"

import { Button } from "@/components/ui/button"
import { useVoting } from "@/contexts/voting-context"
import { useAuth } from "@/contexts/auth-context"
import { ArrowUpIcon, ArrowDownIcon } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

interface VoteButtonsProps {
  targetId: string
  targetType: "question" | "answer"
  initialUpvotes?: number
  initialDownvotes?: number
  className?: string
}

export function VoteButtons({
  targetId,
  targetType,
  initialUpvotes = 0,
  initialDownvotes = 0,
  className,
}: VoteButtonsProps) {
  const { user } = useAuth()
  const { vote, getUserVote, getVoteCounts } = useVoting()

  const userVote = getUserVote(targetId, targetType)
  const voteCounts = getVoteCounts(targetId)

  // Combine initial votes with new votes
  const totalUpvotes = initialUpvotes + voteCounts.upvotes
  const totalDownvotes = initialDownvotes + voteCounts.downvotes
  const score = totalUpvotes - totalDownvotes

  const handleVote = (voteType: "upvote" | "downvote") => {
    if (!user) return
    vote(targetId, targetType, voteType)
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote("upvote")}
        disabled={!user}
        className={cn(
          "flex items-center gap-1 px-2",
          userVote?.type === "upvote" && "bg-green-100 text-green-700 hover:bg-green-200",
        )}
      >
        <ArrowUpIcon className="h-4 w-4" />
        <span className="text-sm">{totalUpvotes}</span>
      </Button>

      <div className="px-2 py-1 text-sm font-medium text-slate-700">{score}</div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote("downvote")}
        disabled={!user}
        className={cn(
          "flex items-center gap-1 px-2",
          userVote?.type === "downvote" && "bg-red-100 text-red-700 hover:bg-red-200",
        )}
      >
        <ArrowDownIcon className="h-4 w-4" />
        <span className="text-sm">{totalDownvotes}</span>
      </Button>
    </div>
  )
}
