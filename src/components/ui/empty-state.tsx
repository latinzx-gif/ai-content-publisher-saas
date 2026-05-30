import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"

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
      "flex min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-8 text-center animate-in fade-in zoom-in duration-300",
      className
    )}>
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 mb-6">
        <Icon className="h-10 w-10 text-blue-600" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-8">{description}</p>
      {action && (
        <Link 
          href={action.href} 
          className={cn(buttonVariants({ size: 'lg' }), "bg-blue-600 hover:bg-blue-700 shadow-md transition-all hover:scale-105 active:scale-95")}
        >
          {action.label}
        </Link>
      )}
    </div>
  )
}
