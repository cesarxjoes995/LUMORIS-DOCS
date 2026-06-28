"use client";

import { 
  CreditCard,
  Download,
  ExternalLink,
  Check,
  Zap
} from 'lucide-react';

const invoices = [
  { id: 'INV-2026-06', date: 'Jun 1, 2026', amount: '$142.50', status: 'Paid' },
  { id: 'INV-2026-05', date: 'May 1, 2026', amount: '$98.20', status: 'Paid' },
  { id: 'INV-2026-04', date: 'Apr 1, 2026', amount: '$110.00', status: 'Paid' },
];

export default function BillingPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-900 pb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
            Billing & Usage
          </h1>
          <p className="text-zinc-500 mt-1 text-sm">Manage your subscription, payment methods, and invoices.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Current Plan */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-black border border-zinc-900 rounded-lg p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold text-zinc-100 tracking-tight">Pro Tier</h3>
                <p className="text-xs text-zinc-500 mt-1">For teams building production applications.</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-semibold text-zinc-100">$29</div>
                <div className="text-xs text-zinc-500">per month</div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-zinc-400" />
                <span className="text-sm text-zinc-300">100,000 monthly API calls included</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-zinc-400" />
                <span className="text-sm text-zinc-300">Priority support & SLAs</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-zinc-400" />
                <span className="text-sm text-zinc-300">Access to Flux1.1 Pro & Seedance models</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-md transition-colors hover:bg-zinc-200">
                Manage Subscription
              </button>
              <button className="px-4 py-2 bg-zinc-900 text-zinc-100 text-sm font-medium rounded-md transition-colors hover:bg-zinc-800 border border-zinc-800">
                Cancel Plan
              </button>
            </div>
          </div>

          <div className="bg-black border border-zinc-900 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-zinc-900">
              <h3 className="text-base font-semibold text-zinc-100 tracking-tight">Invoices</h3>
            </div>
            <table className="w-full text-sm text-left">
              <thead className="text-[11px] text-zinc-500 uppercase tracking-wider bg-zinc-950">
                <tr>
                  <th className="px-6 py-3 font-medium">Invoice ID</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-zinc-300">{inv.id}</td>
                    <td className="px-6 py-4 text-zinc-500">{inv.date}</td>
                    <td className="px-6 py-4 text-zinc-300">{inv.amount}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-800 text-zinc-300">
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-zinc-400 hover:text-zinc-100 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-6">
          <div className="bg-black border border-zinc-900 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-zinc-100 tracking-tight mb-4">Payment Method</h3>
            
            <div className="flex items-center gap-4 p-4 border border-zinc-800 rounded-md bg-zinc-900/50 mb-4">
              <div className="w-10 h-6 bg-zinc-800 rounded flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-zinc-200">Visa ending in 4242</div>
                <div className="text-xs text-zinc-500">Expires 12/28</div>
              </div>
            </div>

            <button className="w-full py-2 bg-zinc-900 text-zinc-100 font-medium rounded-md text-xs transition-colors hover:bg-zinc-800 border border-zinc-800">
              Update Payment Method
            </button>
          </div>

          <div className="bg-black border border-zinc-900 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-zinc-100 tracking-tight mb-4">Credits Consumed</h3>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-3xl font-semibold text-zinc-100 tracking-tight">14,250</span>
              <span className="text-lg font-medium text-zinc-600">cr</span>
            </div>
            <p className="text-xs text-zinc-500 mt-1 mb-4">Credits burned in Jun 2026</p>
            
            <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
              <div className="bg-zinc-100 h-full rounded-full" style={{ width: '68%' }}></div>
            </div>
            <div className="flex justify-between text-[11px] text-zinc-500 mt-2">
              <span>68% of limit (21,000 cr)</span>
            </div>
          </div>

          <div className="bg-black border border-zinc-900 rounded-lg overflow-hidden flex flex-col relative group">
            {/* Subtle top glow */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
            
            <div className="p-6 pb-4">
              <h3 className="text-sm font-semibold text-zinc-100 tracking-tight flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" /> Need more credits?
              </h3>
              <p className="text-xs text-zinc-400 mt-2">
                Running low on your monthly allowance? Purchase a one-time top-up pack to keep generating instantly.
              </p>
            </div>
            
            <div className="p-4 space-y-3 bg-zinc-950/50">
              <button className="w-full flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800 hover:border-zinc-700 transition-all group/btn">
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-zinc-200">5,000 Credits</span>
                  <span className="text-xs text-zinc-500">Starter Pack</span>
                </div>
                <div className="text-sm font-bold text-white bg-zinc-800 px-2.5 py-1 rounded shadow-sm group-hover/btn:bg-zinc-700 transition-colors">$10</div>
              </button>
              
              <button className="w-full flex items-center justify-between p-3 rounded-lg border border-amber-900/30 bg-amber-950/10 hover:bg-amber-900/20 hover:border-amber-700/50 transition-all group/btn">
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-amber-100">15,000 Credits</span>
                  <span className="text-xs text-amber-500/80">Pro Pack</span>
                </div>
                <div className="text-sm font-bold text-amber-50 bg-amber-900/40 border border-amber-800/50 px-2.5 py-1 rounded shadow-sm group-hover/btn:bg-amber-700/50 transition-colors">$25</div>
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
