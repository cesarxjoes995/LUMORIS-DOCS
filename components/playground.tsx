"use client";

import { useState, useEffect, useRef } from 'react';
import { 
  Loader2, Play, Image as ImageIcon, Video, Mic, CheckCircle2, XCircle, Terminal, 
  Settings2
} from 'lucide-react';

const CATEGORIES = [
  { id: 'image-generation', label: 'Image Generation', icon: ImageIcon },
  { id: 'video-generation', label: 'Video Generation', icon: Video },
  { id: 'image-editing', label: 'Image Editing', icon: ImageIcon },
  { id: 'speech-generation', label: 'Speech Generation', icon: Mic },
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const MODELS = {
  'image-generation': [
    { id: 'flux1-1-pro-ultra-raw', name: 'FLUX1.1 [pro] Ultra Raw' },
    { id: 'flux1-1-pro-ultra', name: 'FLUX1.1 [pro] Ultra' },
    { id: 'flux1-kontext-pro', name: 'FLUX.1 Kontext [pro]' },
    { id: 'flux-kontext-max', name: 'FLUX Kontext Max' },
    { id: 'flux1-1-pro', name: 'FLUX1.1 Pro' },
    { id: 'flux2-pro', name: 'FLUX.2 Pro' },
    { id: 'gpt-image-1', name: 'GPT Image 1' },
    { id: 'gpt-image-1-5', name: 'GPT Image 1.5' },
    { id: 'gpt-image-2', name: 'GPT Image 2' },
    { id: 'nano-banana', name: 'Nano Banana' },
    { id: 'nano-banana-2', name: 'Nano Banana 2' },
    { id: 'nano-banana-pro', name: 'Nano Banana Pro' },
    { id: 'runway-gen4', name: 'Runway Gen-4' },
  ],
  'video-generation': [
    { id: 'ray-3-14', name: 'Luma Ray 3.14' },
    { id: 'veo-3-1-fast', name: 'Veo 3.1 Fast' },
    { id: 'runway-gen4-5-video', name: 'Runway Gen-4.5 Video' },
    { id: 'kling-3-0', name: 'Kling 3.0' },
    { id: 'kling-3-0-omni', name: 'Kling 3.0 Omni' },
    { id: 'seedance-2-0', name: 'Seedance 2.0' },
    { id: 'seedance-2-0-fast', name: 'Seedance 2.0 Fast' },
  ],
  'image-editing': [
    { id: 'flux1-1-pro-ultra-edit', name: 'FLUX1.1 Ultra Edit' },
  ],
  'speech-generation': [
    { id: 'elevenlabs-multilingual-v2', name: 'ElevenLabs Multilingual' },
  ]
};

// Aspect ratio mapping based on model support
const getSupportedAspectRatios = (category: string, model: string) => {
  if (category === 'video-generation') {
    if (model.startsWith('kling')) {
      return ['16:9', '9:16'];
    }
    if (model.startsWith('seedance')) {
      return ['21:9', '16:9', '4:3', '1:1', '3:4', '9:16'];
    }
    return ['21:9', '16:9', '4:3', '1:1', '3:4', '9:16', '9:21'];
  }
  if (model.startsWith('nano-banana')) {
    return ['8:1', '4:1', '21:9', '16:9', '5:4', '4:3', '3:2', '1:1', '4:5', '3:4', '2:3', '9:16', '1:4', '1:8'];
  }
  if (model.startsWith('gpt-image')) {
    return ['3:2', '1:1', '2:3'];
  }
  // Default (FLUX & Runway)
  return ['16:9', '4:3', '1:1', '3:4', '9:16'];
};

export function Playground() {
  const [category, setCategory] = useState('image-generation');
  const [model, setModel] = useState(MODELS['image-generation'][0].id);
  
  const [prompt, setPrompt] = useState('A beautiful futuristic city at sunset, neon lights, highly detailed, 4k');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [duration, setDuration] = useState(5);
  const [apiKey, setApiKey] = useState('');
  
  const [status, setStatus] = useState('idle'); // idle, generating, polling, success, error
  const [jobId, setJobId] = useState('');
  const [result, setResult] = useState<any>(null);
  const [logs, setLogs] = useState<{time: string, msg: string, type: 'info'|'success'|'error'}[]>([]);
  const [postResponse, setPostResponse] = useState<any>(null);
  const [finalResponse, setFinalResponse] = useState<any>(null);

  const logsContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs locally without scrolling the whole page
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Update model when category changes
  useEffect(() => {
    setModel(MODELS[category as keyof typeof MODELS][0].id);
  }, [category]);

  // Validate aspect ratio on model change
  useEffect(() => {
    const supported = getSupportedAspectRatios(category, model);
    if (!supported.includes(aspectRatio)) {
      setAspectRatio(supported.includes('1:1') ? '1:1' : supported[0]);
    }
  }, [model, category, aspectRatio]);

  const addLog = (msg: string, type: 'info'|'success'|'error' = 'info') => {
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg, type }]);
  };

  const handleGenerate = async () => {
    if (!apiKey.trim()) {
      addLog('API Key is required', 'error');
      setStatus('error');
      return;
    }
    if (!prompt.trim()) {
      addLog('Prompt is required', 'error');
      setStatus('error');
      return;
    }

    setStatus('generating');
    setResult(null);
    setPostResponse(null);
    setFinalResponse(null);
    setLogs([]);
    setJobId('');

    addLog(`Initiating request to ${model}...`);

    try {
      const payload: any = { prompt, aspectRatio };
      if (category === 'video-generation') {
        payload.duration = duration;
      }

      const res = await fetch(`${API_BASE_URL}/api/${category}/${model}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.trim()}`
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      setPostResponse(data);
      
      if (!res.ok) throw new Error(data.error || 'Failed to submit job');
      
      setJobId(data.jobId);
      addLog(`Job submitted successfully! Received Job ID: ${data.jobId}`, 'success');
      setStatus('polling');
    } catch (err: any) {
      addLog(err.message, 'error');
      setStatus('error');
    }
  };

  useEffect(() => {
    let interval: any;
    let pollCount = 0;
    
    if (status === 'polling' && jobId) {
      addLog('Starting to poll for job completion...');
      
      interval = setInterval(async () => {
        pollCount++;
        try {
          addLog(`Polling status... (${pollCount * 5}s elapsed)`);
          const res = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`, {
            headers: {
              'Authorization': `Bearer ${apiKey.trim()}`
            }
          });
          const data = await res.json();
          
          if (data.status === 'completed') {
            setStatus('success');
            setResult(data);
            setFinalResponse(data);
            addLog(`Job completed! Rendering output...`, 'success');
            clearInterval(interval);
          } else if (data.status === 'failed') {
            setStatus('error');
            setFinalResponse(data);
            addLog(`Job failed: ${data.error || 'Internal error'}`, 'error');
            clearInterval(interval);
          }
        } catch (err: any) {
          addLog(`Polling error: ${err.message}`, 'error');
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [status, jobId]);

  const supportedRatios = getSupportedAspectRatios(category, model);

  return (
    <div className="flex flex-col xl:flex-row gap-0 w-full mt-6 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl relative">
      
      {/* LEFT PANEL - Controls */}
      <div className="w-full xl:w-[350px] shrink-0 p-6 flex flex-col gap-6 border-b xl:border-b-0 xl:border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 xl:sticky top-16 xl:max-h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar">
        
        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">Capabilities</label>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-all ${
                  category === cat.id 
                  ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                  : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-300'
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Model Selection */}
        <div>
          <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">Select Model</label>
          <select 
            value={model} 
            onChange={(e) => setModel(e.target.value)}
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
          >
            {MODELS[category as keyof typeof MODELS].map((m: any) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        {/* Dynamic Inputs */}
        <div>
          <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">API Key</label>
          <input 
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-indigo-500 transition-colors"
            placeholder="sk-live-lumoris-..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">Prompt</label>
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="w-full bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-200 focus:outline-none focus:border-indigo-500 transition-colors resize-none custom-scrollbar"
            placeholder="Describe what you want to generate..."
          />
        </div>

        {/* Configuration Row */}
        {(category === 'image-generation' || category === 'video-generation') && (
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 bg-zinc-50/50 dark:bg-black/50">
            <div className="flex items-center gap-2 mb-4">
              <Settings2 className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
              <h4 className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Configuration</h4>
            </div>
            
            <div className="mb-4">
              <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">Aspect Ratio</label>
              <div className="flex flex-wrap gap-2">
                {supportedRatios.map(ratio => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-3 py-1.5 text-xs rounded-md border transition-all ${
                      aspectRatio === ratio
                      ? 'border-indigo-500 bg-indigo-500/10 text-indigo-500 dark:text-indigo-400' 
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-500 dark:text-zinc-400'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            {category === 'video-generation' && (
               <div>
                 <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">Duration (Seconds)</label>
                 <input 
                   type="range" 
                   min={model.startsWith('kling') ? "3" : "4"} 
                   max={model.startsWith('kling') || model.startsWith('seedance') ? "15" : "10"} 
                   step="1" 
                   value={duration} 
                   onChange={(e) => setDuration(parseInt(e.target.value))}
                   className="w-full accent-indigo-500"
                 />
                 <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 text-center">{duration}s</div>
               </div>
            )}
          </div>
        )}

        {/* Button no longer has mt-auto, so it sits naturally below configuration */}
        <button 
          onClick={handleGenerate}
          disabled={status === 'generating' || status === 'polling'}
          className="mt-2 flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-900/20"
        >
          {status === 'generating' || status === 'polling' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Play className="w-5 h-5 fill-current" />
          )}
          {status === 'polling' ? `Processing Job...` : 'Generate Now'}
        </button>

      </div>

      {/* RIGHT PANEL - Preview & Logs */}
      <div className="flex-1 min-w-0 min-h-[500px] flex flex-col p-6 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 to-transparent pointer-events-none" />
        
        <div className="flex items-center justify-between mb-4 relative z-10">
          <h3 className="font-medium text-zinc-900 dark:text-zinc-200">Output Preview</h3>
          {status === 'polling' && (
            <span className="flex items-center gap-2 text-xs font-medium text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
              <Loader2 className="w-3 h-3 animate-spin" />
              Generating
            </span>
          )}
          {status === 'success' && (
            <span className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20">
              <CheckCircle2 className="w-3 h-3" />
              Success
            </span>
          )}
          {status === 'error' && (
            <span className="flex items-center gap-2 text-xs font-medium text-red-400 bg-red-400/10 px-2.5 py-1 rounded-full border border-red-400/20">
              <XCircle className="w-3 h-3" />
              Failed
            </span>
          )}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-950 overflow-hidden relative z-10 min-h-[400px]">
          
          {status === 'idle' && (
            <div className="flex flex-col items-center gap-3 text-zinc-400 dark:text-zinc-600">
              <Terminal className="w-12 h-12 stroke-[1.5]" />
              <p className="text-sm">Configure your prompt and click Generate</p>
            </div>
          )}

          {(status === 'generating' || status === 'polling') && (
            <div className="flex flex-col items-center gap-4 text-indigo-400">
              <Loader2 className="w-10 h-10 animate-spin" />
              <div className="text-center">
                <p className="text-sm font-medium">Running Inference on GPU...</p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center gap-3 text-red-400 p-6 text-center">
              <XCircle className="w-10 h-10" />
              <p className="text-sm font-medium">Generation Failed</p>
            </div>
          )}

          {status === 'success' && result && (
            <div className="w-full h-full p-2 flex items-center justify-center">
              {result.imageUrl && (
                <img 
                  src={result.imageUrl} 
                  alt="Generated" 
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                />
              )}
              {result.videoUrl && (
                <video 
                  src={result.videoUrl} 
                  autoPlay 
                  controls 
                  loop 
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                />
              )}
              {!result.imageUrl && !result.videoUrl && (
                <p className="text-sm text-zinc-400">Generated successfully, but no media URL was returned.</p>
              )}
            </div>
          )}
        </div>

        {/* Live Logs Terminal */}
        <div className="mt-6 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-100 dark:bg-black p-4 relative z-10 flex flex-col h-40 shrink-0">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-mono text-zinc-500">Live Execution Logs</span>
          </div>
          <div ref={logsContainerRef} className="flex-1 overflow-y-auto space-y-1 font-mono text-xs custom-scrollbar">
            {logs.length === 0 ? (
              <span className="text-zinc-400 dark:text-zinc-600">Awaiting job...</span>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-zinc-400 dark:text-zinc-600 shrink-0">[{log.time}]</span>
                  <span className={
                    log.type === 'error' ? 'text-red-500 dark:text-red-400' :
                    log.type === 'success' ? 'text-emerald-500 dark:text-emerald-400' :
                    'text-zinc-700 dark:text-zinc-300'
                  }>
                    {log.msg}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Developer Integration Section */}
        <div className="mt-6 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 p-6 relative z-10">
          <h3 className="font-medium text-zinc-900 dark:text-zinc-200 mb-4">Developer Integration</h3>
          
          <div className="flex flex-col gap-6">
            
            {/* cURL Commands (Stacked Vertically for full width) */}
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-indigo-500 dark:text-indigo-400 font-semibold uppercase tracking-wider">1. Submit Job (POST)</span>
                </div>
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-100 dark:bg-black overflow-hidden relative group">
                  <pre className="text-[11px] font-mono text-zinc-700 dark:text-zinc-300 overflow-x-auto whitespace-pre-wrap p-4 custom-scrollbar">
{`curl -X POST https://lumorislabs.online/api/${category}/${model} \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer ${apiKey || '<YOUR_API_KEY>'}" \\
-d '{"prompt": "${prompt.replace(/'/g, "\\'")}", "aspectRatio": "${aspectRatio}"${category === 'video-generation' ? `, "duration": ${duration}` : ''}}'`}
                  </pre>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-emerald-500 dark:text-emerald-400 font-semibold uppercase tracking-wider">2. Poll Job Status (GET)</span>
                </div>
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-100 dark:bg-black overflow-hidden relative group">
                  <pre className="text-[11px] font-mono text-zinc-700 dark:text-zinc-300 overflow-x-auto whitespace-pre-wrap p-4 custom-scrollbar">
{`curl -X GET https://lumorislabs.online/api/jobs/${jobId || '<YOUR_JOB_ID>'} \\
-H "Authorization: Bearer ${apiKey || '<YOUR_API_KEY>'}"`}
                  </pre>
                </div>
              </div>
            </div>

            {/* JSON Responses (Stacked Vertically for full width) */}
            <div className="flex flex-col gap-4 mt-2">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-zinc-500 font-semibold uppercase tracking-wider">Response (POST)</span>
                </div>
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-100 dark:bg-black overflow-hidden">
                  <pre className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400 overflow-x-auto whitespace-pre-wrap p-4 custom-scrollbar max-h-48">
{postResponse ? JSON.stringify(postResponse, null, 2) : '// Awaiting submission...'}
                  </pre>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-zinc-500 font-semibold uppercase tracking-wider">Response (GET Final)</span>
                </div>
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-100 dark:bg-black overflow-hidden">
                  <pre className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400 overflow-x-auto whitespace-pre-wrap p-4 custom-scrollbar max-h-64">
{finalResponse ? JSON.stringify(finalResponse, null, 2) : '// Awaiting completion...'}
                  </pre>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
