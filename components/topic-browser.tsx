"use client"

import { useState } from "react"
import { TopicCard } from "./topic-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, TrendingUp, Users, BookOpen } from "lucide-react"
import type { Topic } from "@/types"

interface TopicBrowserProps {
  topics: Topic[]
  followedTopics: string[]
  onFollowTopic: (topicId: string) => void
  onUnfollowTopic: (topicId: string) => void
  onTopicClick: (topicId: string) => void
}

export function TopicBrowser({
  topics,
  followedTopics,
  onFollowTopic,
  onUnfollowTopic,
  onTopicClick,
}: TopicBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const categories = [
    { id: "all", name: "All Topics", icon: BookOpen },
    { id: "trending", name: "Trending", icon: TrendingUp },
    { id: "following", name: "Following", icon: Users },
  ]

  const filteredTopics = topics.filter((topic) => {
    const matchesSearch =
      topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase())

    if (selectedCategory === "following") {
      return matchesSearch && followedTopics.includes(topic.id)
    }

    if (selectedCategory === "trending") {
      return matchesSearch && topic.questionCount > 50
    }

    return matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? "bg-quora-red hover:bg-quora-red/90" : ""}
              >
                <Icon className="h-4 w-4 mr-1" />
                {category.name}
              </Button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTopics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            isFollowing={followedTopics.includes(topic.id)}
            onFollow={onFollowTopic}
            onUnfollow={onUnfollowTopic}
            onClick={onTopicClick}
          />
        ))}
      </div>

      {filteredTopics.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-slate-300" />
          <p>No topics found matching your search.</p>
        </div>
      )}
    </div>
  )
}
