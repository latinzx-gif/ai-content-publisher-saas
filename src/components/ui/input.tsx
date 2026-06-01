import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        // Design System: h-10, rounded-xl, slate border, indigo focus ring
        "h-10 w-full min-w-0 rounded-xl border border-slate-200 dark:border-slate-700",
        "font-body bg-white dark:bg-slate-900/60 px-3 py-1 text-sm font-medium",
        "text-slate-800 dark:text-slate-200 transition-all outline-none",
        "placeholder:text-slate-400 dark:placeholder:text-slate-500",
        "focus-visible:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-300/40",
        "dark:focus-visible:border-indigo-500 dark:focus-visible:ring-indigo-500/20",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:opacity-50",
        "aria-invalid:border-rose-400 aria-invalid:ring-2 aria-invalid:ring-rose-200 dark:aria-invalid:ring-rose-500/20",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Input }
