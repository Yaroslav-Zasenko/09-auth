// app/(private routes)/notes/filter/[...slug]/page.tsx
import type { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getNotes } from '@/lib/api/serverApi';
import NotesClient from './Notes.client';

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slugArray = resolvedParams.slug || ['all'];
  const currentTag = slugArray[0];
  const tagTitle = currentTag === 'all' ? 'All Notes' : currentTag.charAt(0).toUpperCase() + currentTag.slice(1);

  return {
    title: `Notes: ${tagTitle} | NoteHub`,
    description: `Filter notes by tag: ${tagTitle} in NoteHub application.`,
    openGraph: {
      title: `Notes: ${tagTitle} | NoteHub`,
      description: `Filter notes by tag: ${tagTitle} in NoteHub application.`,
      url: `https://notehub.com/notes/filter/${currentTag}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'NoteHub preview image',
        },
      ],
    },
  };
}

export default async function NotesFilterPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slugArray = resolvedParams.slug || ['all'];
  const currentTag = slugArray[0];
  const tagFilter = currentTag === 'all' ? '' : currentTag;

  const queryClient = new QueryClient();

  // Префетчимо дані з урахуванням тегу (порядок аргументів у serverApi: search, page, tag)
  await queryClient.prefetchQuery({
    queryKey: ['notes', { tag: tagFilter || undefined, page: 1, perPage: 12, search: '' }],
    queryFn: () => getNotes('', 1, tagFilter),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* Передаємо tagFilter у пропси так, як вимагає тест */}
      <NotesClient tag={tagFilter || undefined} />
    </HydrationBoundary>
  );
}