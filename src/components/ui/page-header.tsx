import { cn } from "@/lib/utils"
import { DESIGN_SYSTEM } from "@/config/design-system"

interface PageHeaderProps {
  title: string
  subtitle?: string
  children?: React.ReactNode
  className?: string
}

export function PageHeader({ title, subtitle, children, className }: PageHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4 pb-8", className)}>
      <div className="grid gap-1.5">
        <h1 className={cn(DESIGN_SYSTEM.typography.heading, "text-2xl md:text-3xl")}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2">
          {children}
        </div>
      )}
    </div>
  )
}

