"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FollowButton } from "./follow-button"
import { mockUsers } from "@/lib/mock-data"
import type { Follow } from "@/types"

interface FollowersModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  follows: Follow[]
  type: "followers" | "following"
}

export function FollowersModal({ isOpen, onClose, title, follows, type }: FollowersModalProps) {
  const users = follows
    .map((follow) => {
      const userId = type === "followers" ? follow.followerId : follow.followingId
      return mockUsers.find((u) => u.id === userId)
    })
    .filter(Boolean)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {users.length === 0 ? (
            <p className="text-center text-slate-500 py-8">No {type} yet.</p>
          ) : (
            users.map((user) => (
              <div key={user!.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user!.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{user!.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user!.name}</p>
                    <p className="text-sm text-slate-500">{user!.reputation} reputation</p>
                  </div>
                </div>
                <FollowButton userId={user!.id} userName={user!.name} size="sm" />
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
