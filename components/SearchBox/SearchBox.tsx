'use client';

import css from './SearchBox.module.css';

interface SearchBoxProps {
  value: string;
  onSearch: (query: string) => void;
}

export default function SearchBox({ value, onSearch }: SearchBoxProps): React.ReactElement {
  return (
    <input
      type="text"
      className={css.input}
      placeholder="Search notes..."
      value={value}
      onChange={(e) => onSearch(e.target.value)}
    />
  );
}