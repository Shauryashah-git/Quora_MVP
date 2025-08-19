"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { Search, Filter, X, ChevronDown } from "lucide-react"

export type SortOption = "newest" | "oldest" | "most-upvoted" | "most-answers"

interface SearchFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  availableTags: string[]
  selectedAuthor: string
  onAuthorChange: (author: string) => void
  availableAuthors: string[]
}

export function SearchFilters({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  selectedTags,
  onTagsChange,
  availableTags,
  selectedAuthor,
  onAuthorChange,
  availableAuthors,
}: SearchFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag))
    } else {
      onTagsChange([...selectedTags, tag])
    }
  }

  const clearFilters = () => {
    onSearchChange("")
    onTagsChange([])
    onAuthorChange("")
    onSortChange("newest")
  }

  const hasActiveFilters = searchQuery || selectedTags.length > 0 || selectedAuthor || sortBy !== "newest"

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
          <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
        </Button>
      </div>

      {/* Advanced Filters */}
      <Collapsible open={showFilters} onOpenChange={setShowFilters}>
        <CollapsibleContent>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Search Filters</CardTitle>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-1" />
                    Clear All
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Sort Options */}
              <div>
                <Label className="text-sm font-medium">Sort by</Label>
                <Select value={sortBy} onValueChange={(value: SortOption) => onSortChange(value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="most-upvoted">Most Upvoted</SelectItem>
                    <SelectItem value="most-answers">Most Answers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Author Filter */}
              <div>
                <Label className="text-sm font-medium">Filter by Author</Label>
                <Select value={selectedAuthor} onValueChange={onAuthorChange}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="All authors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-authors">All authors</SelectItem>
                    {availableAuthors.map((author) => (
                      <SelectItem key={author} value={author}>
                        {author}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tag Filters */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Filter by Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "secondary"}
                      className="cursor-pointer hover:bg-slate-200"
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag}
                      {selectedTags.includes(tag) && <X className="h-3 w-3 ml-1" />}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Active Filters Summary */}
              {hasActiveFilters && (
                <div className="pt-2 border-t">
                  <Label className="text-sm font-medium mb-2 block">Active Filters</Label>
                  <div className="flex flex-wrap gap-2">
                    {searchQuery && (
                      <Badge variant="outline">
                        Search: "{searchQuery}"
                        <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => onSearchChange("")} />
                      </Badge>
                    )}
                    {selectedAuthor && (
                      <Badge variant="outline">
                        Author: {selectedAuthor}
                        <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => onAuthorChange("")} />
                      </Badge>
                    )}
                    {sortBy !== "newest" && <Badge variant="outline">Sort: {sortBy.replace("-", " ")}</Badge>}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
