import React from 'react';
import { TableCell, TableRow } from '../table/Table';

type TableNoRowsProps = {
  label: string;
  colspan: number;
};

const TableNoRows = ({ label, colspan }: TableNoRowsProps) => {
  return (
    <TableRow>
      <TableCell colSpan={colspan} className="text-center">
        {label}
      </TableCell>
    </TableRow>
  );
};

export default TableNoRows;
