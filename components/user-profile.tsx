"use client"

import { useState } from "react"
import { toDisplayDate } from "@/lib/date"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QuestionCard } from "./question-card"
import { AnswerCard } from "./answer-card"
import { EditProfileModal } from "./edit-profile-modal"
import { FollowButton } from "./follow-button"
import { FollowersModal } from "./followers-modal"
import { useAuth } from "@/contexts/auth-context"
import { useFollow } from "@/contexts/follow-context"
import type { User, Question, Answer } from "@/types"
import { Edit, Calendar, Award, MessageCircle, HelpCircle } from "lucide-react"

interface UserProfileProps {
  profileUser: User
  userQuestions: Question[]
  userAnswers: Answer[]
  onQuestionClick: (questionId: string) => void
  onBack: () => void
}

export function UserProfile({ profileUser, userQuestions, userAnswers, onQuestionClick, onBack }: UserProfileProps) {
  const { user: currentUser } = useAuth()
  const { getFollowers, getFollowing } = useFollow()
  const [showEditModal, setShowEditModal] = useState(false)
  const [showFollowersModal, setShowFollowersModal] = useState(false)
  const [showFollowingModal, setShowFollowingModal] = useState(false)
  const isOwnProfile = currentUser?.id === profileUser.id

  const joinDate = new Date(2024, 0, 1) // Mock join date
  const totalUpvotes = userAnswers.reduce((sum, answer) => sum + answer.upvotes, 0)

  const followers = getFollowers(profileUser.id)
  const following = getFollowing(profileUser.id)

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Button variant="ghost" onClick={onBack} className="mb-6">
        ← Back
      </Button>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Info */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarImage src={profileUser.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl">{profileUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{profileUser.name}</CardTitle>
              <p className="text-slate-600 text-sm">{profileUser.email}</p>

              <div className="flex gap-2 mt-3">
                {isOwnProfile ? (
                  <Button variant="outline" size="sm" onClick={() => setShowEditModal(true)} className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <FollowButton userId={profileUser.id} userName={profileUser.name} />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {profileUser.bio && (
                <div>
                  <h4 className="font-medium text-sm text-slate-700 mb-1">Bio</h4>
                  <p className="text-sm text-slate-600">{profileUser.bio}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
                    <Award className="h-4 w-4" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{profileUser.reputation}</p>
                  <p className="text-xs text-slate-500">Reputation</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                    <MessageCircle className="h-4 w-4" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{totalUpvotes}</p>
                  <p className="text-xs text-slate-500">Answer Upvotes</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center pt-2 border-t">
                <button
                  onClick={() => setShowFollowersModal(true)}
                  className="hover:bg-gray-50 p-2 rounded transition-colors"
                >
                  <p className="text-lg font-bold text-slate-900">{followers.length}</p>
                  <p className="text-xs text-slate-500">Followers</p>
                </button>
                <button
                  onClick={() => setShowFollowingModal(true)}
                  className="hover:bg-gray-50 p-2 rounded transition-colors"
                >
                  <p className="text-lg font-bold text-slate-900">{following.length}</p>
                  <p className="text-xs text-slate-500">Following</p>
                </button>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {toDisplayDate(joinDate)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Tabs */}
        <div className="md:col-span-2">
          <Tabs defaultValue="questions" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="questions" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Questions ({userQuestions.length})
              </TabsTrigger>
              <TabsTrigger value="answers" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Answers ({userAnswers.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="questions" className="mt-6">
              <div className="space-y-4">
                {userQuestions.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">No questions asked yet.</p>
                ) : (
                  userQuestions.map((question) => (
                    <QuestionCard key={question.id} question={question} onQuestionClick={onQuestionClick} />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="answers" className="mt-6">
              <div className="space-y-4">
                {userAnswers.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">No answers posted yet.</p>
                ) : (
                  userAnswers.map((answer) => (
                    <div key={answer.id} className="border-l-4 border-blue-200 pl-4">
                      <AnswerCard answer={answer} comments={[]} />
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {isOwnProfile && (
        <EditProfileModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} user={profileUser} />
      )}

      <FollowersModal
        isOpen={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
        title={`${profileUser.name}'s Followers`}
        follows={followers}
        type="followers"
      />

      <FollowersModal
        isOpen={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
        title={`${profileUser.name} is Following`}
        follows={following}
        type="following"
      />
    </div>
  )
}
