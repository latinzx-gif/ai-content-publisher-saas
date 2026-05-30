import * as React from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { DESIGN_SYSTEM } from "@/config/design-system"

interface MetricCardProps extends React.ComponentProps<"div"> {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: {
    value: string | number
    label: string
    isPositive?: boolean
  }
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  ...props
}: MetricCardProps) {
  return (
    <div
      className={cn(DESIGN_SYSTEM.cards.metric, className)}
      {...props}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <h3 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50 font-heading">
          {value}
        </h3>
        
        {trend && (
          <div className="flex items-center gap-1.5 mt-2">
            <span className={cn(
              "text-[10px] font-black px-1.5 py-0.5 rounded-md",
              trend.isPositive 
                ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-450" 
                : "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-450"
            )}>
              {trend.value}
            </span>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
              {trend.label}
            </span>
          </div>
        )}

        {!trend && description && (
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
