import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
// Simple in-memory rate limiter (suitable for single instance / dev only)
const rateLimitStore = new Map<string, { count: number; reset: number }>()
function checkRateLimit(ip: string, limit = 100, windowMs = 15 * 60 * 1000) {
  const now = Date.now()
  const rec = rateLimitStore.get(ip)
  if (!rec || now > rec.reset) {
    rateLimitStore.set(ip, { count: 1, reset: now + windowMs })
    return { allowed: true, remaining: limit - 1 }
  }
  if (rec.count >= limit) return { allowed: false, remaining: 0, retryAfter: Math.ceil((rec.reset - now)/1000) }
  rec.count++
  return { allowed: true, remaining: limit - rec.count }
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Security headers
  response.headers.set("X-DNS-Prefetch-Control", "on")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "origin-when-cross-origin")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://www.google-analytics.com https://analytics.google.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ")

  response.headers.set("Content-Security-Policy", csp)

  // Rate limiting for API routes (in-memory)
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"
    const { allowed, remaining, retryAfter } = checkRateLimit(ip)
    response.headers.set("X-RateLimit-Limit", "100")
    response.headers.set("X-RateLimit-Remaining", (remaining ?? 0).toString())
    if (!allowed) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: {
          "Retry-After": (retryAfter ?? 900).toString(),
          "X-RateLimit-Limit": "100",
          "X-RateLimit-Remaining": "0",
        },
      })
    }
  }

  // CORS headers for API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    response.headers.set("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN || "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
