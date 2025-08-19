"use client"

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Array<{ name: string; value: number; timestamp: number }> = []

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  recordMetric(name: string, value: number) {
    this.metrics.push({
      name,
      value,
      timestamp: Date.now(),
    })

    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100)
    }

    // Send to analytics if available
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "performance_metric", {
        event_category: "performance",
        event_label: name,
        value: Math.round(value),
      })
    }
  }

  measurePageLoad() {
    if (typeof window !== "undefined" && "performance" in window) {
      window.addEventListener("load", () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
          if (navigation) {
            this.recordMetric("page_load_time", navigation.loadEventEnd - navigation.fetchStart)
            this.recordMetric("dom_content_loaded", navigation.domContentLoadedEventEnd - navigation.fetchStart)
            this.recordMetric("first_byte", navigation.responseStart - navigation.fetchStart)
          }
        }, 0)
      })
    }
  }

  measureLCP() {
    if (typeof window !== "undefined" && "PerformanceObserver" in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          if (lastEntry) {
            this.recordMetric("largest_contentful_paint", lastEntry.startTime)
          }
        })
        observer.observe({ entryTypes: ["largest-contentful-paint"] })
      } catch (e) {
        console.warn("LCP measurement not supported")
      }
    }
  }

  measureFID() {
    if (typeof window !== "undefined" && "PerformanceObserver" in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            if (entry.name === "first-input") {
              this.recordMetric("first_input_delay", (entry as any).processingStart - entry.startTime)
            }
          })
        })
        observer.observe({ entryTypes: ["first-input"] })
      } catch (e) {
        console.warn("FID measurement not supported")
      }
    }
  }

  measureCLS() {
    if (typeof window !== "undefined" && "PerformanceObserver" in window) {
      try {
        let clsValue = 0
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value
            }
          })
          this.recordMetric("cumulative_layout_shift", clsValue)
        })
        observer.observe({ entryTypes: ["layout-shift"] })
      } catch (e) {
        console.warn("CLS measurement not supported")
      }
    }
  }

  init() {
    this.measurePageLoad()
    this.measureLCP()
    this.measureFID()
    this.measureCLS()
  }
}

// Error tracking
export function trackError(error: Error, context?: Record<string, any>) {
  console.error("[v0] Error tracked:", error, context)

  // Send to analytics
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "exception", {
      description: error.message,
      fatal: false,
      custom_map: context,
    })
  }

  // In production, send to error tracking service like Sentry
  // Sentry.captureException(error, { extra: context })
}
