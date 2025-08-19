"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Toast {
  id: string
  title?: string
  description?: string
  type?: "default" | "success" | "error" | "warning"
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const addToast = React.useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { ...toast, id }
    setToasts((prev) => [...prev, newToast])

    // Auto remove after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, toast.duration || 5000)
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn("min-w-[300px] rounded-lg border p-4 shadow-lg transition-all", "bg-white border-gray-200", {
            "border-green-200 bg-green-50": toast.type === "success",
            "border-red-200 bg-red-50": toast.type === "error",
            "border-yellow-200 bg-yellow-50": toast.type === "warning",
          })}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {toast.title && (
                <div
                  className={cn("font-semibold text-sm mb-1", {
                    "text-green-800": toast.type === "success",
                    "text-red-800": toast.type === "error",
                    "text-yellow-800": toast.type === "warning",
                    "text-gray-800": toast.type === "default" || !toast.type,
                  })}
                >
                  {toast.title}
                </div>
              )}
              {toast.description && (
                <div
                  className={cn("text-sm", {
                    "text-green-700": toast.type === "success",
                    "text-red-700": toast.type === "error",
                    "text-yellow-700": toast.type === "warning",
                    "text-gray-600": toast.type === "default" || !toast.type,
                  })}
                >
                  {toast.description}
                </div>
              )}
            </div>
            <button onClick={() => removeToast(toast.id)} className="ml-2 text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
