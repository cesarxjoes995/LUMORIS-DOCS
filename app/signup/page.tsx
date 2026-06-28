"use client";

import Link from 'next/link';
import { Command, ArrowRight } from 'lucide-react';
import ParticleNetwork from '@/components/ParticleNetwork';
import CodeBackground from '@/components/CodeBackground';
import { useFormState } from 'react-dom';
import { loginUser } from '@/app/login/actions';
import { SubmitButton } from '@/app/login/SubmitButton';

const initialState = { error: null };

export default function SignupPage() {
  const [state, formAction] = useFormState(loginUser, initialState);

  return (
    <div className="min-h-screen flex bg-black selection:bg-zinc-800 font-sans">
      
      {/* Left Panel - Brand / Graphic (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 border-r border-zinc-900 relative overflow-hidden bg-black">
        
        {/* Deep, sophisticated canvas animations running in the background */}
        <CodeBackground />
        <ParticleNetwork />
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity w-fit">
            <img src="/logo.png" alt="Lumoris Labs Logo" className="w-8 h-8 rounded-md object-contain" style={{ filter: 'drop-shadow(0 0 4px rgba(192,38,211,0.6))' }} />
            <span className="font-semibold tracking-tight text-lg">Lumoris Labs</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-semibold tracking-tight text-white mb-6 leading-tight">
            Build the future of AI with powerful APIs.
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed mb-8">
            Access state-of-the-art models for image generation, video synthesis, and speech creation through our ultra-low latency gateway.
          </p>
          <div className="flex items-center gap-4 text-sm font-medium text-zinc-300">
            <div className="flex -space-x-3">
              <div className="w-8 h-8 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center text-[10px]">A</div>
              <div className="w-8 h-8 rounded-full border-2 border-black bg-zinc-700 flex items-center justify-center text-[10px]">B</div>
              <div className="w-8 h-8 rounded-full border-2 border-black bg-zinc-600 flex items-center justify-center text-[10px]">C</div>
            </div>
            <span>Join 10,000+ developers</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 lg:px-24 bg-black relative z-10">
        <div className="w-full max-w-[420px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          <div className="mb-10 text-center lg:text-left">
            <div className="flex justify-center lg:hidden mb-6">
              <img src="/logo.png" alt="Lumoris Labs Logo" className="w-10 h-10 rounded-lg object-contain" style={{ filter: 'drop-shadow(0 0 5px rgba(192,38,211,0.6))' }} />
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-white mb-2">
              Create your account
            </h2>
            <p className="text-sm text-zinc-400">
              Get started with 5,000 free credits today.
            </p>
          </div>

          <div className="space-y-4">
            <button className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-zinc-800 rounded-lg shadow-sm bg-black text-sm font-medium text-zinc-200 hover:bg-zinc-900 transition-all active:scale-[0.98]">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              Sign up with GitHub
            </button>
            <button className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-zinc-800 rounded-lg shadow-sm bg-black text-sm font-medium text-zinc-200 hover:bg-zinc-900 transition-all active:scale-[0.98]">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign up with Google
            </button>
          </div>

          <div className="mt-8 mb-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-900" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-black text-zinc-500 font-medium">Or register with email</span>
              </div>
            </div>
          </div>

          <form action={formAction} className="space-y-5">
            {state?.error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
                {state.error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1.5">
                Work Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="developer@company.com"
                required
                className="appearance-none block w-full px-4 py-3 border border-zinc-800 rounded-lg shadow-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-white focus:border-white sm:text-sm bg-zinc-900/50 text-white transition-colors"
              />
            </div>

            <SubmitButton />
          </form>
          
          <p className="mt-10 text-center lg:text-left text-sm text-zinc-500">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-white hover:underline transition-all">
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
