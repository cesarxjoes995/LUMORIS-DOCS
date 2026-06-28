import { prisma } from '@/lib/prisma';
import { Users, Activity, AlertCircle, Key, Server, Hash, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');
  if (user.role !== 'ADMIN') redirect('/dashboard');

  const users = await prisma.user.findMany({
    include: {
      _count: { select: { apiKeys: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  const totalLogs = await prisma.apiLog.count();
  const recentLogs = await prisma.apiLog.findMany({
    take: 15,
    orderBy: { createdAt: 'desc' },
    include: { apiKey: { include: { user: true } } }
  });

  const errorLogs = await prisma.apiLog.count({
    where: { status: { gte: 400 } }
  });

  const errorRate = totalLogs > 0 ? ((errorLogs / totalLogs) * 100).toFixed(2) : '0.00';
  const activeKeys = users.reduce((acc, user) => acc + user._count.apiKeys, 0);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-zinc-900 pb-6">
        <h1 className="text-2xl font-medium tracking-tight text-zinc-100">Admin Console</h1>
        <p className="text-sm text-zinc-500">Platform management and global network analytics.</p>
      </div>

      {/* Strict Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="p-4 rounded-lg bg-black border border-zinc-800 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-zinc-400">
            <Users className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Total Accounts</span>
          </div>
          <div className="text-2xl font-semibold text-zinc-100">{users.length.toLocaleString()}</div>
        </div>

        {/* API Calls */}
        <div className="p-4 rounded-lg bg-black border border-zinc-800 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-zinc-400">
            <Activity className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Network Calls</span>
          </div>
          <div className="text-2xl font-semibold text-zinc-100">{totalLogs.toLocaleString()}</div>
        </div>

        {/* Error Rate */}
        <div className="p-4 rounded-lg bg-black border border-zinc-800 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-zinc-400">
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Error Rate</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-zinc-100">{errorRate}%</span>
          </div>
        </div>

        {/* Active Keys */}
        <div className="p-4 rounded-lg bg-black border border-zinc-800 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-zinc-400">
            <Key className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Active Keys</span>
          </div>
          <div className="text-2xl font-semibold text-zinc-100">{activeKeys.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Users Table */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-zinc-100">Identity Directory</h2>
          </div>
          
          <div className="flex-1 bg-black border border-zinc-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="text-[11px] text-zinc-500 uppercase tracking-wider bg-zinc-900/50 border-b border-zinc-800">
                  <tr>
                    <th className="px-4 py-3 font-medium">Identifier</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Credits</th>
                    <th className="px-4 py-3 font-medium">API Keys</th>
                    <th className="px-4 py-3 font-medium text-right">Settings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-zinc-100 flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-zinc-800 flex items-center justify-center text-[9px] font-bold text-zinc-400">
                          {u.email.charAt(0).toUpperCase()}
                        </div>
                        {u.email}
                      </td>
                      <td className="px-4 py-3">
                        {u.role === 'ADMIN' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-100 text-black">
                            ADMIN
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-800 text-zinc-400">
                            USER
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">
                        {u.credits > 1000000 ? 'Unlimited' : u.credits.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-400">
                        {u._count.apiKeys} configured
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/dashboard/admin/users/${u.id}`} className="inline-flex items-center justify-center text-xs text-zinc-400 hover:text-zinc-100 transition-colors">
                          Edit <ChevronRight className="w-3 h-3 ml-1" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-zinc-500 text-sm">
                        No users registered.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Server Logs */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-zinc-100">Live Request Log</h2>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-zinc-500"></span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-zinc-500">Live</span>
            </div>
          </div>

          <div className="flex-1 bg-[#0A0A0A] border border-zinc-800 rounded-lg p-3 font-mono text-xs h-[500px] overflow-y-auto custom-scrollbar flex flex-col gap-1.5">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex flex-col gap-1 py-1.5 border-b border-zinc-900/50 last:border-0 hover:bg-zinc-900/20 px-1 rounded transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 rounded-sm text-[9px] font-bold ${
                      log.status >= 500 ? 'bg-red-950 text-red-500' :
                      log.status >= 400 ? 'bg-amber-950 text-amber-500' :
                      'bg-zinc-900 text-zinc-400'
                    }`}>
                      {log.status}
                    </span>
                    <span className="text-zinc-300 truncate max-w-[140px]">{log.endpoint}</span>
                  </div>
                  <span className="text-zinc-600">{log.latency}ms</span>
                </div>
                <div className="flex items-center gap-2 pl-[38px] text-[10px] text-zinc-500">
                  <Hash className="w-3 h-3" />
                  <span className="truncate">{log.apiKey.key.substring(0, 20)}...</span>
                </div>
              </div>
            ))}
            {recentLogs.length === 0 && (
              <div className="flex-1 flex items-center justify-center text-zinc-600">
                Listening for requests...
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
