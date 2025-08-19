"use client"

import Head from "next/head"
import type { Question, User } from "@/types"
import { generateStructuredData, generateBreadcrumbStructuredData } from "@/lib/seo"

interface SEOHeadProps {
  question?: Question
  user?: User
  breadcrumbs?: Array<{ name: string; url: string }>
}

export function SEOHead({ question, user, breadcrumbs }: SEOHeadProps) {
  return (
    <Head>
      {question && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateStructuredData(question)),
          }}
        />
      )}

      {breadcrumbs && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateBreadcrumbStructuredData(breadcrumbs)),
          }}
        />
      )}

      {/* Preload critical resources */}
      <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />

      {/* DNS prefetch for external resources */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
    </Head>
  )
}
