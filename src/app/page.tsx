import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  CheckSquare, 
  Send,
  Fingerprint,
  Link2,
  KeyRound,
  type LucideIcon
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch Stats
  const { data: posts } = await supabase
    .from('content_posts')
    .select('status')
    .eq('user_id', user.id)

  const { data: brand } = await supabase
    .from('brands')
    .select('id')
    .eq('user_id', user.id)
    .single()

  const { data: integrations } = await supabase
    .from('integrations')
    .select('provider')
    .eq('user_id', user.id)

  const stats = {
    draft: posts?.filter(p => p.status === 'draft').length || 0,
    approved: posts?.filter(p => p.status === 'approved').length || 0,
    published: posts?.filter(p => p.status === 'published').length || 0,
    hasBrand: !!brand,
    hasOpenAI: integrations?.some(i => i.provider === 'openai') || false,
    hasBuffer: integrations?.some(i => i.provider === 'buffer') || false,
  }

  const workflowSteps = [
    { 
      title: 'Configure', 
      desc: 'ตั้งค่าตัวตนแบรนด์และ API', 
      done: stats.hasBrand && stats.hasOpenAI && stats.hasBuffer,
      href: '/profile',
      icon: Fingerprint 
    },
    { 
      title: 'Generate', 
      desc: 'สร้างคอนเทนต์ด้วย AI', 
      done: stats.draft > 0 || stats.approved > 0 || stats.published > 0,
      href: '/generate',
      icon: Sparkles 
    },
    { 
      title: 'Review', 
      desc: 'ตรวจสอบและแก้ไขเนื้อหา', 
      done: stats.approved > 0 || stats.published > 0,
      href: '/drafts',
      icon: FileText 
    },
    { 
      title: 'Publish', 
      desc: 'ส่งไปยังโซเชียลมีเดีย', 
      done: stats.published > 0,
      href: '/drafts',
      icon: Send 
    },
  ]

  return (
    <div className="space-y-10 pb-20">
      <PageHeader 
        title="Dashboard" 
        subtitle={`สวัสดี ยินดีต้อนรับกลับมา! นี่คือภาพรวมความคืบหน้าของงานคุณในวันนี้`}
      />

      {/* Connection Status Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatusCard 
          title="Brand Profile" 
          status={stats.hasBrand} 
          href="/profile" 
          icon={Fingerprint}
          label={stats.hasBrand ? "พร้อมใช้งาน" : "ยังไม่ได้ตั้งค่า"}
        />
        <StatusCard 
          title="OpenAI API" 
          status={stats.hasOpenAI} 
          href="/settings" 
          icon={KeyRound}
          label={stats.hasOpenAI ? "เชื่อมต่อแล้ว" : "ไม่ได้เชื่อมต่อ"}
          color="green"
        />
        <StatusCard 
          title="Buffer Publishing" 
          status={stats.hasBuffer} 
          href="/settings" 
          icon={Link2}
          label={stats.hasBuffer ? "เชื่อมต่อแล้ว" : "ไม่ได้เชื่อมต่อ"}
          color="blue"
        />
      </div>

      {/* Workflow Visualization */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900 px-1 text-blue-600">Your Publishing Workflow</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {workflowSteps.map((step, i) => (
            <Link key={step.title} href={step.href}>
                <Card className={cn(
                    "relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-none shadow-sm",
                    step.done ? "bg-white" : "bg-gray-50 opacity-70"
                )}>
                    <CardContent className="p-6">
                        <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
                            step.done ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "bg-gray-200 text-gray-400"
                        )}>
                            <step.icon className="w-6 h-6" />
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Step {i + 1}</span>
                            {step.done && <CheckCircle2 className="w-3 h-3 text-green-500" />}
                        </div>
                        <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{step.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{step.desc}</p>
                    </CardContent>
                </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <MetricCard 
          title="Drafts" 
          count={stats.draft} 
          desc="โพสต์ที่รอการตรวจสอบ" 
          icon={FileText} 
          color="gray"
          href="/drafts"
        />
        <MetricCard 
          title="Approved" 
          count={stats.approved} 
          desc="โพสต์ที่พร้อมเผยแพร่" 
          icon={CheckSquare} 
          color="green"
          href="/drafts"
        />
        <MetricCard 
          title="Published" 
          count={stats.published} 
          desc="โพสต์ที่ส่งไป Buffer แล้ว" 
          icon={Send} 
          color="blue"
          href="/drafts"
        />
      </div>
    </div>
  )
}

interface StatusCardProps {
    title: string
    status: boolean
    label: string
    href: string
    icon: LucideIcon
    color?: "blue" | "green"
}

function StatusCard({ title, status, label, href, icon: Icon, color = "blue" }: StatusCardProps) {
    return (
        <Card className="border-none shadow-sm shadow-gray-200/50 rounded-2xl overflow-hidden group">
            <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center border transition-colors",
                        status 
                            ? (color === 'green' ? "bg-green-50 text-green-600 border-green-100" : "bg-blue-50 text-blue-600 border-blue-100")
                            : "bg-gray-50 text-gray-400 border-gray-100"
                    )}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{title}</p>
                        <p className={cn("text-sm font-bold", status ? "text-gray-900" : "text-gray-400")}>{label}</p>
                    </div>
                </div>
                <Link href={href} className="text-gray-300 group-hover:text-blue-600 transition-colors">
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </CardContent>
        </Card>
    )
}

interface MetricCardProps {
    title: string
    count: number
    desc: string
    icon: LucideIcon
    color: "gray" | "green" | "blue"
    href: string
}

function MetricCard({ title, count, desc, icon: Icon, color, href }: MetricCardProps) {
    const colors: Record<string, string> = {
        gray: "bg-gray-100 text-gray-600 border-gray-200 shadow-gray-100",
        green: "bg-green-50 text-green-600 border-green-100 shadow-green-100",
        blue: "bg-blue-50 text-blue-600 border-blue-100 shadow-blue-100"
    }

    return (
        <Card className="border-none shadow-xl shadow-gray-200/50 rounded-2xl p-2 bg-white group transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", colors[color])}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <Link href={href} className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), "text-[10px] uppercase font-extrabold tracking-widest text-gray-400 hover:text-blue-600")}>
                        View All
                    </Link>
                </div>
            </CardHeader>
            <CardContent className="pb-6">
                <div className="text-4xl font-black text-gray-900 tracking-tighter mb-1">{count}</div>
                <div className="text-sm font-bold text-gray-900">{title}</div>
                <p className="text-xs text-muted-foreground mt-1">{desc}</p>
            </CardContent>
        </Card>
    )
}
