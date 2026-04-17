import { ArrowDown, ArrowUp } from 'lucide-react';
import React from 'react';

interface SortableTableHeaderProps {
  label: string;
  sortKey: string;
  currentSort: string;
  ascValue: string;
  descValue: string;
  onSort: (sortKey: string) => void;
  className?: string;
}

export const SortableTableHeader: React.FC<SortableTableHeaderProps> = ({
  label,
  sortKey,
  currentSort,
  ascValue,
  descValue,
  onSort,
  className = '',
}) => {
  const isAsc = currentSort === ascValue;
  const isDesc = currentSort === descValue;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label}
      {isAsc ? (
        <ArrowUp
          size={15}
          onClick={() => onSort(descValue)}
          className="cursor-pointer"
        />
      ) : isDesc ? (
        <ArrowDown
          size={15}
          onClick={() => onSort(ascValue)}
          className="cursor-pointer"
        />
      ) : (
        <ArrowUp
          size={15}
          onClick={() => onSort(ascValue)}
          className="cursor-pointer opacity-30"
        />
      )}
    </div>
  );
};

export default SortableTableHeader;
