import type { MetadataRoute } from "next"
import { mockQuestions, mockUsers, mockTopics } from "@/lib/mock-data"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/topics`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ]

  // Dynamic question pages
  const questionPages = mockQuestions.map((question) => ({
    url: `${baseUrl}/question/${question.id}`,
    lastModified: question.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  // Dynamic user pages
  const userPages = mockUsers.map((user) => ({
    url: `${baseUrl}/user/${user.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  // Dynamic topic pages
  const topicPages = mockTopics.map((topic) => ({
    url: `${baseUrl}/topic/${topic.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))

  return [...staticPages, ...questionPages, ...userPages, ...topicPages]
}
