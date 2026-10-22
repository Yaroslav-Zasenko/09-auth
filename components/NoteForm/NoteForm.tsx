'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api';
import { useNoteStore } from '@/lib/store/noteStore';
import css from './NoteForm.module.css';

export default function NoteForm(): React.ReactElement {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Отримуємо дії зі Zustand стору чернеток
  const { draft, setDraft, clearDraft } = useNoteStore();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      clearDraft(); // Очищуємо чернетку після успішного створення
      router.push('/notes/filter/all'); // Перенаправляємо на список нотаток
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDraft({ [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(draft);
  };

  return (
    <form onSubmit={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title" className={css.label}>Title</label>
        <input 
          id="title" 
          name="title" 
          type="text" 
          defaultValue={draft.title}
          onChange={handleChange}
          className={css.input} 
          placeholder="Enter title" 
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content" className={css.label}>Content</label>
        <textarea
          id="content"
          name="content"
          defaultValue={draft.content}
          onChange={handleChange}
          className={css.textarea}
          placeholder="Enter content"
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag" className={css.label}>Tag</label>
        <select 
          id="tag" 
          name="tag" 
          defaultValue={draft.tag}
          onChange={handleChange} 
          className={css.select}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button 
          type="submit" 
          className={css.submitButton}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Creating...' : 'Create note'}
        </button>
        <button 
          type="button" 
          onClick={() => router.back()} 
          className={css.cancelButton}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}