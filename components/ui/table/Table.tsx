import classNames from "classnames"
import type React from "react"

type TableProps = {
  className?: string
  children?: React.ReactNode
} & React.TableHTMLAttributes<HTMLTableElement>

const Table = ({ className, children, ...props }: TableProps) => (
  <table
    className={classNames(
      "w-full text-sm text-left border-collapse bg-white overflow-hidden shadow-sm border border-gray-200",
      className,
    )}
    {...props}
  >
    {children}
  </table>
)

Table.displayName = "Table"

type TableHeaderProps = {
  className?: string
  children?: React.ReactNode
} & React.TableHTMLAttributes<HTMLTableSectionElement>

const TableHeader = ({ className, children, ...props }: TableHeaderProps) => (
  <thead className={classNames("", className)}>{children}</thead>
)

TableHeader.displayName = "TableHeader"

type TableBodyProps = {
  className?: string
  children?: React.ReactNode
} & React.TableHTMLAttributes<HTMLTableSectionElement>

const TableBody = ({ className, children, ...props }: TableBodyProps) => (
  <tbody className={classNames("divide-y divide-gray-100", className)} {...props}>
    {children}
  </tbody>
)

TableBody.displayName = "TableBody"

type TableRowProps = {
  className?: string
  children?: React.ReactNode
} & React.TableHTMLAttributes<HTMLTableRowElement>

const TableRow = ({ className, children, ...props }: TableRowProps) => (
  <tr className={classNames("hover:bg-gray-50 transition-colors duration-150", className)} {...props}>
    {children}
  </tr>
)
TableRow.displayName = "TableRow"

const TableHeadRow = ({ className, children, ...props }: TableRowProps) => (
  <tr
    className={classNames("bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200", className)}
    {...props}
  >
    {children}
  </tr>
)
TableHeadRow.displayName = "TableHeadRow"

interface ThProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  className?: string
  children?: React.ReactNode
}

const TableHead = ({ className, children, ...props }: ThProps) => (
  <th
    className={classNames(
      "px-6 py-4 text-left text-xs !font-medium text-black uppercase tracking-wider",
      className,
    )}
    {...props}
  >
    {children}
  </th>
)
TableHead.displayName = "TableHead"

interface TdProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  className?: string
  children?: React.ReactNode
}

const TableCell = ({ className, children, ...props }: TdProps) => (
  <td className={classNames("px-6 py-4 text-xs !text-black !font-medium whitespace-nowrap", className)} {...props}>
    {children}
  </td>
)

TableCell.displayName = "TableCell"

export { Table, TableHeader, TableRow, TableCell, TableHead, TableBody, TableHeadRow }
