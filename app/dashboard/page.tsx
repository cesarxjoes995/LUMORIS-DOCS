import { getSessionUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import DashboardClient from './DashboardClient';
import { formatDistanceToNow, format } from 'date-fns';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  // Fetch user data including API keys
  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      apiKeys: {
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    }
  });

  if (!userData) redirect('/login');

  const apiKey = userData.apiKeys[0]?.key || null;
  const lastUsedDate = userData.apiKeys[0]?.lastUsed;
  const lastUsedTime = lastUsedDate ? `Last used ${formatDistanceToNow(new Date(lastUsedDate), { addSuffix: true })}` : 'Never used';

  // Fetch all logs for the user's keys
  const logs = await prisma.apiLog.findMany({
    where: {
      apiKey: {
        userId: user.id
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Recent logs for table (Top 5)
  const recentLogs = logs.slice(0, 5).map(log => {
    const parts = log.endpoint.split('/');
    let modelName = log.endpoint;
    
    if (log.endpoint.includes('/api/jobs/')) {
      modelName = 'Job Polling';
    } else if (parts.length >= 4) {
      modelName = parts[parts.length - 1]; // Just take the last part
    }
    
    return {
      id: log.id.substring(0, 8),
      model: modelName,
      endpoint: log.endpoint,
      status: log.status,
      time: formatDistanceToNow(new Date(log.createdAt), { addSuffix: true }),
      latency: `${(log.latency / 1000).toFixed(1)}s`
    };
  });

  // Calculate Area Data (Requests per day for last 30 days)
  const areaDataMap = new Map<string, number>();
  const today = new Date();
  // Initialize last 30 days with 0
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    areaDataMap.set(format(d, 'MMM dd'), 0);
  }

  logs.forEach(log => {
    const dateStr = format(new Date(log.createdAt), 'MMM dd');
    if (areaDataMap.has(dateStr)) {
      areaDataMap.set(dateStr, (areaDataMap.get(dateStr) || 0) + 1);
    }
  });

  const areaData = Array.from(areaDataMap.entries()).map(([date, calls]) => ({
    date,
    calls
  }));

  // Calculate Bar Data (Usage by Model)
  const barDataMap = new Map<string, number>();
  logs.forEach(log => {
    if (log.endpoint.includes('/api/jobs/')) return; // Don't count polling as model usage
    
    const parts = log.endpoint.split('/');
    let modelName = log.endpoint;
    if (parts.length >= 4) {
      modelName = parts[parts.length - 1];
    }
    barDataMap.set(modelName, (barDataMap.get(modelName) || 0) + 1);
  });

  const barData = Array.from(barDataMap.entries())
    .map(([name, usage]) => ({ name, usage }))
    .sort((a, b) => b.usage - a.usage)
    .slice(0, 5); // Top 5 models

  return (
    <DashboardClient 
      areaData={areaData}
      barData={barData}
      recentLogs={recentLogs}
      credits={userData.credits}
      apiKey={apiKey}
      lastUsedTime={lastUsedTime}
    />
  );
}
