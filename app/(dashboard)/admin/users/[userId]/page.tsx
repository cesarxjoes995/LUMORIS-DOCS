import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Key, User, Activity } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import ClientRpmForm from './ClientRpmForm';

export const dynamic = 'force-dynamic';

export default async function AdminUserPage({ params }: { params: { userId: string } }) {
  const sessionUser = await getSessionUser();
  if (!sessionUser || sessionUser.role !== 'ADMIN') redirect('/');

  const user = await prisma.user.findUnique({
    where: { id: params.userId },
    include: {
      apiKeys: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
        <p>User not found</p>
        <Link href="/admin" className="text-zinc-300 mt-4 underline">Back to Directory</Link>
      </div>
    );
  }

  // Get total calls made by this user's keys
  const apiKeyIds = user.apiKeys.map(k => k.id);
  const totalCalls = await prisma.apiLog.count({
    where: { apiKeyId: { in: apiKeyIds } }
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-zinc-900 pb-6">
        <Link href="/admin" className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors w-fit">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Directory
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-zinc-900 flex items-center justify-center text-xl font-bold text-zinc-400 border border-zinc-800">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-medium tracking-tight text-zinc-100">{user.email}</h1>
              <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                <span>ID: {user.id}</span>
                <span>•</span>
                <span>Joined {format(user.createdAt, 'MMM d, yyyy')}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 text-sm">
            <span className="text-zinc-400">Balance: <span className="text-zinc-100 font-mono">{user.credits.toLocaleString()} cr</span></span>
            <span className="text-zinc-500 text-xs">Role: {user.role}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-black border border-zinc-800 flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-zinc-900 flex items-center justify-center text-zinc-400 border border-zinc-800">
            <Key className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-zinc-500">Configured Keys</div>
            <div className="text-xl font-semibold text-zinc-100">{user.apiKeys.length}</div>
          </div>
        </div>
        <div className="p-4 rounded-lg bg-black border border-zinc-800 flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-zinc-900 flex items-center justify-center text-zinc-400 border border-zinc-800">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-zinc-500">Total API Calls</div>
            <div className="text-xl font-semibold text-zinc-100">{totalCalls.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* API Keys Table */}
      <div className="flex flex-col">
        <h2 className="text-sm font-medium text-zinc-100 mb-4">API Keys & Quotas</h2>
        <div className="bg-black border border-zinc-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-[11px] text-zinc-500 uppercase tracking-wider bg-zinc-900/50 border-b border-zinc-800">
                <tr>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Key Prefix</th>
                  <th className="px-5 py-3 font-medium">Rate Limit (RPM)</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Last Used</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
                {user.apiKeys.map((key) => (
                  <tr key={key.id} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="px-5 py-4 font-medium text-zinc-100">{key.name}</td>
                    <td className="px-5 py-4 text-xs font-mono text-zinc-500">
                      {key.key.substring(0, 12)}...
                    </td>
                    <td className="px-5 py-4">
                      <ClientRpmForm keyId={key.id} initialRpm={key.rpm} />
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${
                        key.status === 'ACTIVE' ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
                      }`}>
                        {key.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-zinc-500">
                      {key.lastUsed ? formatDistanceToNow(key.lastUsed, { addSuffix: true }) : 'Never'}
                    </td>
                  </tr>
                ))}
                {user.apiKeys.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-zinc-500 text-sm">
                      User has no configured API keys.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
