import { source } from '@/lib/source';
import { DocsPage, DocsBody, DocsTitle } from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import defaultMdxComponents from 'fumadocs-ui/mdx';
// Import OpenAPI UI components
import { RootToggle } from 'fumadocs-ui/components/layout/root-toggle';
import { APIPage } from '@/app/api-page';

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const resolvedParams = await params;
  const page = source.getPage(resolvedParams.slug);
  if (!page) notFound();

  const MDX = (page.data as any).body;

  return (
    <DocsPage toc={(page.data as any).toc} full={(page.data as any).full}>
      <DocsTitle>{page.data.title as string}</DocsTitle>
      <DocsBody>
        <MDX components={{ ...defaultMdxComponents, APIPage, RootToggle }} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }) {
  const resolvedParams = await params;
  const page = source.getPage(resolvedParams.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: (page.data as any).description,
  };
}
