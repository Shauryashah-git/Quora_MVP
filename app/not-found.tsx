export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 text-center p-8">
      <h1 className="text-5xl font-bold tracking-tight">404</h1>
      <p className="text-slate-600 dark:text-slate-300 max-w-md">The page you are looking for could not be found.</p>
      <a href="/" className="text-red-600 hover:underline font-medium">Return home</a>
    </main>
  )
}
