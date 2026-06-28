import { Plus } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { CopyButton, RevokeButton } from './ClientButtons';
import { createKey } from './actions';
import { formatDistanceToNow } from 'date-fns';
import { getSessionUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ApiKeysPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  const apiKeys = await prisma.apiKey.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-900 pb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
            API Keys
          </h1>
          <p className="text-zinc-500 mt-1 text-sm">Manage the keys used to authenticate your requests.</p>
        </div>
        
        <form action={createKey}>
          <button type="submit" className="flex items-center gap-2 px-3 py-1.5 bg-white text-black text-xs font-semibold rounded-md transition-colors hover:bg-zinc-200">
            <Plus className="w-3.5 h-3.5" />
            Create new key
          </button>
        </form>
      </div>

      <div className="bg-black border border-zinc-900 rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-[11px] text-zinc-500 uppercase tracking-wider bg-zinc-950 border-b border-zinc-900">
            <tr>
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Secret Key</th>
              <th className="px-5 py-3 font-medium">Created</th>
              <th className="px-5 py-3 font-medium">Last Used</th>
              <th className="px-5 py-3 font-medium text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {apiKeys.map((key) => (
              <tr key={key.id} className="hover:bg-zinc-900/30 transition-colors group">
                <td className="px-5 py-4 font-medium text-zinc-200">{key.name}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <code className="text-xs text-zinc-400 font-mono tracking-wider">{key.key.slice(0, 16)}...</code>
                    <CopyButton text={key.key} />
                  </div>
                </td>
                <td className="px-5 py-4 text-zinc-500 text-xs">
                  {formatDistanceToNow(key.createdAt, { addSuffix: true })}
                </td>
                <td className="px-5 py-4 text-zinc-500 text-xs">
                  {key.lastUsed ? formatDistanceToNow(key.lastUsed, { addSuffix: true }) : 'Never'}
                </td>
                <td className="px-5 py-4 text-right">
                  <RevokeButton id={key.id} />
                </td>
              </tr>
            ))}
            {apiKeys.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">No API keys found. Create one above.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-lg text-sm text-zinc-400">
        <p><strong>Security Note:</strong> Do not share your API keys in publicly accessible areas such as GitHub, client-side code, and so forth.</p>
      </div>
    </div>
  );
}
