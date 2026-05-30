import { Calendar } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export default function CalendarPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] max-w-4xl mx-auto py-12 px-4">
      <EmptyState
        icon={Calendar}
        title="Content Calendar (Coming Soon)"
        description="Soon you will be able to plan, schedule, and visually manage all your approved posts on a responsive calendar layout. For now, manage your drafts and publishing queues directly from the review page."
        action={{
          label: "Go to Review Content →",
          href: "/drafts"
        }}
        className="w-full bg-white border border-slate-100 shadow-sm"
      />
    </div>
  );
}
