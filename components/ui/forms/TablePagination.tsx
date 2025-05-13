import React from 'react';
import getVisiblePages from '../../utils/pagingHelper';
import classNames from 'classnames';

type TTablePaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  visibleRange?: number;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  disabled?: boolean;
};

const TablePagination = ({ currentPage, totalPages, onPageChange, visibleRange = 3, showFirstLast = true, showPrevNext = true, disabled = false }: TTablePaginationProps) => {
  const visiblePages: number[] = getVisiblePages(currentPage, totalPages, visibleRange);

  const getFontSize = (page: number): string => {
    const distance = Math.abs(currentPage - page);

    if (distance === 0) return 'text-[1.5rem]';
    if (distance === 1) return 'text-[1.25rem]';
    if (distance === 2) return 'text-[1rem]';
    return 'text-[0.75rem]';
  };

  return (
    <div className="pagination text-center py-3 flex items-center justify-center gap-4">
      {/* {showFirstLast && currentPage > 1 && (
        <button onClick={() => onPageChange(1)} aria-label="First page">
          «
        </button>
      )} */}

      {/* {showPrevNext && currentPage > 1 && (
        <button onClick={() => onPageChange(currentPage - 1)} aria-label="Previous page">
          ‹
        </button>
      )} */}

      {/* {visiblePages[0] > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className={currentPage === 1 ? 'active' : ''}>
            1
          </button>
          {visiblePages[0] > 2 && <span className="ellipsis">...</span>}
        </>
      )} */}

      {visiblePages.map(page => (
        <button
          disabled={disabled}
          key={page}
          onClick={() => currentPage !== page && onPageChange(page)}
          className={classNames(`${getFontSize(page)} font-semibold cursor-pointer`, currentPage === page && 'underline')}
          aria-current={currentPage === page ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      {/* {visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && <span className="ellipsis">...</span>}
          <button onClick={() => onPageChange(totalPages)} className={currentPage === totalPages ? 'active' : ''}>
            {totalPages}
          </button>
        </>
      )} */}

      {/* {showPrevNext && currentPage < totalPages && (
        <button onClick={() => onPageChange(currentPage + 1)} aria-label="Next page">
          ›
        </button>
      )}

      {showFirstLast && currentPage < totalPages && (
        <button onClick={() => onPageChange(totalPages)} aria-label="Last page">
          »
        </button>
      )} */}
    </div>
  );
};

export default TablePagination;
