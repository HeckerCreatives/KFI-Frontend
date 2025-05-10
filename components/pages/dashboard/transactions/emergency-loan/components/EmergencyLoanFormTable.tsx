import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../../../ui/table/Table';

const EmergencyLoanFormTable = () => {
  const arrDummy: string[] = Array.from(Array(10)).fill('');

  return (
    <div className="relative overflow-auto">
      <Table>
        <TableHeader>
          <TableHeadRow className="border-b-0 bg-slate-100">
            <TableHead>Line</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Particular</TableHead>
            <TableHead>Acct. Code</TableHead>
            <TableHead>Description</TableHead>
          </TableHeadRow>
        </TableHeader>
        <TableBody>
          {arrDummy.map((arr: string, i: number) => (
            <TableRow key={i} className="border-b-0">
              <TableCell className="border-4 border-slate-100">{i + 1}</TableCell>
              <TableCell className="border-4 border-slate-100">Kristine T. Bartican</TableCell>
              <TableCell className="border-4 border-slate-100">413-Kristine T. Bartican</TableCell>
              <TableCell className="border-4 border-slate-100">200008</TableCell>
              <TableCell className="border-4 border-slate-100">Loans Receivable - Individual</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmergencyLoanFormTable;
