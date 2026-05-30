import * as React from "react"
import { cn } from "@/lib/utils"
import { DESIGN_SYSTEM } from "@/config/design-system"

interface DashboardCardProps extends React.ComponentProps<"div"> {
  title?: string
  description?: string
  headerAction?: React.ReactNode
}

export function DashboardCard({
  title,
  description,
  headerAction,
  className,
  children,
  ...props
}: DashboardCardProps) {
  return (
    <div
      className={cn(DESIGN_SYSTEM.cards.dashboard, className)}
      {...props}
    >
      {(title || description || headerAction) && (
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 mb-6">
          <div className="space-y-1">
            {title && (
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-50 tracking-tight font-heading">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                {description}
              </p>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="text-sm text-slate-600 dark:text-slate-300 font-medium">
        {children}
      </div>
    </div>
  )
}
