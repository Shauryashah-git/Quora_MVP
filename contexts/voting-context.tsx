"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { useAuth } from "./auth-context"
import type { Vote } from "@/types"

interface VotingContextType {
  votes: Vote[]
  vote: (targetId: string, targetType: "question" | "answer", voteType: "upvote" | "downvote") => void
  getUserVote: (targetId: string, targetType: "question" | "answer") => Vote | null
  getVoteCounts: (targetId: string) => { upvotes: number; downvotes: number }
}

const VotingContext = createContext<VotingContextType | undefined>(undefined)

export function VotingProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [votes, setVotes] = useState<Vote[]>([])

  const vote = (targetId: string, targetType: "question" | "answer", voteType: "upvote" | "downvote") => {
    if (!user) return

    const existingVote = votes.find(
      (v) => v.userId === user.id && v.targetId === targetId && v.targetType === targetType,
    )

    if (existingVote) {
      if (existingVote.type === voteType) {
        // Remove vote if clicking the same vote type
        setVotes(votes.filter((v) => v.id !== existingVote.id))
      } else {
        // Change vote type
        setVotes(votes.map((v) => (v.id === existingVote.id ? { ...v, type: voteType } : v)))
      }
    } else {
      // Add new vote
      const newVote: Vote = {
        id: Date.now().toString(),
        userId: user.id,
        targetId,
        targetType,
        type: voteType,
      }
      setVotes([...votes, newVote])
    }
  }

  const getUserVote = (targetId: string, targetType: "question" | "answer"): Vote | null => {
    if (!user) return null
    return votes.find((v) => v.userId === user.id && v.targetId === targetId && v.targetType === targetType) || null
  }

  const getVoteCounts = (targetId: string) => {
    const targetVotes = votes.filter((v) => v.targetId === targetId)
    return {
      upvotes: targetVotes.filter((v) => v.type === "upvote").length,
      downvotes: targetVotes.filter((v) => v.type === "downvote").length,
    }
  }

  return <VotingContext.Provider value={{ votes, vote, getUserVote, getVoteCounts }}>{children}</VotingContext.Provider>
}

export function useVoting() {
  const context = useContext(VotingContext)
  if (context === undefined) {
    throw new Error("useVoting must be used within a VotingProvider")
  }
  return context
}
