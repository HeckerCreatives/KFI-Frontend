import classNames from 'classnames';
import React from 'react';

type TableProps = {
  className?: string;
  children?: React.ReactNode;
} & React.TableHTMLAttributes<HTMLTableElement>;

const Table = ({ className, children, ...props }: TableProps) => (
  <table className={classNames('w-full text-sm text-left rtl:text-right text-slate-800', className)} {...props}>
    {children}
  </table>
);

Table.displayName = 'Table';

type TableHeaderProps = {
  className?: string;
  children?: React.ReactNode;
} & React.TableHTMLAttributes<HTMLTableSectionElement>;

const TableHeader = ({ className, children, ...props }: TableHeaderProps) => <thead className={classNames('bg-[#FDF1E8] text-slate-700', className)}>{children}</thead>;

TableHeader.displayName = 'TableHeader';

type TableBodyProps = {
  className?: string;
  children?: React.ReactNode;
} & React.TableHTMLAttributes<HTMLTableSectionElement>;

const TableBody = ({ className, children, ...props }: TableBodyProps) => <tbody className={classNames('[&_tr:last-child]:border-0', className)}>{children}</tbody>;

TableBody.displayName = 'TableBody';

type TableRowProps = {
  className?: string;
  children?: React.ReactNode;
} & React.TableHTMLAttributes<HTMLTableRowElement>;

const TableRow = ({ className, children, ...props }: TableRowProps) => (
  <tr className={classNames(' border-b-4 border-b-slate-200 bg-white hover:bg-slate-100 truncate', className)} {...props}>
    {children}
  </tr>
);
TableRow.displayName = 'TableRow';

const TableHeadRow = ({ className, children, ...props }: TableRowProps) => (
  <tr className={classNames(' border-b-4 border-b-slate-200 truncate', className)} {...props}>
    {children}
  </tr>
);
TableHeadRow.displayName = 'TableHeadRow';

interface ThProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  className?: string;
  children?: React.ReactNode;
}

const TableHead = ({ className, children, ...props }: ThProps) => (
  <th className={classNames('px-5 py-3.5 truncate  text-sm uppercase !font-[600] text-orange-800', className)} {...props}>
    {children}
  </th>
);
TableHead.displayName = 'TableHead';

interface TdProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  className?: string;
  children?: React.ReactNode;
}

const TableCell = ({ className, children, ...props }: TdProps) => (
  <td className={classNames(' px-5 py-2 align-middle !text-[0.8rem] text-slate-600', className)} {...props}>
    {children}
  </td>
);

TableCell.displayName = 'TableCell';

export { Table, TableHeader, TableRow, TableCell, TableHead, TableBody, TableHeadRow };
