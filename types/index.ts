export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  bio?: string
  reputation: number
}

export interface Question {
  id: string
  title: string
  content: string
  authorId: string
  author: User
  createdAt: Date
  updatedAt: Date
  tags: string[]
  upvotes: number
  downvotes: number
  answerCount: number
  topicId?: string
}

export interface Answer {
  id: string
  content: string
  questionId: string
  authorId: string
  author: User
  createdAt: Date
  updatedAt: Date
  upvotes: number
  downvotes: number
  isAccepted: boolean
}

export interface Vote {
  id: string
  userId: string
  targetId: string // question or answer id
  targetType: "question" | "answer"
  type: "upvote" | "downvote"
}

export interface Comment {
  id: string
  content: string
  answerId: string
  authorId: string
  author: User
  createdAt: Date
  updatedAt: Date
}

export interface Topic {
  id: string
  name: string
  description: string
  icon: string
  questionCount: number
  followerCount: number
  color: string
}

export interface Follow {
  id: string
  followerId: string
  followingId: string
  followingType: "user" | "topic"
  createdAt: Date
}

export interface Notification {
  id: string
  userId: string
  type: "answer" | "follow" | "comment" | "upvote" | "new_question"
  title: string
  message: string
  isRead: boolean
  createdAt: Date
  relatedId?: string // question/answer/user id
  relatedType?: "question" | "answer" | "user"
  actionUserId?: string // who performed the action
  actionUser?: User
}

export interface Report {
  id: string
  reporterId: string
  reporter: User
  targetId: string
  targetType: "question" | "answer" | "comment"
  reason: "spam" | "harassment" | "inappropriate" | "misinformation" | "other"
  description: string
  status: "pending" | "reviewed" | "resolved" | "dismissed"
  createdAt: Date
  reviewedAt?: Date
  reviewedBy?: string
  moderatorNotes?: string
}
