import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { source } from '@/lib/source';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout 
      tree={source.pageTree} 
      nav={{ 
        title: (
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Lumoris Labs" className="w-5 h-5 object-contain" style={{ filter: 'drop-shadow(0 0 1px rgba(192,38,211,1)) drop-shadow(0 0 3px rgba(192,38,211,0.8)) brightness(1.3) contrast(1.2)' }} />
            <span className="font-semibold tracking-tight">Lumoris Labs API</span>
          </div>
        ) 
      }}
      sidebar={{
        defaultOpenLevel: 1
      }}
    >
      {children}
    </DocsLayout>
  );
}
