'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { getNotes } from '@/lib/api';
import { Note } from '@/types/note';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import css from './NotesPage.module.css';

interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

interface NotesClientProps {
  tag?: string;
}

export default function NotesClient({ tag }: NotesClientProps): React.ReactElement {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [inputValue, setInputValue] = useState('');
  const perPage = 12;

  const debouncedSetSearch = useDebouncedCallback((query: string) => {
    setSearch(query);
    setPage(1);
  }, 300);

  const handleSearchChange = (query: string) => {
    setInputValue(query);
    debouncedSetSearch(query);
  };

  const { data, isLoading, isError } = useQuery<NotesResponse>({
    queryKey: ['notes', { tag, page, perPage, search }],
    queryFn: () => getNotes({ tag, page, perPage, search }),
    placeholderData: (previousData) => previousData,
  });

  const notes: Note[] = data?.notes ?? [];
  const totalPages: number = data?.totalPages ?? 1;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <main className={css.main}>
      <div className={css.app}>
        <div className={css.toolbar}>
          <div className={css.searchContainer}>
            <SearchBox value={inputValue} onSearch={handleSearchChange} />
          </div>

          {totalPages > 1 && (
            <div className={css.paginationContainer}>
              <Pagination
                pageCount={totalPages}
                currentPage={page}
                onPageChange={handlePageChange}
              />
            </div>
          )}

          <div className={css.actionContainer}>
            <Link href="/notes/action/create" className={css.button}>
              Create Note
            </Link>
          </div>
        </div>

        {isLoading && <p>Loading notes...</p>}
        {isError && <p>Failed to load notes. Please try again.</p>}

        {!isLoading && !isError && (
          notes.length > 0 ? (
            <NoteList notes={notes} />
          ) : (
            <p className={css.noNotes}>No notes found.</p>
          )
        )}
      </div>
    </main>
  );
}