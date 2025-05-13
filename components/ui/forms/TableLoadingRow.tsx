import React from 'react';
import { TableCell, TableRow } from '../table/Table';
import { IonSpinner } from '@ionic/react';

type TableNoRowsProps = {
  colspan: number;
};

const TableLoadingRow = ({ colspan }: TableNoRowsProps) => {
  return (
    <TableRow>
      <TableCell colSpan={colspan} className="text-center">
        <IonSpinner name="lines-small" />
      </TableCell>
    </TableRow>
  );
};

export default TableLoadingRow;
