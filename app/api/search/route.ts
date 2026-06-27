import { source } from '@/lib/source';
import { createSearchAPI } from 'fumadocs-core/search/server';

export const dynamic = 'force-static';

export const { GET } = createSearchAPI('advanced', {
  indexes: source.getPages().map((page) => ({
    title: page.data.title as string,
    description: (page.data as any).description as string,
    structuredData: (page.data as any).exports?.structuredData,
    id: page.url,
    url: page.url,
  })),
});
