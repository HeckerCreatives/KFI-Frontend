import { IonContent, IonPage } from '@ionic/react';
import React from 'react';
import PageTitle from '../../../ui/page/PageTitle';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import CreateLoanRelease from './modals/CreateLoanRelease';
import LoanReleaseActions from './components/LoanReleaseActions';
import LoanReleaseFilter from './components/LoanReleaseFilter';
import { jwtDecode } from 'jwt-decode';
import { AccessToken } from '../../../../types/types';
import { canDoAction, haveActions } from '../../../utils/permissions';

const LoanRelease = () => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const arrDummy: string[] = Array.from(Array(10)).fill('');
  return (
    <IonPage className="">
      <IonContent className="[--background:#F1F1F1]" fullscreen>
        <div className="h-full flex flex-col items-stretch justify-start">
          <PageTitle pages={['Transaction', 'Loan Release']} />
          <div className="px-3 pb-3">
            <div className="flex flex-col lg:flex-row lg:items-start items-start gap-2 justify-center bg-white p-3 rounded-2xl shadow-lg mt-3 mb-4">
              <div>{canDoAction(token.role, token.permissions, 'loan release', 'create') && <CreateLoanRelease />}</div>
              <LoanReleaseFilter />
            </div>
            <div className="relative overflow-auto">
              <Table>
                <TableHeader>
                  <TableHeadRow>
                    <TableHead>Doc. No.</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Pay To</TableHead>
                    <TableHead>Bank</TableHead>
                    <TableHead>CHK. No.</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Encoded By</TableHead>
                    {haveActions(token.role, 'loan release', token.permissions, ['update', 'delete', 'visible']) && <TableHead>Actions</TableHead>}
                  </TableHeadRow>
                </TableHeader>
                <TableBody>
                  {arrDummy.map((arr: string, i: number) => (
                    <TableRow key={i}>
                      <TableCell>CV#25570</TableCell>
                      <TableCell>04/01/2025</TableCell>
                      <TableCell>ALITE 413 - Kristine T. Bartican</TableCell>
                      <TableCell>PNB</TableCell>
                      <TableCell>20005245-46</TableCell>
                      <TableCell>18,340.00</TableCell>
                      <TableCell>EVD</TableCell>
                      {haveActions(token.role, 'loan release', token.permissions, ['update', 'delete', 'visible']) && (
                        <TableCell>
                          <LoanReleaseActions index={i} />
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoanRelease;
