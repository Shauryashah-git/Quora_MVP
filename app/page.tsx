"use client"

import { useState, useMemo, useCallback, Suspense } from "react"
import { toDisplayDate } from "@/lib/date"
import { Button } from "@/components/ui/button"
import { QuestionCard } from "@/components/question-card"
import { AnswerCard } from "@/components/answer-card"
import { AskQuestionForm } from "@/components/ask-question-form"
import { PostAnswerForm } from "@/components/post-answer-form"
import { UserMenu } from "@/components/user-menu"
import { UserProfile } from "@/components/user-profile"
import { SearchFilters, type SortOption } from "@/components/search-filters"
import { TagBrowser } from "@/components/tag-browser"
import { TopicBrowser } from "@/components/topic-browser"
import { TopicFilter } from "@/components/topic-filter"
import { QuestionSkeleton, AnswerSkeleton, ProfileSkeleton } from "@/components/loading-skeleton"
import { ErrorBoundary } from "@/components/error-boundary"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/contexts/auth-context"
import { useDebounce } from "@/hooks/use-debounce"
import { mockQuestions, mockAnswers, mockUsers, mockComments, mockTopics } from "@/lib/mock-data"
import type { Question, Answer, User, Comment, Topic } from "@/types"
import { Plus, ArrowLeft, Hash, Bookmark, Loader2 } from "lucide-react"
import { handleTopicClick } from "@/lib/handle-topic-click"

type ViewMode = "home" | "question" | "profile" | "topics"

