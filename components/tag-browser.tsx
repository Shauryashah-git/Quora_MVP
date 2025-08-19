"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TagBrowserProps {
  tags: { name: string; count: number }[]
  selectedTags: string[]
  onTagClick: (tag: string) => void
}

export function TagBrowser({ tags, selectedTags, onTagClick }: TagBrowserProps) {
  const sortedTags = tags.sort((a, b) => b.count - a.count)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Popular Tags</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {sortedTags.map((tag) => (
            <Badge
              key={tag.name}
              variant={selectedTags.includes(tag.name) ? "default" : "secondary"}
              className="cursor-pointer hover:bg-slate-200 flex items-center gap-1"
              onClick={() => onTagClick(tag.name)}
            >
              {tag.name}
              <span className="text-xs opacity-70">({tag.count})</span>
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
