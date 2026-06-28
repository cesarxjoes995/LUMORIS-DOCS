"use client";

import { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Check,
  Copy,
  Plus,
  Database,
  Activity,
  Server,
  Filter
} from 'lucide-react';
import Link from 'next/link';

interface DashboardClientProps {
  areaData: any[];
  barData: any[];
  recentLogs: any[];
  credits: number;
  apiKey: string | null;
  lastUsedTime: string;
}

export default function DashboardClient({ areaData, barData, recentLogs, credits, apiKey, lastUsedTime }: DashboardClientProps) {
  const [copied, setCopied] = useState(false);
  const [keyRevealed, setKeyRevealed] = useState(false);

  const copyKey = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const maxCredits = credits > 100 ? 5000 : 10;
  const usedCredits = Math.max(0, maxCredits - credits);
  const percentUsed = Math.min(100, Math.max(0, Math.round((usedCredits / maxCredits) * 100)));

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="border-b border-zinc-900 pb-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
              Dashboard
            </h1>
            <p className="text-zinc-500 mt-1 text-sm">Manage your API keys, monitor usage, and view logs.</p>
          </div>
          <Link href="/dashboard/keys" className="flex items-center justify-center gap-2 px-3 py-1.5 bg-white text-black text-xs font-semibold rounded-md transition-colors hover:bg-zinc-200">
            <Plus className="w-3.5 h-3.5" />
            Manage Keys
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Main Chart Column */}
        <div className="md:col-span-3 space-y-6">
          
          <div className="bg-black border border-zinc-900 rounded-lg p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-base font-semibold text-zinc-100 tracking-tight">API Requests</h3>
                <p className="text-xs text-zinc-500 mt-1">Total volume across all endpoints (Last 30 Days)</p>
              </div>
            </div>

            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fff" stopOpacity={0.1}/>
                      <stop offset="100%" stopColor="#fff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#18181b" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 11 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 11 }} tickFormatter={(value) => `${value}`} dx={-10} />
                  <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#27272a', borderRadius: '6px', color: '#fff', fontSize: '12px' }} itemStyle={{ color: '#fff' }} />
                  <Area type="monotone" dataKey="calls" stroke="#fff" strokeWidth={1.5} fillOpacity={1} fill="url(#colorCalls)" activeDot={{ r: 4, fill: "#000", stroke: "#fff", strokeWidth: 1.5 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom row in left column */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-black border border-zinc-900 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">Usage by Model</h3>
              </div>
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 11 }} />
                    <Tooltip cursor={{ fill: '#18181b' }} contentStyle={{ backgroundColor: '#000', borderColor: '#27272a', borderRadius: '6px', color: '#fff', fontSize: '12px' }} />
                    <Bar dataKey="usage" fill="#3f3f46" radius={[0, 4, 4, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Actions / Keys */}
            <div className="bg-black border border-zinc-900 rounded-lg p-6 flex flex-col">
              <h3 className="text-sm font-semibold text-zinc-100 tracking-tight mb-1">Primary Key</h3>
              <p className="text-xs text-zinc-500 mb-6">{lastUsedTime}</p>
              
              <div className="flex-1">
                {apiKey ? (
                  <div className="flex items-center justify-between p-2 bg-zinc-950 border border-zinc-800 rounded-md">
                    <code className="text-xs text-zinc-300 font-mono tracking-wider ml-2 select-all">
                      {keyRevealed ? apiKey : `${apiKey.substring(0, 10)}****************`}
                    </code>
                    <button onClick={copyKey} className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded transition-colors" title="Copy API Key">
                      {copied ? <Check className="w-3.5 h-3.5 text-zinc-100" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ) : (
                  <div className="text-xs text-zinc-500 p-4 border border-dashed border-zinc-800 rounded-md text-center">
                    No active API keys found.
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => setKeyRevealed(!keyRevealed)}
                disabled={!apiKey}
                className="w-full py-2 mt-auto bg-zinc-900 text-zinc-100 font-medium rounded-md text-xs transition-colors hover:bg-zinc-800 border border-zinc-800 disabled:opacity-50"
              >
                {keyRevealed ? 'Hide Key' : 'Reveal Key'}
              </button>
            </div>

          </div>

        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-6">
          
          <div className="bg-black border border-zinc-900 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-zinc-100 tracking-tight mb-4">Credits Remaining</h3>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-3xl font-semibold text-zinc-100 tracking-tight">{credits > 1000000 ? '∞' : credits.toLocaleString()}</span>
              {credits <= 1000000 && <span className="text-lg font-medium text-zinc-600">cr</span>}
            </div>
            
            {credits <= 1000000 && (
              <>
                <div className="w-full bg-zinc-900 rounded-full h-1.5 mt-4 mb-2 overflow-hidden">
                  <div className="bg-zinc-100 h-full rounded-full" style={{ width: `${percentUsed}%` }}></div>
                </div>
                <div className="flex justify-between text-[11px] text-zinc-500">
                  <span>{percentUsed}% of base {maxCredits.toLocaleString()} used</span>
                </div>
              </>
            )}
            
            <Link href="/dashboard/billing" className="block text-center w-full py-2 mt-6 bg-zinc-100 text-black font-medium rounded-md text-xs transition-colors hover:bg-white">
              Manage Billing
            </Link>
          </div>

          <div className="bg-black border border-zinc-900 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-zinc-100 tracking-tight mb-4">System Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-xs font-medium text-zinc-400">API Gateway</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-zinc-300">Operational</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-xs font-medium text-zinc-400">Image Models</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-zinc-300">Healthy</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-xs font-medium text-zinc-400">Video Models</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-zinc-300">Healthy</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Logs Table */}
      <div className="bg-black border border-zinc-900 rounded-lg flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-zinc-900">
          <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">Recent Logs</h3>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-zinc-400 hover:text-zinc-100 bg-zinc-900/50 rounded border border-zinc-800 transition-colors">
              <Filter className="w-3 h-3" />
              Filter
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] text-zinc-500 uppercase tracking-wider bg-zinc-950">
              <tr>
                <th className="px-5 py-3 font-medium">Request ID</th>
                <th className="px-5 py-3 font-medium">Endpoint</th>
                <th className="px-5 py-3 font-medium">Model</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Latency</th>
                <th className="px-5 py-3 font-medium text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {recentLogs.map((log, i) => (
                <tr key={i} className="hover:bg-zinc-900/30 transition-colors group">
                  <td className="px-5 py-3 font-mono text-xs text-zinc-400">{log.id}</td>
                  <td className="px-5 py-3 font-mono text-xs text-zinc-500">{log.endpoint}</td>
                  <td className="px-5 py-3 text-zinc-300 text-xs font-medium">{log.model}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${log.status === 200 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <span className="text-zinc-400 text-xs font-mono">{log.status}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-zinc-500 text-xs font-mono">{log.latency}</td>
                  <td className="px-5 py-3 text-zinc-500 text-right text-xs">{log.time}</td>
                </tr>
              ))}
              {recentLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-zinc-500 text-sm">
                    No API requests made yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
