import type { Metadata } from 'next';
import Link from 'next/link';
import css from './NotFound.module.css';

export const metadata: Metadata = {
  title: '404 - Page not found | NoteHub',
  description: 'Sorry, the page you are looking for does not exist.',
  openGraph: {
    title: '404 - Page not found | NoteHub',
    description: 'Sorry, the page you are looking for does not exist.',
    url: 'https://notehub.com/not-found',
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

export default function NotFound(): React.ReactElement {
  return (
    <div className={css.container}>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>Sorry, the page you are looking for does not exist.</p>
      <Link href="/" className={css.link}>
        Back to Home
      </Link>
    </div>
  );
}