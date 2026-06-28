"use client";

import { useState } from 'react';
import { Copy, Check, Trash2 } from 'lucide-react';
import { revokeKey } from './actions';

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={handleCopy} className="text-zinc-500 hover:text-zinc-300 transition-colors">
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

export function RevokeButton({ id }: { id: string }) {
  return (
    <button 
      onClick={() => revokeKey(id)} 
      className="text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 px-2 py-1.5 rounded transition-colors"
      title="Revoke Key"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
