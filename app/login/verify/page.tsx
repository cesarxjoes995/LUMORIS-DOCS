import Link from 'next/link';
import { Mail, ArrowLeft, ArrowRight } from 'lucide-react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function VerifyRequestPage() {
  const cookieStore = await cookies();
  const verifyEmail = cookieStore.get('verifyEmail')?.value;

  if (!verifyEmail) {
    // If they lost their session, just redirect them back to login
    redirect('/login');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black selection:bg-zinc-800 font-sans p-4">
      <div className="w-full max-w-[420px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 text-center">
        <div className="mb-8 flex justify-center">
          <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center shadow-2xl relative">
            <div className="absolute inset-0 bg-white/5 rounded-2xl animate-pulse" />
            <Mail className="w-8 h-8 text-white relative z-10" />
          </div>
        </div>
        
        <h2 className="text-3xl font-semibold tracking-tight text-white mb-3">
          Check your email
        </h2>
        
        <p className="text-zinc-400 mb-8 leading-relaxed">
          We've sent a 6-digit verification code to <strong>{verifyEmail}</strong>. Please enter it below to sign in.
        </p>

        <form action="/api/auth/callback/resend" method="GET" className="space-y-5 text-left mb-8">
          <input type="hidden" name="callbackUrl" value="/" />
          <input type="hidden" name="email" value={verifyEmail} />
          
          <div>
            <label htmlFor="token" className="block text-sm font-medium text-zinc-300 mb-1.5 text-center">
              Verification Code
            </label>
            <input
              id="token"
              name="token"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="123456"
              required
              className="appearance-none block w-full px-4 py-4 text-center text-2xl tracking-[0.5em] font-mono border border-zinc-800 rounded-lg shadow-sm placeholder-zinc-700 focus:outline-none focus:ring-1 focus:ring-white focus:border-white bg-zinc-900/50 text-white transition-colors uppercase"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg shadow-sm text-sm font-bold text-black bg-white hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white transition-all active:scale-[0.98] mt-2"
          >
            Verify Code
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl mb-8">
          <p className="text-sm text-zinc-500">
            Didn't receive the email? Check your spam folder or try again.
          </p>
        </div>

        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>
      </div>
    </div>
  );
}
