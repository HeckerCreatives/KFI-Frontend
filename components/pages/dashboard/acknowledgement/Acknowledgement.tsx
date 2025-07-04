import { IonContent, IonPage, useIonToast } from '@ionic/react';
import React, { useState } from 'react';
import PageTitle from '../../../ui/page/PageTitle';
import AcknowledgementFilter from './components/AcknowledgementFilter';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import { canDoAction, haveActions } from '../../../utils/permissions';
import { AccessToken, Acknowledgement as AcknowledgementType } from '../../../../types/types';
import { jwtDecode } from 'jwt-decode';
import TableLoadingRow from '../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../ui/forms/TableNoRows';
import { formatMoney } from '../../../utils/number';
import { formatDateTable } from '../../../utils/date-utils';
import CreateAcknowledgement from './modals/CreateAcknowledgement';

export type TData = {
  acknowledgements: AcknowledgementType[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const Acknowledgement = () => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);

  const [present] = useIonToast();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchKey, setSearchKey] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('');
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');

  const [data, setData] = useState<TData>({
    acknowledgements: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });

  const getAcknowledgements = (page: number) => {};

  return (
    <IonPage className="">
      <IonContent className="[--background:#F1F1F1]" fullscreen>
        <div className="h-full flex flex-col items-stretch justify-start">
          <PageTitle pages={['Transaction', 'Acknowledgment']} />
          {/* <div className="px-3 pb-3 flex-1">
            <div className=" bg-white p-3 rounded-2xl shadow-lg mt-3 mb-4 flex flex-col items-end">
              <div className="w-full flex items-end">
                <AcknowledgementFilter getAcknowledgements={getAcknowledgements} />
              </div>
              <div className="w-full flex items-start">
                <div>{canDoAction(token.role, token.permissions, 'acknowledgement', 'create') && <CreateAcknowledgement getAcknowledgements={getAcknowledgements} />}</div>
                <div>{canDoAction(token.role, token.permissions, 'acknowledgement', 'print') && <PrintAllLoanRelease />}</div>
                <div>{canDoAction(token.role, token.permissions, 'acknowledgement', 'export') && <ExportAllLoanRelease />}</div>
              </div>
            </div>
            <div className="relative overflow-auto">
              <Table>
                <TableHeader>
                  <TableHeadRow>
                    <TableHead>CV Number</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Bank</TableHead>
                    <TableHead>CHK. No.</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Encoded By</TableHead>
                    {haveActions(token.role, 'acknowledgement', token.permissions, ['update', 'delete', 'visible', 'print', 'export']) && <TableHead>Actions</TableHead>}
                  </TableHeadRow>
                </TableHeader>
                <TableBody>
                  {data.loading && <TableLoadingRow colspan={8} />}
                  {!data.loading && data.acknowledgements.length < 1 && <TableNoRows label="No Acknowledgement Record Found" colspan={8} />}
                  {!data.loading &&
                    data.acknowledgements.length > 0 &&
                    data.acknowledgements.map((acknowledgement: AcknowledgementType) => (
                      <TableRow key={acknowledgement._id}>
                        <TableCell>CV#{acknowledgement.code}</TableCell>
                        <TableCell>{formatDateTable(acknowledgement.date)}</TableCell>
                        <TableCell>{acknowledgement.bankCode.description}</TableCell>
                        <TableCell>{acknowledgement.checkNo}</TableCell>
                        <TableCell>{formatMoney(acknowledgement.amount)}</TableCell>
                        <TableCell>{acknowledgement.encodedBy.username}</TableCell>
                        {haveActions(token.role, 'acknowledgement', token.permissions, ['update', 'delete', 'visible', 'print', 'export']) && (
                          <TableCell>
                            <LoanReleaseActions
                              transaction={transaction}
                              getTransactions={getTransactions}
                              setData={setData}
                              searchKey={searchKey}
                              sortKey={sortKey}
                              to={to}
                              from={from}
                              currentPage={currentPage}
                              setCurrentPage={setCurrentPage}
                              rowLength={data.transactions.length}
                            />
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div> */}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Acknowledgement;
