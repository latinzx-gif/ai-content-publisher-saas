import { Badge } from "@/components/ui/badge"
import { PostStatus } from "@/types"
import { cn } from "@/lib/utils"
import { DESIGN_SYSTEM } from "@/config/design-system"

const statusConfig: Record<PostStatus, { label: string; className: string }> = {
  draft: {
    label: "ร่าง",
    className: DESIGN_SYSTEM.badges.draft,
  },
  text_approved: {
    label: "อนุมัติข้อความ",
    className: DESIGN_SYSTEM.badges.success,
  },
  images_pending: {
    label: "กำลังสร้างรูป",
    className: DESIGN_SYSTEM.badges.warning,
  },
  images_ready: {
    label: "พร้อมเลือกรูป",
    className: DESIGN_SYSTEM.badges.info,
  },
  creative_approved: {
    label: "อนุมัติครีเอทีฟ",
    className: DESIGN_SYSTEM.badges.success,
  },
  scheduled: {
    label: "กำหนดเวลา",
    className: DESIGN_SYSTEM.badges.info,
  },
  rejected: {
    label: "ปฏิเสธ",
    className: DESIGN_SYSTEM.badges.error,
  },
  published: {
    label: "เผยแพร่แล้ว",
    className: DESIGN_SYSTEM.badges.info,
  },
  failed: {
    label: "ล้มเหลว",
    className: DESIGN_SYSTEM.badges.warning,
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
