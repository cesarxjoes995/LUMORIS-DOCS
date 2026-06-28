"use client";

import { useState } from 'react';
import { Check, Sparkles, Zap, Shield, Video, Image as ImageIcon, ArrowRight, Minus } from 'lucide-react';

const exchangeRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.12
};

const currencySymbols = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹'
};

export default function PricingPage() {
  const [currency, setCurrency] = useState<keyof typeof exchangeRates>('USD');

  const getPrice = (usdPrice: number) => {
    if (usdPrice === 0) return 0;
    const converted = usdPrice * exchangeRates[currency];
    return currency === 'INR' ? Math.round(converted) : converted.toFixed(2);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-24 pb-24 pt-8 animate-in fade-in duration-1000">
      
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-3xl mx-auto relative">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 blur-[100px] rounded-full pointer-events-none" />
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-zinc-600">
          Scale without limits.
        </h1>
        <p className="text-lg md:text-xl text-zinc-400 font-light tracking-wide max-w-2xl mx-auto">
          Enterprise-grade infrastructure designed for visionaries. 
          <br className="hidden md:block" /> Transparent pricing. Uncompromising performance.
        </p>
        
        {/* Currency Switcher */}
        <div className="pt-10 flex justify-center relative z-10">
          <div className="inline-flex items-center p-1 bg-black/50 backdrop-blur-md border border-zinc-800/80 rounded-full shadow-2xl">
            {(Object.keys(exchangeRates) as Array<keyof typeof exchangeRates>).map((cur) => (
              <button
                key={cur}
                onClick={() => setCurrency(cur)}
                className={`px-6 py-2 rounded-full text-xs font-semibold tracking-widest transition-all duration-500 ${
                  currency === cur 
                    ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {cur}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end relative z-10">
        
        {/* Free Plan */}
        <div className="group relative flex flex-col p-10 bg-black border border-zinc-800/80 hover:border-zinc-600 transition-all duration-700 h-[500px]">
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <h3 className="text-2xl font-light text-zinc-300 tracking-wide">Developer</h3>
          <div className="my-8">
            <span className="text-5xl font-light text-white tracking-tighter">{currencySymbols[currency]}0</span>
          </div>
          
          <p className="text-sm text-zinc-500 font-light mb-8 h-10">
            For individuals exploring the capabilities of our AI infrastructure.
          </p>

          <button className="w-full py-4 mb-10 bg-transparent border border-zinc-700 hover:border-white text-zinc-300 hover:text-white text-sm font-medium tracking-wide transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
            Current Plan
          </button>

          <div className="space-y-5 flex-1 text-sm font-light text-zinc-400">
            <div className="flex items-center gap-4">
              <Check className="w-4 h-4 text-white" />
              <span>10 credits per day</span>
            </div>
            <div className="flex items-center gap-4">
              <Check className="w-4 h-4 text-white" />
              <span>1 Request Per Minute (RPM)</span>
            </div>
            <div className="flex items-center gap-4">
              <Check className="w-4 h-4 text-white" />
              <span>Limited Image Models (Flux Dev)</span>
            </div>
          </div>
        </div>

        {/* Pro Plan (Highlighted) */}
        <div className="group relative flex flex-col p-10 bg-black border border-zinc-500 shadow-[0_0_50px_rgba(255,255,255,0.05)] transition-all duration-700 h-[540px] transform lg:-translate-y-4">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
          
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)]">
            Professional
          </div>

          <h3 className="text-2xl font-light text-white tracking-wide flex items-center gap-3">
            Creator <Sparkles className="w-4 h-4 text-zinc-400" />
          </h3>
          <div className="my-8">
            <span className="text-6xl font-light text-white tracking-tighter">{currencySymbols[currency]}{getPrice(15)}</span>
            <span className="text-zinc-500 ml-2 font-light tracking-wide">/mo</span>
          </div>
          
          <p className="text-sm text-zinc-400 font-light mb-8 h-10">
            For serious creators requiring high-volume throughput and premium models.
          </p>

          <button className="w-full py-4 mb-10 bg-white text-black text-sm font-semibold tracking-wide transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-[1.02]">
            Upgrade to Creator
          </button>

          <div className="space-y-5 flex-1 text-sm font-light text-zinc-300">
            <div className="flex items-center gap-4">
              <Zap className="w-4 h-4 text-white fill-white" />
              <span className="text-white font-medium">10,000 credits per month</span>
            </div>
            <div className="flex items-center gap-4">
              <Check className="w-4 h-4 text-white" />
              <span>5 Requests Per Minute</span>
            </div>
            <div className="flex items-center gap-4">
              <Check className="w-4 h-4 text-white" />
              <span>All Image Models (Flux1.1 Pro)</span>
            </div>
          </div>
        </div>

        {/* Ultra Plan */}
        <div className="group relative flex flex-col p-10 bg-black border border-zinc-800/80 hover:border-zinc-600 transition-all duration-700 h-[500px]">
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <h3 className="text-2xl font-light text-zinc-300 tracking-wide">Enterprise</h3>
          <div className="my-8">
            <span className="text-5xl font-light text-white tracking-tighter">{currencySymbols[currency]}{getPrice(40)}</span>
            <span className="text-zinc-500 ml-2 font-light tracking-wide">/mo</span>
          </div>
          
          <p className="text-sm text-zinc-500 font-light mb-8 h-10">
            Maximum power, ultimate flexibility, and dedicated architecture support.
          </p>

          <button className="w-full py-4 mb-10 bg-zinc-900 border border-zinc-800 hover:border-zinc-500 text-white text-sm font-medium tracking-wide transition-all duration-500 hover:bg-zinc-800">
            Upgrade to Enterprise
          </button>

          <div className="space-y-5 flex-1 text-sm font-light text-zinc-400">
            <div className="flex items-center gap-4">
              <Check className="w-4 h-4 text-white" />
              <span className="text-zinc-200">30,000 credits per month</span>
            </div>
            <div className="flex items-center gap-4">
              <Check className="w-4 h-4 text-white" />
              <span>10 Requests Per Minute</span>
            </div>
            <div className="flex items-center gap-4">
              <Check className="w-4 h-4 text-white" />
              <span>All Image & Video Models</span>
            </div>
            <div className="flex items-center gap-4">
              <Check className="w-4 h-4 text-white" />
              <span>Dedicated Customer Support</span>
            </div>
          </div>
        </div>

      </div>

      {/* Feature Comparison Table */}
      <div className="mt-32 border-t border-zinc-900 pt-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-light tracking-tight text-white mb-4">Compare Features</h2>
          <p className="text-zinc-500 font-light">An in-depth look at what is included in each tier.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-zinc-900">
                <th className="py-6 px-6 font-medium text-zinc-400 text-sm tracking-wide">Features</th>
                <th className="py-6 px-6 font-medium text-white text-sm tracking-wide w-1/4">Developer</th>
                <th className="py-6 px-6 font-medium text-white text-sm tracking-wide w-1/4">Creator</th>
                <th className="py-6 px-6 font-medium text-white text-sm tracking-wide w-1/4">Enterprise</th>
              </tr>
            </thead>
            <tbody className="text-sm font-light text-zinc-400 divide-y divide-zinc-900/50">
              
              <tr className="hover:bg-zinc-900/20 transition-colors">
                <td className="py-5 px-6 font-medium text-zinc-300">Monthly Credits</td>
                <td className="py-5 px-6">300 (10/day)</td>
                <td className="py-5 px-6 text-white font-medium">10,000</td>
                <td className="py-5 px-6 text-white font-medium">30,000</td>
              </tr>
              
              <tr className="hover:bg-zinc-900/20 transition-colors">
                <td className="py-5 px-6 font-medium text-zinc-300">Rate Limits</td>
                <td className="py-5 px-6">1 Request / Min</td>
                <td className="py-5 px-6 text-white">5 Requests / Min</td>
                <td className="py-5 px-6 text-white">10 Requests / Min</td>
              </tr>
              
              <tr className="hover:bg-zinc-900/20 transition-colors">
                <td className="py-5 px-6 font-medium text-zinc-300">Image Models (Flux Dev)</td>
                <td className="py-5 px-6"><Check className="w-4 h-4 text-white" /></td>
                <td className="py-5 px-6"><Check className="w-4 h-4 text-white" /></td>
                <td className="py-5 px-6"><Check className="w-4 h-4 text-white" /></td>
              </tr>
              
              <tr className="hover:bg-zinc-900/20 transition-colors">
                <td className="py-5 px-6 font-medium text-zinc-300">Premium Image Models (Pro)</td>
                <td className="py-5 px-6"><Minus className="w-4 h-4 text-zinc-700" /></td>
                <td className="py-5 px-6"><Check className="w-4 h-4 text-white" /></td>
                <td className="py-5 px-6"><Check className="w-4 h-4 text-white" /></td>
              </tr>
              
              <tr className="hover:bg-zinc-900/20 transition-colors">
                <td className="py-5 px-6 font-medium text-zinc-300">Video Generation</td>
                <td className="py-5 px-6"><Minus className="w-4 h-4 text-zinc-700" /></td>
                <td className="py-5 px-6"><Minus className="w-4 h-4 text-zinc-700" /></td>
                <td className="py-5 px-6"><Check className="w-4 h-4 text-white" /></td>
              </tr>
              
              <tr className="hover:bg-zinc-900/20 transition-colors">
                <td className="py-5 px-6 font-medium text-zinc-300">Support</td>
                <td className="py-5 px-6">Community</td>
                <td className="py-5 px-6">Standard</td>
                <td className="py-5 px-6 text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-zinc-400" /> Dedicated
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
