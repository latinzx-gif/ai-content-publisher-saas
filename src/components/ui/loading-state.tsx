import * as React from "react"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingStateProps extends React.ComponentProps<"div"> {
  title?: string
  description?: string
  spinnerSize?: "sm" | "md" | "lg"
}

export function LoadingState({
  title = "Loading Content...",
  description = "Please wait while we retrieve the latest data.",
  spinnerSize = "md",
  className,
  ...props
}: LoadingStateProps) {
  const spinnerClass = cn(
    "animate-spin rounded-full border-4 border-slate-100 border-t-indigo-600 dark:border-slate-800 dark:border-t-indigo-400",
    {
      "h-12 w-12": spinnerSize === "sm",
      "h-20 w-20": spinnerSize === "md",
      "h-28 w-28": spinnerSize === "lg",
    }
  )

  const iconClass = cn(
    "text-indigo-600 dark:text-indigo-400 animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    {
      "w-5 h-5": spinnerSize === "sm",
      "w-8 h-8": spinnerSize === "md",
      "w-12 h-12": spinnerSize === "lg",
    }
  )

  return (
    <div
      className={cn(
        "flex min-h-[300px] flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300",
        className
      )}
      {...props}
    >
      <div className="relative mb-6">
        <div className={spinnerClass} />
        <Sparkles className={iconClass} />
      </div>
      
      <div className="space-y-2">
        <h4 className="text-lg font-bold text-slate-900 dark:text-slate-50 tracking-tight font-heading">
          {title}
        </h4>
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 max-w-xs mx-auto leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )
}
