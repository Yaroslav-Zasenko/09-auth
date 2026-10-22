'use client';

import ReactPaginate, { ReactPaginateProps } from 'react-paginate';
import css from './Pagination.module.css';

// Типізуємо обгортку через ReactPaginateProps замість any
const SafeReactPaginate = ReactPaginate as unknown as React.ComponentType<ReactPaginateProps>;

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (selectedPage: number) => void;
}

export default function Pagination({
  pageCount,
  currentPage,
  onPageChange,
}: PaginationProps): React.ReactElement | null {
  if (pageCount <= 1) return null;

  const handlePageClick = (event: { selected: number }) => {
    const newPage = event.selected + 1;
    if (newPage !== currentPage) {
      onPageChange(newPage);
    }
  };

  const safeCurrentPage = Math.max(0, Math.min(currentPage - 1, pageCount - 1));

  return (
    <SafeReactPaginate
      key={pageCount}
      forcePage={safeCurrentPage}
      previousLabel={'<'}
      nextLabel={'>'}
      breakLabel={'...'}
      pageCount={pageCount}
      marginPagesDisplayed={1}
      pageRangeDisplayed={2}
      onPageChange={handlePageClick}
      containerClassName={css.pagination}
      activeClassName={css.active}
      pageClassName={css.pageItem}
      previousClassName={css.prevItem}
      nextClassName={css.nextItem}
      breakClassName={css.breakItem}
    />
  );
}