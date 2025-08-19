"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Upload } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import type { User } from "@/types"

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  user: User
}

export function EditProfileModal({ isOpen, onClose, user }: EditProfileModalProps) {
  const { updateProfile } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    name: user.name,
    bio: user.bio || "",
    avatar: user.avatar || "",
  })
  const [previewImage, setPreviewImage] = useState<string>(user.avatar || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile(formData)
    onClose()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        setPreviewImage(imageUrl)
        setFormData((prev) => ({
          ...prev,
          avatar: imageUrl,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-slate-50 border-slate-300">
        <DialogHeader>
          <DialogTitle className="text-slate-800">Edit Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-slate-300">
                <AvatarImage src={previewImage || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl bg-slate-200 text-slate-700">
                  {formData.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-slate-100 border-slate-300 hover:bg-slate-200"
                onClick={triggerFileInput}
              >
                <Camera className="h-4 w-4 text-slate-600" />
              </Button>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={triggerFileInput}
              className="bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Photo
            </Button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>

          <div>
            <Label htmlFor="name" className="text-slate-700">
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="bg-white border-slate-300 focus:border-slate-500"
            />
          </div>

          <div>
            <Label htmlFor="bio" className="text-slate-700">
              Bio
            </Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself..."
              rows={3}
              className="bg-white border-slate-300 focus:border-slate-500"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1 bg-slate-700 hover:bg-slate-800 text-white">
              Save Changes
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-slate-300 text-slate-700 hover:bg-slate-100 bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
