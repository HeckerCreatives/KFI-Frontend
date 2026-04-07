import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { arrowBack, arrowForward } from 'ionicons/icons';

type TTablePaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  visibleRange?: number;
  disabled?: boolean;
};

const Paginations = ({
  currentPage,
  totalPages,
  onPageChange,
  visibleRange = 3,
  disabled = false,
}: TTablePaginationProps) => {

 const getVisiblePages = (): (number | '...')[] => {
  if (totalPages <= 9) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const half = Math.floor(totalPages / 2);
  const pages: (number | '...')[] = [];

  const first = [1, 2, 3];
  const middle = half;
  const last = totalPages;

  const nearFirst = currentPage <= 5;
  const nearLast = currentPage >= totalPages - 4;
  const nearMiddle = Math.abs(currentPage - half) <= 2;

  if (nearFirst) {
    // < 1 2 3 4 5 6 7 ... 50 ... 100 >
    const end = Math.max(7, currentPage + 2);
    for (let i = 1; i <= end; i++) pages.push(i);
    pages.push('...');
    pages.push(middle);
    pages.push('...');
    pages.push(last);
  } else if (nearLast) {
    // < 1 ... 50 ... 94 95 96 97 98 99 100 >
    pages.push(1);
    pages.push('...');
    pages.push(middle);
    pages.push('...');
    const start = Math.min(totalPages - 6, currentPage - 2);
    for (let i = start; i <= totalPages; i++) pages.push(i);
  } else if (nearMiddle) {
    // < 1 ... 48 49 50 51 52 ... 100 >
    pages.push(1);
    pages.push('...');
    for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
    pages.push('...');
    pages.push(last);
  } else if (currentPage < half) {
    // < 1 2 3 ... X-1 X X+1 ... 50 ... 100 >
    pages.push(...first);
    pages.push('...');
    for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
    pages.push('...');
    pages.push(middle);
    pages.push('...');
    pages.push(last);
  } else {
    // < 1 ... 50 ... X-1 X X+1 ... 98 99 100 >
    pages.push(1);
    pages.push('...');
    pages.push(middle);
    pages.push('...');
    for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
    pages.push('...');
    pages.push(last);
  }

  return pages;
};

  const btnBase = "min-w-[2rem] h-8 px-2 rounded-md text-sm font-semibold transition-colors";

  return (
    <div className="w-full pb-3">
      <div className="flex items-center justify-center py-1 px-5 rounded-md w-fit mx-auto">

        {/* Prev */}
        <IonButton
          fill="clear"
          disabled={currentPage === 1 || disabled}
          onClick={() => onPageChange(currentPage - 1)}
          className="max-h-10 min-h-6 h-8 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md"
        >
          <IonIcon icon={arrowBack} />
        </IonButton>

        {/* Page numbers */}
        {getVisiblePages().map((page, idx) =>
          page === '...' ? (
            <span key={`ellipsis-${idx}`} className=" text-slate-400 text-xs select-none">
              ...
            </span>
          ) : (
            <button
              key={page}
              disabled={disabled}
              onClick={() => onPageChange(page)}
              className={`${btnBase} ${
                currentPage === page
                  ? 'bg-[#FA6C2F] text-white'
                  : 'text-slate-600 hover:bg-orange-100 text-xs'
              }`}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}
        <IonButton
          fill="clear"
          disabled={currentPage === totalPages || disabled}
          onClick={() => onPageChange(currentPage + 1)}
          className="max-h-10 min-h-6 h-8 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md"
        >
          <IonIcon icon={arrowForward} />
        </IonButton>

      </div>
    </div>
  );
};

export default Paginations;