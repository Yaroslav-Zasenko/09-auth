'use client';

import { useEffect } from 'react';
import css from './error.module.css';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function NoteError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className={css.errorContainer}>
      <h2 className={css.errorTitle}>Something went wrong!</h2>
      <p className={css.errorMessage}>
        {error.message || 'Could not load the note.'}
      </p>
      <button className={css.retryButton} onClick={() => reset()}>
        Try again
      </button>
    </main>
  );
}