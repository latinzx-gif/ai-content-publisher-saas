import { PageHeader } from '@/components/ui/page-header'
import { EmptyState } from '@/components/ui/empty-state'
import { Calendar as CalendarIcon } from 'lucide-react'

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Content Calendar" 
        subtitle="จัดการแผนการโพสต์รายเดือนของคุณในรูปแบบปฏิทิน"
      />
      <EmptyState 
        icon={CalendarIcon}
        title="Content Calendar (Coming Soon)"
        description="ฟีเจอร์ตารางเวลาการเผยแพร่อยู่ในแผนการพัฒนาลำดับถัดไป (Milestone 2) คุณจะสามารถดูภาพรวมและนัดเวลาโพสต์ได้จากหน้านี้"
      />
    </div>
  )
}