export default function Home() {
  const { user } = useAuth()
  const [questions, setQuestions] = useState<Question[]>(mockQuestions)
  const [answers, setAnswers] = useState<Answer[]>(mockAnswers)
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [topics] = useState<Topic[]>(mockTopics)
  const [followedTopics, setFollowedTopics] = useState<string[]>([])
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("home")
  const [showAskForm, setShowAskForm] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedAuthor, setSelectedAuthor] = useState("")
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([])

  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  const availableTags = useMemo(() => {
    const tagSet = new Set<string>()
    questions.forEach((q) => q.tags.forEach((tag) => tagSet.add(tag)))
    return Array.from(tagSet).sort()
  }, [questions])

  const availableAuthors = useMemo(() => {
    const authorSet = new Set<string>()
    questions.forEach((q) => authorSet.add(q.author.name))
    return Array.from(authorSet).sort()
  }, [questions])

  const tagCounts = useMemo(() => {
    const counts: { [key: string]: number } = {}
    questions.forEach((q) => {
      q.tags.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1
      })
    })
    return Object.entries(counts).map(([name, count]) => ({ name, count }))
  }, [questions])

  const filteredAndSortedQuestions = useMemo(() => {
    const filtered = questions.filter((q) => {
      const matchesSearch =
        !debouncedSearchQuery ||
        q.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        q.content.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        q.tags.some((tag) => tag.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))

      const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => q.tags.includes(tag))
      const matchesAuthor = !selectedAuthor || q.author.name === selectedAuthor
      const matchesTopics =
        selectedTopicIds.length === 0 || selectedTopicIds.includes((q as any).topicId || "")

      return matchesSearch && matchesTags && matchesAuthor && matchesTopics
    })

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return a.createdAt.getTime() - b.createdAt.getTime()
        case "most-upvoted":
          return b.upvotes - a.upvotes
        case "most-answers":
          return b.answerCount - a.answerCount
        case "newest":
        default:
          return b.createdAt.getTime() - a.createdAt.getTime()
      }
    })
  }, [questions, debouncedSearchQuery, sortBy, selectedTags, selectedAuthor, selectedTopicIds])

  const questionAnswers = selectedQuestion ? answers.filter((a) => a.questionId === selectedQuestion.id) : []

  const handleQuestionClick = useCallback(
    (questionId: string) => {
      setIsLoading(true)
      const question = questions.find((q) => q.id === questionId)
      if (question) {
        setSelectedQuestion(question)
        setViewMode("question")
      }
      setIsLoading(false)
    },
    [questions],
  )

  const handleProfileClick = useCallback(
    (userId?: string) => {
      setIsLoading(true)
      const profileUser = userId ? mockUsers.find((u) => u.id === userId) : user
      if (profileUser) {
        setSelectedUser(profileUser)
        setViewMode("profile")
      }
      setIsLoading(false)
    },
    [user],
  )

  const handleBackToHome = useCallback(() => {
    setViewMode("home")
    setSelectedQuestion(null)
    setSelectedUser(null)
  }, [])

  const handleTagClick = useCallback((tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }, [])

  const handleAskQuestion = useCallback(
    async (questionData: { title: string; content: string; tags: string[] }) => {
      if (!user) return

      setIsSubmitting(true)
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        const newQuestion: Question = {
          id: Date.now().toString(),
          title: questionData.title,
          content: questionData.content,
          tags: questionData.tags,
          authorId: user.id,
          author: user,
          createdAt: new Date(),
          updatedAt: new Date(),
          upvotes: 0,
          downvotes: 0,
          answerCount: 0,
        }

        setQuestions((prev) => [newQuestion, ...prev])
        setShowAskForm(false)
      } catch (error) {
        console.error("[v0] Error submitting question:", error)
      } finally {
        setIsSubmitting(false)
      }
    },
    [user],
  )

  const handlePostAnswer = useCallback(
    async (content: string) => {
      if (!user || !selectedQuestion) return

      setIsSubmitting(true)
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        const newAnswer: Answer = {
          id: Date.now().toString(),
          content,
          questionId: selectedQuestion.id,
          authorId: user.id,
          author: user,
          createdAt: new Date(),
          updatedAt: new Date(),
          upvotes: 0,
          downvotes: 0,
          isAccepted: false,
        }

        setAnswers((prev) => [...prev, newAnswer])
        setQuestions((prev) =>
          prev.map((q) => (q.id === selectedQuestion.id ? { ...q, answerCount: q.answerCount + 1 } : q)),
        )
      } catch (error) {
        console.error("[v0] Error submitting answer:", error)
      } finally {
        setIsSubmitting(false)
      }
    },
    [user, selectedQuestion],
  )

  const handleEditAnswer = useCallback(
    (answerId: string, content: string) => {
      setAnswers(answers.map((a) => (a.id === answerId ? { ...a, content, updatedAt: new Date() } : a)))
    },
    [answers],
  )

  const handleDeleteAnswer = useCallback(
    (answerId: string) => {
      setAnswers(answers.filter((a) => a.id !== answerId))
      setComments(comments.filter((c) => c.answerId !== answerId))
    },
    [answers, comments],
  )

  const handleEditQuestion = useCallback(
    (questionId: string, updates: { title: string; content: string; tags: string[] }) => {
      setQuestions(questions.map((q) => (q.id === questionId ? { ...q, ...updates, updatedAt: new Date() } : q)))
    },
    [questions],
  )

  const handleDeleteQuestion = useCallback(
    (questionId: string) => {
      setQuestions(questions.filter((q) => q.id !== questionId))
      // Also delete associated answers and comments
      const questionAnswerIds = answers.filter((a) => a.questionId === questionId).map((a) => a.id)
      setAnswers(answers.filter((a) => a.questionId !== questionId))
      setComments(comments.filter((c) => !questionAnswerIds.includes(c.answerId)))
    },
    [answers, comments, questions],
  )

  const onFollowTopic = useCallback((topicId: string) => setFollowedTopics((prev) => [...prev, topicId]), [])
  const onUnfollowTopic = useCallback(
    (topicId: string) => setFollowedTopics((prev) => prev.filter((id) => id !== topicId)),
    [],
  )

  if (viewMode === "profile" && selectedUser) {
    const userQuestions = questions.filter((q) => q.authorId === selectedUser.id)
    const userAnswers = answers.filter((a) => a.authorId === selectedUser.id)

    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
          <Suspense fallback={<ProfileSkeleton />}>
            <UserProfile
              profileUser={selectedUser}
              userQuestions={userQuestions}
              userAnswers={userAnswers}
              onQuestionClick={handleQuestionClick}
              onBack={handleBackToHome}
            />
          </Suspense>
        </div>
      </ErrorBoundary>
    )
  }

  // Topics View
  if (viewMode === "topics") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={handleBackToHome}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Browse Topics</h1>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <UserMenu onProfileClick={() => handleProfileClick()} />
            </div>
          </div>

          <TopicBrowser
            topics={topics}
            followedTopics={followedTopics}
            onFollowTopic={onFollowTopic}
            onUnfollowTopic={onUnfollowTopic}
            onTopicClick={handleTopicClick}
          />
        </div>
      </div>
    )
  }

  if (viewMode === "question" && selectedQuestion) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
          <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                onClick={handleBackToHome}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Questions
              </Button>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <UserMenu onProfileClick={() => handleProfileClick()} />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">{selectedQuestion.title}</h1>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{selectedQuestion.content}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {selectedQuestion.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium border border-gray-200 dark:border-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Asked by{" "}
                  <button
                    className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-medium hover:underline"
                    onClick={() => handleProfileClick(selectedQuestion.authorId)}
                  >
                    {selectedQuestion.author.name}
                  </button>{" "}
                  on {toDisplayDate(selectedQuestion.createdAt)}
                </div>
              </div>
            </div>

            <PostAnswerForm questionId={selectedQuestion.id} onSubmit={handlePostAnswer} isSubmitting={isSubmitting} />

            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                {questionAnswers.length} Answers
              </h2>
              {isLoading ? (
                <div className="space-y-4">
                  <AnswerSkeleton />
                  <AnswerSkeleton />
                </div>
              ) : (
                <>
                  {questionAnswers.map((answer) => (
                    <AnswerCard
                      key={answer.id}
                      answer={answer}
                      comments={comments}
                      onEditAnswer={handleEditAnswer}
                      onDeleteAnswer={handleDeleteAnswer}
                      onAddComment={(answerId: string, content: string) => {
                        if (!user) return

                        const newComment: Comment = {
                          id: Date.now().toString(),
                          content,
                          answerId,
                          authorId: user.id,
                          author: user,
                          createdAt: new Date(),
                          updatedAt: new Date(),
                        }

                        setComments((prev) => [...prev, newComment])
                      }}
                      onEditComment={(commentId: string, content: string) => {
                        setComments((prev) =>
                          prev.map((c) => (c.id === commentId ? { ...c, content, updatedAt: new Date() } : c)),
                        )
                      }}
                      onDeleteComment={(commentId: string) => {
                        setComments((prev) => prev.filter((c) => c.id !== commentId))
                      }}
                    />
                  ))}
                  {questionAnswers.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                      No answers yet. Be the first to answer!
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Quora MVP</h1>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button variant="outline" onClick={() => setViewMode("topics")} className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Browse Topics
              </Button>
              {user && (
                <Button
                  onClick={() => setShowAskForm(true)}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white border-0"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Ask Question
                </Button>
              )}
              <UserMenu onProfileClick={() => handleProfileClick()} />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-4">
            <div className="lg:col-span-3 space-y-6">
              {selectedTopicIds.length > 0 && (
                <TopicFilter
                  topics={topics}
                  selectedTopics={selectedTopicIds}
                  onTopicSelect={(topicId: string) => setSelectedTopicIds((prev) => [...prev, topicId])}
                  onTopicRemove={(topicId: string) =>
                    setSelectedTopicIds((prev) => prev.filter((id) => id !== topicId))
                  }
                  onClearAll={() => setSelectedTopicIds([])}
                />
              )}

              <SearchFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortBy={sortBy}
                onSortChange={setSortBy}
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
                availableTags={availableTags}
                selectedAuthor={selectedAuthor}
                onAuthorChange={setSelectedAuthor}
                availableAuthors={availableAuthors}
              />

              {showAskForm && user && (
                <AskQuestionForm
                  onSubmit={handleAskQuestion}
                  onCancel={() => setShowAskForm(false)}
                  isSubmitting={isSubmitting}
                />
              )}

              {!user && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm text-center border border-gray-200 dark:border-gray-700 transition-colors">
                  <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">Welcome to Quora MVP</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Sign in to ask questions and participate in discussions
                  </p>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {filteredAndSortedQuestions.length} Questions
                  </h2>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Sorted by {sortBy.replace("-", " ")}</div>
                </div>

                {isLoading ? (
                  <div className="space-y-4">
                    <QuestionSkeleton />
                    <QuestionSkeleton />
                    <QuestionSkeleton />
                  </div>
                ) : filteredAndSortedQuestions.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No questions found matching your criteria.</p>
                    {user && (
                      <Button onClick={() => setShowAskForm(true)} className="bg-red-600 hover:bg-red-700 text-white">
                        Ask the first question
                      </Button>
                    )}
                  </div>
                ) : (
                  filteredAndSortedQuestions.map((question) => (
                    <QuestionCard
                      key={question.id}
                      question={question}
                      onQuestionClick={handleQuestionClick}
                      onEditQuestion={handleEditQuestion}
                      onDeleteQuestion={handleDeleteQuestion}
                    />
                  ))
                )}
              </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              {followedTopics.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <Bookmark className="h-4 w-4" />
                    Following
                  </h3>
                  <div className="space-y-2">
                    {topics
                      .filter((t) => followedTopics.includes(t.id))
                      .slice(0, 5)
                      .map((topic) => (
                        <button
                          key={topic.id}
                          onClick={() =>
                            handleTopicClick(
                              topic.id,
                              selectedTopicIds,
                              setSelectedTopicIds,
                              (mode) => setViewMode(mode as ViewMode),
                            )
                          }
                          className="flex items-center gap-2 w-full text-left p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-sm transition-colors"
                        >
                          <span>{topic.icon}</span>
                          <span className="font-medium text-gray-800 dark:text-gray-200">{topic.name}</span>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              <TagBrowser tags={tagCounts} selectedTags={selectedTags} onTagClick={handleTagClick} />
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
