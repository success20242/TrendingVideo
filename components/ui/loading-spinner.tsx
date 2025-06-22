import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function LoadingSpinner({ className, size = "md" }: LoadingSpinnerProps) {
  let spinnerSize = "h-6 w-6"

  if (size === "sm") {
    spinnerSize = "h-4 w-4"
  } else if (size === "lg") {
    spinnerSize = "h-8 w-8"
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-blue-600 border-b-transparent",
          spinnerSize,
          className,
        )}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
}
