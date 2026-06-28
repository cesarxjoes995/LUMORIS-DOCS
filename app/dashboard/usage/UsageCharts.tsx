"use client";

import { 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  Download,
  Filter,
  Globe,
} from 'lucide-react';

const COLORS = ['#fff', '#a1a1aa', '#52525b', '#27272a', '#18181b', '#09090b'];

export default function UsageCharts({ 
  usageData, 
  latencyData, 
  statusCodeData, 
  pieData, 
  topEndpoints,
  totalCalls
}: {
  usageData: any[];
  latencyData: any[];
  statusCodeData: any[];
  pieData: any[];
  topEndpoints: any[];
  totalCalls: number;
}) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-900 pb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
            Usage Analytics
          </h1>
          <p className="text-zinc-500 mt-1 text-sm">Detailed breakdown of API consumption, latency, and performance.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 text-zinc-300 text-xs font-semibold rounded-md transition-colors hover:text-zinc-100 hover:bg-zinc-800 border border-zinc-800">
            <Filter className="w-3.5 h-3.5" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white text-black text-xs font-semibold rounded-md transition-colors hover:bg-zinc-200">
            <Download className="w-3.5 h-3.5" />
            Export Data
          </button>
        </div>
      </div>

      {/* Main Chart: Volume */}
      <div className="bg-black border border-zinc-900 rounded-lg p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-base font-semibold text-zinc-100 tracking-tight">Request Volume</h3>
            <p className="text-xs text-zinc-500 mt-1">Total API calls processed by category.</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-zinc-100"></div><span className="text-zinc-400">Image</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-zinc-400"></div><span className="text-zinc-400">Video</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-zinc-700"></div><span className="text-zinc-400">Speech</span></div>
          </div>
        </div>

        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={usageData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#18181b" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 11 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 11 }} dx={-10} />
              <Tooltip cursor={{ fill: '#18181b' }} contentStyle={{ backgroundColor: '#000', borderColor: '#27272a', borderRadius: '6px', color: '#fff', fontSize: '12px' }} />
              <Bar dataKey="image" stackId="a" fill="#fff" />
              <Bar dataKey="video" stackId="a" fill="#a1a1aa" />
              <Bar dataKey="speech" stackId="a" fill="#3f3f46" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Analytics Grid Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Latency Chart */}
        <div className="bg-black border border-zinc-900 rounded-lg p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">Latency Percentiles (ms)</h3>
              <p className="text-xs text-zinc-500 mt-1">Global response times over 24h</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-medium">
              <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-zinc-100"></div><span className="text-zinc-400">p99</span></div>
              <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-zinc-500"></div><span className="text-zinc-400">p90</span></div>
              <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-zinc-700"></div><span className="text-zinc-400">p50</span></div>
            </div>
          </div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={latencyData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#18181b" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 10 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#52525b', fontSize: 10 }} dx={-10} />
                <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#27272a', borderRadius: '6px', color: '#fff', fontSize: '11px' }} />
                <Line type="monotone" dataKey="p99" stroke="#fff" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="p90" stroke="#71717a" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="p50" stroke="#3f3f46" strokeWidth={1.5} dot={false} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Codes */}
        <div className="bg-black border border-zinc-900 rounded-lg p-6 flex flex-col">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">Status Codes</h3>
            <p className="text-xs text-zinc-500 mt-1">HTTP responses across all models</p>
          </div>
          
          <div className="flex-1 flex flex-col justify-center space-y-4">
            {statusCodeData.length === 0 ? (
              <div className="text-center text-sm text-zinc-500 py-4">No API calls yet</div>
            ) : statusCodeData.map((status, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: status.color }}></div>
                  <span className="text-sm font-medium text-zinc-300">{status.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-zinc-500">
                    {totalCalls > 0 ? ((status.value / totalCalls) * 100).toFixed(2) : 0}%
                  </span>
                  <span className="text-sm font-mono text-zinc-100 w-16 text-right">
                    {status.value.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Analytics Grid Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Geographic Distribution (Mocked Data for now) */}
        <div className="bg-black border border-zinc-900 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Globe className="w-4 h-4 text-zinc-500" />
            <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">Top Regions</h3>
          </div>
          <div className="space-y-4">
            {[
              { country: 'United States', code: 'US', percent: 45 },
              { country: 'Germany', code: 'DE', percent: 18 },
              { country: 'United Kingdom', code: 'GB', percent: 12 },
              { country: 'India', code: 'IN', percent: 9 },
              { country: 'Japan', code: 'JP', percent: 6 },
            ].map((region, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-300">{region.country}</span>
                  <span className="text-zinc-500">{region.percent}%</span>
                </div>
                <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-zinc-500 rounded-full" style={{ width: `${region.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Model Distribution */}
        <div className="bg-black border border-zinc-900 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-zinc-100 tracking-tight mb-6">Model Distribution</h3>
          <div className="flex flex-col items-center justify-center h-[200px]">
            {pieData.length === 0 ? (
              <div className="text-center text-sm text-zinc-500">No API calls yet</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#000', borderColor: '#27272a', borderRadius: '6px', color: '#fff', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Top Endpoints */}
        <div className="bg-black border border-zinc-900 rounded-lg overflow-hidden flex flex-col">
          <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">Top Endpoints</h3>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="divide-y divide-zinc-900">
              {topEndpoints.length === 0 ? (
                <div className="text-center text-sm text-zinc-500 py-8">No API calls yet</div>
              ) : topEndpoints.map((item, i) => (
                <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-zinc-900/30 transition-colors">
                  <div>
                    <div className="text-xs font-mono text-zinc-300">{item.endpoint}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium text-zinc-100">{item.calls.toLocaleString()}</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">avg {item.ms}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
