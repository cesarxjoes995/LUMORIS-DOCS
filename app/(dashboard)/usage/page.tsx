import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import UsageCharts from './UsageCharts';

export default async function UsagePage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  // 1. Fetch all API keys for this user
  const apiKeys = await prisma.apiKey.findMany({
    where: { userId: session.user.id }
  });
  
  const apiKeyIds = apiKeys.map(k => k.id);

  // 2. Fetch all logs for these API keys from the last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const logs = await prisma.apiLog.findMany({
    where: { 
      apiKeyId: { in: apiKeyIds },
      createdAt: { gte: sevenDaysAgo }
    },
    orderBy: { createdAt: 'asc' }
  });

  // --- Calculate Request Volume (usageData) ---
  // Group by date (MMM DD) and categorize by endpoint type (image, video, speech)
  const usageMap = new Map();
  
  // Pre-fill last 7 days so charts always show 7 bars even if empty
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    usageMap.set(dateStr, { date: dateStr, image: 0, video: 0, speech: 0 });
  }

  logs.forEach(log => {
    const dateStr = log.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!usageMap.has(dateStr)) {
      usageMap.set(dateStr, { date: dateStr, image: 0, video: 0, speech: 0 });
    }
    const data = usageMap.get(dateStr);
    
    // Categorize based on endpoint
    if (log.endpoint.includes('/video')) {
      data.video += 1;
    } else if (log.endpoint.includes('/speech') || log.endpoint.includes('/audio')) {
      data.speech += 1;
    } else {
      // Default to image
      data.image += 1;
    }
  });

  const usageData = Array.from(usageMap.values());

  // --- Calculate Status Codes ---
  let count200 = 0;
  let count400 = 0;
  let count429 = 0;
  let count500 = 0;

  logs.forEach(log => {
    if (log.status >= 200 && log.status < 300) count200++;
    else if (log.status === 429) count429++;
    else if (log.status >= 400 && log.status < 500) count400++;
    else count500++;
  });

  const statusCodeData = [
    { name: '200 OK', value: count200, color: '#fff' },
    { name: '400 Bad Request', value: count400, color: '#71717a' },
    { name: '429 Rate Limit', value: count429, color: '#52525b' },
    { name: '500 Error', value: count500, color: '#ef4444' },
  ].filter(d => d.value > 0);

  // --- Calculate Model Distribution (PieChart) ---
  const modelCount = new Map();
  logs.forEach(log => {
    // Extract model from endpoint, e.g. /api/image-generation/flux1-1-pro -> flux1-1-pro
    const parts = log.endpoint.split('/');
    const model = parts[parts.length - 1] || 'unknown';
    modelCount.set(model, (modelCount.get(model) || 0) + 1);
  });
  
  // Sort and take top 4
  const pieData = Array.from(modelCount.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);

  // --- Calculate Top Endpoints ---
  const endpointStats = new Map();
  logs.forEach(log => {
    if (!endpointStats.has(log.endpoint)) {
      endpointStats.set(log.endpoint, { endpoint: log.endpoint, calls: 0, totalLatency: 0 });
    }
    const stats = endpointStats.get(log.endpoint);
    stats.calls += 1;
    stats.totalLatency += log.latency;
  });

  const topEndpoints = Array.from(endpointStats.values())
    .map(stat => ({
      endpoint: stat.endpoint,
      calls: stat.calls,
      ms: stat.calls > 0 ? (stat.totalLatency / stat.calls / 1000).toFixed(1) + 's' : '0s'
    }))
    .sort((a, b) => b.calls - a.calls)
    .slice(0, 5);

  // --- Calculate Latency Percentiles over 24h ---
  // For simplicity, we bucket the last 24h into 4-hour intervals
  const latencyData = [];
  const now = Date.now();
  for (let i = 0; i < 24; i += 4) {
    const timeStr = `${i.toString().padStart(2, '0')}:00`;
    
    // Filter logs for this time block (rough approximation by hour)
    const blockLogs = logs.filter(log => {
      const hours = log.createdAt.getHours();
      return hours >= i && hours < i + 4;
    });

    const latencies = blockLogs.map(l => l.latency).sort((a, b) => a - b);
    
    if (latencies.length > 0) {
      const p50 = latencies[Math.floor(latencies.length * 0.5)];
      const p90 = latencies[Math.floor(latencies.length * 0.9)];
      const p99 = latencies[Math.floor(latencies.length * 0.99)];
      latencyData.push({ time: timeStr, p50, p90, p99 });
    } else {
      latencyData.push({ time: timeStr, p50: 0, p90: 0, p99: 0 });
    }
  }

  return (
    <UsageCharts 
      usageData={usageData}
      latencyData={latencyData}
      statusCodeData={statusCodeData}
      pieData={pieData}
      topEndpoints={topEndpoints}
      totalCalls={logs.length}
    />
  );
}
