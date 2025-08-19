"use client"
import { useEffect } from 'react'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[GlobalError]', error)
  }, [error])

  return (
    <html>
      <body className="min-h-screen flex flex-col items-center justify-center gap-6 text-center p-8">
        <h1 className="text-4xl font-bold">Something went wrong</h1>
        <p className="text-slate-600 dark:text-slate-300 max-w-md">An unexpected error occurred. You can try again or return home.</p>
        <div className="flex gap-4">
          <button onClick={() => reset()} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Try again</button>
          <a href="/" className="px-4 py-2 border rounded hover:bg-slate-100 dark:hover:bg-slate-800">Home</a>
        </div>
      </body>
    </html>
  )
}
