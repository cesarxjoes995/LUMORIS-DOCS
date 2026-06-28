import { ReactNode } from 'react';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ClientSidebar } from './ClientSidebar';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen bg-black text-zinc-100 font-sans selection:bg-zinc-800">
      
      {/* Sidebar (Client Component for active states) */}
      <ClientSidebar userEmail={user.email} userRole={user.role} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-black">
        <header className="h-14 border-b border-zinc-900 bg-black flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span className="text-zinc-100 font-medium">{user.email}</span>
            <span className="text-zinc-600">/</span>
            <span className="font-medium text-zinc-300">Lumoris Labs</span>
            <span className="ml-3 px-1.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] font-medium tracking-wide uppercase">
              {user.role}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/playground" className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">
              Playground
            </Link>
            <button className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">
              Feedback
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 md:p-10 custom-scrollbar">
          <div className="max-w-[1000px] mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
