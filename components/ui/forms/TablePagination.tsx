import React from 'react';
import getVisiblePages from '../../utils/pagingHelper';
import { IonButton, IonIcon } from '@ionic/react';
import { arrowBack, arrowForward } from 'ionicons/icons';

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
  // const visiblePages: number[] = getVisiblePages(currentPage, totalPages, visibleRange);

  // const getFontSize = (page: number): string => {
  //   const distance = Math.abs(currentPage - page);

  //   if (distance === 0) return 'text-[1.5rem]';
  //   if (distance === 1) return 'text-[1.25rem]';
  //   if (distance === 2) return 'text-[1rem]';
  //   return 'text-[0.75rem]';
  // };

  return (
    // <div className="pagination text-center py-3 flex items-center justify-center gap-4">
    //   {visiblePages.map(page => (
    //     <button
    //       disabled={disabled}
    //       key={page}
    //       onClick={() => currentPage !== page && onPageChange(page)}
    //       className={classNames(`${getFontSize(page)} font-semibold cursor-pointer`, currentPage === page && 'underline')}
    //       aria-current={currentPage === page ? 'page' : undefined}
    //     >
    //       {page}
    //     </button>
    //   ))}
    // </div>

    <div className="w-full pb-3">
      <div className="flex items-center justify-center gap-2 py-1 px-5 rounded-md bg-[#18181B] w-fit mx-auto">
        <div>
          <IonButton
            fill="clear"
            disabled={currentPage === 1 || disabled}
            onClick={() => currentPage - 1 !== 0 && onPageChange(currentPage - 1)}
            // className="max-h-10 min-h-6 h-8 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md"
            className="max-h-10 min-h-6 h-8 bg-[#EAB308] text-white capitalize font-semibold rounded-md"
          >
            <IonIcon icon={arrowBack} />
          </IonButton>
        </div>
        <div>
          <div className="text-sm !font-semibold bg-[#27272A] px-3 py-1.5 rounded-lg text-slate-300">
            {currentPage} / {totalPages}
          </div>
        </div>
        <div>
          <IonButton
            fill="clear"
            disabled={totalPages === currentPage || disabled}
            onClick={() => currentPage + 1 <= totalPages && onPageChange(currentPage + 1)}
            // className="max-h-10 min-h-6 h-8 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md"
            className="max-h-10 min-h-6 h-8 bg-[#EAB308] text-white capitalize font-semibold rounded-md"
          >
            <IonIcon icon={arrowForward} />
          </IonButton>
        </div>
      </div>
    </div>
  );
};

export default TablePagination;
