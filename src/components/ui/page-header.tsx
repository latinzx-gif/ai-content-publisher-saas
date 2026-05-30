import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  subtitle?: string
  children?: React.ReactNode
  className?: string
}

export function PageHeader({ title, subtitle, children, className }: PageHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4 pb-8", className)}>
      <div className="grid gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg text-muted-foreground">
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
