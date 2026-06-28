"use client";

import React, { useEffect, useRef } from 'react';

const col1 = [
  "import { Lumoris } from '@lumoris/sdk';",
  "const client = new Lumoris({ apiKey: process.env.LUMORIS_API_KEY });",
  "export async function generateImage(prompt: string) {",
  "  const response = await client.images.generate({",
  "    model: 'flux-1-pro',",
  "    prompt,",
  "    aspect_ratio: '16:9',",
  "  });",
  "  return response.data.url;",
  "}",
  "// Connecting to edge nodes...",
  "// Routing request to lowest latency cluster [EU-WEST-2]"
];

const col2 = [
  "async function streamResponse() {",
  "  const stream = await client.completions.stream({",
  "    model: 'lumoris-instruct-v2',",
  "    messages: [{ role: 'user', content: 'Optimize neural weights' }]",
  "  });",
  "  for await (const chunk of stream) {",
  "    process.stdout.write(chunk.choices[0].delta.content);",
  "  }",
  "}",
  "export const config = { runtime: 'edge' };",
  "const systemPrompt = `You are Lumoris, a powerful AI.`;"
];

const col3 = [
  "const metrics = await client.usage.getMetrics({ interval: '1h' });",
  "if (metrics.creditsRemaining < 1000) {",
  "  await client.billing.autoTopUp(5000);",
  "}",
  "try {",
  "  const response = await client.audio.speech.create({",
  "    model: 'lumoris-tts-1',",
  "    voice: 'alloy',",
  "    input: 'Welcome to the future of AI.',",
  "  });",
  "} catch (error) {",
  "  console.error(error);",
  "}"
];

const Column = ({ speed, direction, opacity, items, startOffset }: { speed: number, direction: 1 | -1, opacity: string, items: string[], startOffset: number }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    let position = startOffset;
    
    const animate = () => {
      if (containerRef.current) {
        position -= speed * direction; 
        const maxScroll = containerRef.current.scrollHeight / 2;
        
        // Loop conditions
        if (direction === 1 && Math.abs(position) >= maxScroll) position = 0;
        if (direction === -1 && position >= 0) position = -maxScroll;
        
        containerRef.current.style.transform = `translateY(${position}px)`;
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [speed, direction, startOffset]);

  return (
    <div className={`flex-1 overflow-hidden h-full ${opacity}`}>
      <div ref={containerRef} className="flex flex-col font-mono text-[10px] text-zinc-500 whitespace-pre will-change-transform">
        {/* Render 8 times to ensure we have enough height to loop seamlessly */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex flex-col gap-3 py-6">
            {items.map((line, idx) => (
              <div key={idx}>{line === "" ? "\u00A0" : line}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function CodeBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 flex gap-8 px-8 opacity-80" 
         style={{ 
           WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
           maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)' 
         }}>
         
      <Column speed={0.4} direction={1} opacity="opacity-30" items={col1} startOffset={0} />
      {/* Middle column is brighter and scrolls downwards (reverse) */}
      <Column speed={0.7} direction={-1} opacity="opacity-60" items={col2} startOffset={-1000} />
      <Column speed={0.3} direction={1} opacity="opacity-20" items={col3} startOffset={-300} />
    </div>
  );
}
