import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { VotingProvider } from "@/contexts/voting-context"
import { FollowProvider } from "@/contexts/follow-context"
import { NotificationProvider } from "@/contexts/notification-context"
import { ModerationProvider } from "@/contexts/moderation-context"
import { ToastProvider } from "@/components/ui/toast"
import { SkipLink } from "@/components/ui/skip-link"
import { defaultMetadata } from "@/lib/seo"
import { ThemeProvider } from "next-themes"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = defaultMetadata

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="theme-color" content="#B92B27" />
        <meta name="msapplication-TileColor" content="#B92B27" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Quora MVP" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SkipLink />
          <AuthProvider>
            <VotingProvider>
              <FollowProvider>
                <NotificationProvider>
                  <ModerationProvider>
                    <ToastProvider>
                      <main id="main-content" className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
                        {children}
                      </main>
                    </ToastProvider>
                  </ModerationProvider>
                </NotificationProvider>
              </FollowProvider>
            </VotingProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
