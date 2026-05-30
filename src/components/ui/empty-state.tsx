import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { DESIGN_SYSTEM } from "@/config/design-system"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    href: string
  }
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn(
      "flex min-h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] p-8 text-center animate-in fade-in zoom-in duration-300",
      className
    )}>
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 mb-6 shadow-sm">
        <Icon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
      </div>
      <h3 className={cn(DESIGN_SYSTEM.typography.heading, "text-lg mb-2")}>{title}</h3>
      <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold max-w-sm mb-6 leading-relaxed">{description}</p>
      {action && (
        <Link 
          href={action.href} 
          className={cn(buttonVariants({ size: 'default' }), DESIGN_SYSTEM.buttons.primary)}
        >
          {action.label}
        </Link>
      )}
    </div>
  )
}
