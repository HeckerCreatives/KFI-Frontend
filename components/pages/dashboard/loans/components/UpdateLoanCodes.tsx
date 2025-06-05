import { IonButton } from '@ionic/react';
import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableHeadRow } from '../../../../ui/table/Table';
import { Loan, LoanCode } from '../../../../../types/types';
import UpdateLoanCodeForm from './UpdateLoanCodeForm';
import CreateLoanCodeForm from './CreateLoanCodeForm';
import { TLoan } from '../Loans';

type UpdateLoanCodesProps = {
  loan: Loan;
  setData: React.Dispatch<React.SetStateAction<TLoan>>;
};

const UpdateLoanCodes = ({ loan, setData }: UpdateLoanCodesProps) => {
  return (
    <div className="mt-2">
      <CreateLoanCodeForm productId={loan._id} setData={setData} />
      <div className="relative overflow-auto">
        <Table>
          <TableHeader>
            <TableHeadRow className="border-b-0 bg-slate-100">
              <TableHead>Module</TableHead>
              <TableHead>Loan Type</TableHead>
              <TableHead>Account Code</TableHead>
              <TableHead className="max-w-10">Sort Order</TableHead>
              <TableHead className="text-center max-w-10">Actions</TableHead>
            </TableHeadRow>
          </TableHeader>
          <TableBody>
            {loan.loanCodes.map((loanCode: LoanCode) => (
              <UpdateLoanCodeForm key={loanCode?._id} loanCode={loanCode} productId={loan._id} setData={setData} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UpdateLoanCodes;
