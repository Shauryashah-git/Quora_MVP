"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { Topic } from "@/types"

interface TopicFilterProps {
  topics: Topic[]
  selectedTopics: string[]
  onTopicSelect: (topicId: string) => void
  onTopicRemove: (topicId: string) => void
  onClearAll: () => void
}

export function TopicFilter({ topics, selectedTopics, onTopicSelect, onTopicRemove, onClearAll }: TopicFilterProps) {
  const selectedTopicObjects = topics.filter((topic) => selectedTopics.includes(topic.id))
  const availableTopics = topics.filter((topic) => !selectedTopics.includes(topic.id))

  return (
    <div className="space-y-4">
      {selectedTopics.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium">Filtering by:</span>
          {selectedTopicObjects.map((topic) => (
            <Badge key={topic.id} variant="default" className="bg-quora-red hover:bg-quora-red/90">
              {topic.name}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => onTopicRemove(topic.id)} />
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            Clear all
          </Button>
        </div>
      )}

      {availableTopics.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-slate-600">Popular topics:</span>
          {availableTopics.slice(0, 8).map((topic) => (
            <Badge
              key={topic.id}
              variant="outline"
              className="cursor-pointer hover:bg-slate-50"
              onClick={() => onTopicSelect(topic.id)}
            >
              {topic.name}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
