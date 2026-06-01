import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base: shared across all variants
  "group/button font-body inline-flex shrink-0 items-center justify-center gap-1.5 font-bold whitespace-nowrap transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50 active:not-aria-[haspopup]:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Primary: indigo — matches DESIGN_SYSTEM.buttons.primary
        default:
          "rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100 dark:shadow-none focus-visible:ring-2 focus-visible:ring-indigo-400/60",
        // Secondary: slate — matches DESIGN_SYSTEM.buttons.secondary
        secondary:
          "rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 focus-visible:ring-2 focus-visible:ring-slate-400/40",
        // Outline: matches DESIGN_SYSTEM.buttons.outline
        outline:
          "rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 focus-visible:ring-2 focus-visible:ring-slate-300/50",
        // Ghost: transparent
        ghost:
          "rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 focus-visible:ring-2 focus-visible:ring-slate-300/50",
        // Destructive: rose
        destructive:
          "rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/50 border border-rose-100 dark:border-rose-900/40 focus-visible:ring-2 focus-visible:ring-rose-400/40",
        // Link
        link: "rounded-none text-indigo-600 dark:text-indigo-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 text-sm",
        sm:      "h-8 px-3.5 text-xs rounded-xl",
        xs:      "h-7 px-2.5 text-xs rounded-lg",
        lg:      "h-12 px-7 text-base",
        icon:    "size-10 rounded-xl",
        "icon-sm": "size-8 rounded-lg",
        "icon-xs": "size-7 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
