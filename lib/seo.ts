import type { Metadata } from "next"
import type { Question, User } from "@/types"

export const defaultMetadata: Metadata = {
  title: {
    default: "Quora MVP - Ask Questions, Get Answers",
    template: "%s | Quora MVP",
  },
  description:
    "Join our Q&A community to ask questions, share knowledge, and connect with experts across various topics. Get answers in Hindi and English.",
  keywords: [
    "questions and answers",
    "Q&A platform",
    "knowledge sharing",
    "community",
    "Hindi",
    "English",
    "expert answers",
    "learning",
    "discussion",
  ],
  authors: [{ name: "Quora MVP Team" }],
  creator: "Quora MVP",
  publisher: "Quora MVP",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://quora-mvp.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Quora MVP - Ask Questions, Get Answers",
    description:
      "Join our Q&A community to ask questions, share knowledge, and connect with experts across various topics.",
    siteName: "Quora MVP",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Quora MVP - Q&A Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quora MVP - Ask Questions, Get Answers",
    description: "Join our Q&A community to ask questions, share knowledge, and connect with experts.",
    images: ["/og-image.png"],
    creator: "@quoramvp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
}

export function generateQuestionMetadata(question: Question): Metadata {
  const title = question.title
  const description = question.content.length > 160 ? `${question.content.substring(0, 157)}...` : question.content

  return {
    title,
    description,
    keywords: [...question.tags, "question", "answer", "discussion"],
    openGraph: {
      type: "article",
      title,
      description,
      url: `/question/${question.id}`,
      publishedTime: question.createdAt.toISOString(),
      modifiedTime: question.updatedAt.toISOString(),
      authors: [question.author.name],
      tags: question.tags,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: `/question/${question.id}`,
    },
  }
}

export function generateUserMetadata(user: User): Metadata {
  const title = `${user.name}'s Profile`
  const description = user.bio || `View ${user.name}'s questions, answers, and activity on Quora MVP.`

  return {
    title,
    description,
    openGraph: {
      type: "profile",
      title,
      description,
      url: `/user/${user.id}`,
      images: [
        {
          url: user.avatar || "/default-avatar.png",
          width: 400,
          height: 400,
          alt: `${user.name}'s profile picture`,
        },
      ],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [user.avatar || "/default-avatar.png"],
    },
    alternates: {
      canonical: `/user/${user.id}`,
    },
  }
}

export function generateStructuredData(question: Question) {
  return {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: question.title,
      text: question.content,
      answerCount: question.answerCount,
      upvoteCount: question.upvotes,
      dateCreated: question.createdAt.toISOString(),
      dateModified: question.updatedAt.toISOString(),
      author: {
        "@type": "Person",
        name: question.author.name,
        image: question.author.avatar,
      },
      keywords: question.tags.join(", "),
    },
  }
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
