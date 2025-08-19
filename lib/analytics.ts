"use client"

// Google Analytics 4 integration
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

export const pageview = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Track user interactions
export const trackQuestionView = (questionId: string, questionTitle: string) => {
  event({
    action: "view_question",
    category: "engagement",
    label: questionTitle,
  })
}

export const trackQuestionPost = (questionTitle: string, tags: string[]) => {
  event({
    action: "post_question",
    category: "content_creation",
    label: questionTitle,
  })
}

export const trackAnswerPost = (questionId: string) => {
  event({
    action: "post_answer",
    category: "content_creation",
    label: questionId,
  })
}

export const trackVote = (type: "upvote" | "downvote", targetType: "question" | "answer") => {
  event({
    action: type,
    category: "engagement",
    label: targetType,
  })
}

export const trackSearch = (query: string, resultsCount: number) => {
  event({
    action: "search",
    category: "engagement",
    label: query,
    value: resultsCount,
  })
}

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void
  }
}
