"use client";

import { useState, useTransition } from 'react';
import { updateApiKeyRpm } from './actions';
import { Check, Edit2, Loader2, X } from 'lucide-react';

export default function ClientRpmForm({ keyId, initialRpm }: { keyId: string, initialRpm: number }) {
  const [isEditing, setIsEditing] = useState(false);
  const [rpm, setRpm] = useState(initialRpm.toString());
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    const val = parseInt(rpm, 10);
    if (isNaN(val) || val < 0) return;
    
    startTransition(async () => {
      try {
        await updateApiKeyRpm(keyId, val);
        setIsEditing(false);
      } catch (e) {
        console.error("Failed to update RPM", e);
        setRpm(initialRpm.toString());
      }
    });
  };

  const handleCancel = () => {
    setRpm(initialRpm.toString());
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="flex items-center gap-2 group">
        <span className="font-mono text-xs text-zinc-300 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
          {initialRpm} <span className="text-zinc-500">RPM</span>
        </span>
        <button 
          onClick={() => setIsEditing(true)}
          className="p-1 text-zinc-500 hover:text-zinc-100 opacity-0 group-hover:opacity-100 transition-all"
        >
          <Edit2 className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input 
        type="number"
        value={rpm}
        onChange={(e) => setRpm(e.target.value)}
        className="w-16 bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-100 rounded px-2 py-1 focus:outline-none focus:border-zinc-500"
        min="0"
        disabled={isPending}
      />
      <button 
        onClick={handleSave}
        disabled={isPending}
        className="p-1 text-emerald-500 hover:bg-emerald-950 rounded transition-colors disabled:opacity-50"
      >
        {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
      </button>
      <button 
        onClick={handleCancel}
        disabled={isPending}
        className="p-1 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 rounded transition-colors disabled:opacity-50"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
