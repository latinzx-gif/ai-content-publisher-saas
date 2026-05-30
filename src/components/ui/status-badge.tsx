import { Badge } from "@/components/ui/badge"
import { PostStatus } from "@/types"
import { cn } from "@/lib/utils"

const statusConfig: Record<PostStatus, { label: string; className: string }> = {
  draft: {
    label: "ร่าง",
    className: "bg-gray-100 text-gray-700 border-gray-200",
  },
  approved: {
    label: "อนุมัติแล้ว",
    className: "bg-green-50 text-green-700 border-green-200",
  },
  rejected: {
    label: "ปฏิเสธ",
    className: "bg-red-50 text-red-700 border-red-200",
  },
  published: {
    label: "เผยแพร่แล้ว",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  failed: {
    label: "ล้มเหลว",
    className: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
}

interface StatusBadgeProps {
  status: PostStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <Badge 
      variant="outline" 
      className={cn("px-2 py-0.5 font-medium rounded-full", config.className, className)}
    >
      {config.label}
    </Badge>
  )
}
