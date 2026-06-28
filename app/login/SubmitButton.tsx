"use client";

import { useFormStatus } from 'react-dom';
import { ArrowRight, Loader2 } from 'lucide-react';

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg shadow-sm text-sm font-bold text-black bg-white hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white transition-all active:scale-[0.98] mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          Sending link...
          <Loader2 className="w-4 h-4 animate-spin" />
        </>
      ) : (
        <>
          Send verification link
          <ArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  );
}
