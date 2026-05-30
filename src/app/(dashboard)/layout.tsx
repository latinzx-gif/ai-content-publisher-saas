import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { isSingleOwnerMode } from '@/lib/owner-context';

export const dynamic = 'force-dynamic';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isSingleOwner = isSingleOwnerMode();

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FA]">
      <Sidebar isSingleOwner={isSingleOwner} />
      <div className="flex flex-col flex-1 min-w-0">
        <Navbar isSingleOwner={isSingleOwner} />
        <main className="flex-1 overflow-y-auto">
          <div className="h-full w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
