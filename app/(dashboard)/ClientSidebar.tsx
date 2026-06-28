"use client";

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Key, 
  BarChart2, 
  CreditCard, 
  Settings,
  LogOut,
  Command,
  Book,
  ShieldAlert
} from 'lucide-react';
import { logoutAction } from './logoutAction';

export function ClientSidebar({ userEmail, userRole }: { userEmail: string, userRole: string }) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path 
      ? "bg-zinc-900 text-zinc-100" 
      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50";
  };

  return (
    <aside className="w-[240px] border-r border-zinc-900 bg-black flex flex-col hidden md:flex shrink-0">
      <div className="h-14 flex items-center px-4 border-b border-zinc-900">
        <Link href="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
          <img src="/logo.png" alt="Lumoris Labs Logo" className="w-5 h-5 object-contain" style={{ filter: 'drop-shadow(0 0 3px rgba(192,38,211,0.6))' }} />
          <span className="font-semibold text-sm tracking-tight">Lumoris Labs</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        <div className="space-y-1">
          <Link href="/" className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md transition-colors ${isActive('/')}`}>
            <Home className={`w-4 h-4 ${pathname === '/' ? 'text-zinc-100' : 'text-zinc-400'}`} />
            <span className="text-sm font-medium">Overview</span>
          </Link>
        </div>

        <div className="space-y-1">
          <div className="text-[11px] font-medium text-zinc-500 mb-2 px-2 mt-2">Developers</div>
          <Link href="/keys" className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md transition-colors ${isActive('/keys')}`}>
            <Key className="w-4 h-4" />
            <span className="text-sm font-medium">API Keys</span>
          </Link>
          <Link href="/usage" className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md transition-colors ${isActive('/usage')}`}>
            <BarChart2 className="w-4 h-4" />
            <span className="text-sm font-medium">Usage</span>
          </Link>
          <Link href="/get-started/welcome" className="flex items-center gap-2.5 px-2 py-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50 rounded-md transition-colors">
            <Book className="w-4 h-4" />
            <span className="text-sm font-medium">Documentation</span>
          </Link>
        </div>

        <div className="space-y-1">
          <div className="text-[11px] font-medium text-zinc-500 mb-2 px-2 mt-2">Billing & Plans</div>
          <Link href="/pricing" className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md transition-colors ${isActive('/pricing')}`}>
            <CreditCard className="w-4 h-4" />
            <span className="text-sm font-medium">Pricing</span>
          </Link>
          <Link href="/billing" className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md transition-colors ${isActive('/billing')}`}>
            <CreditCard className="w-4 h-4" />
            <span className="text-sm font-medium">Billing & Top-Up</span>
          </Link>
        </div>

        {userRole === 'ADMIN' && (
          <div className="space-y-1">
            <div className="text-[11px] font-medium text-amber-500/80 mb-2 px-2 mt-2">Admin Area</div>
            <Link href="/admin" className={`flex items-center gap-2.5 px-2 py-1.5 rounded-md transition-colors ${isActive('/admin')}`}>
              <ShieldAlert className={`w-4 h-4 ${pathname === '/admin' ? 'text-amber-500' : 'text-amber-500/70'}`} />
              <span className={`text-sm font-medium ${pathname === '/admin' ? 'text-amber-500' : 'text-amber-500/70'}`}>Super Admin</span>
            </Link>
          </div>
        )}
      </nav>

      <div className="p-3 border-t border-zinc-900">
        <form action={logoutAction}>
          <button type="submit" className="flex items-center justify-between px-2 py-1.5 text-zinc-400 hover:text-zinc-100 w-full rounded-md transition-colors group">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-medium text-zinc-300">
                {userEmail.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium truncate">{userEmail}</span>
            </div>
            <LogOut className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500" />
          </button>
        </form>
      </div>
    </aside>
  );
}
