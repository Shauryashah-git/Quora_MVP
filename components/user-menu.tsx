"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NotificationBell } from "./notification-bell"
import { useAuth } from "@/contexts/auth-context"
import { AuthModal } from "./auth-modal"
import { User, LogOut, Settings, Shield } from "lucide-react"

interface UserMenuProps {
  onProfileClick?: () => void
  onAdminClick?: () => void
}

export function UserMenu({ onProfileClick, onAdminClick }: UserMenuProps) {
  const { user, logout } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")

  const isAdmin = user?.id === "1" // Mock admin check

  if (!user) {
    return (
      <>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setAuthMode("login")
              setShowAuthModal(true)
            }}
          >
            Sign In
          </Button>
          <Button
            onClick={() => {
              setAuthMode("signup")
              setShowAuthModal(true)
            }}
          >
            Sign Up
          </Button>
        </div>

        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} defaultMode={authMode} />
      </>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <NotificationBell />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar || "/placeholder.svg"} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline">{user.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
            <p className="text-xs text-slate-500">{user.reputation} reputation</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onProfileClick}>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          {isAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onAdminClick}>
                <Shield className="mr-2 h-4 w-4" />
                Admin Dashboard
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
