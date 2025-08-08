import { IonContent, IonPage, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react';
import PageTitle from '../../../ui/page/PageTitle';
import AcknowledgementFilter from './components/AcknowledgementFilter';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import { canDoAction, haveActions } from '../../../utils/permissions';
import { AccessToken, Acknowledgement as AcknowledgementType, TTableFilter } from '../../../../types/types';
import { jwtDecode } from 'jwt-decode';
import TableLoadingRow from '../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../ui/forms/TableNoRows';
import { formatMoney } from '../../../utils/number';
import { formatDateTable } from '../../../utils/date-utils';
import CreateAcknowledgement from './modals/CreateAcknowledgement';
import { TABLE_LIMIT } from '../../../utils/constants';
import kfiAxios from '../../../utils/axios';
import PrintAllAcknowledgement from './modals/prints/PrintAllAcknowledgement';
import ExportAllAcknowledgement from './modals/prints/ExportAllAcknowledgement';
import AcknowledgementActions from './components/AcknowledgementActions';
import TablePagination from '../../../ui/forms/TablePagination';

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

  const getAcknowledgements = async (page: number, keyword: string = '', sort: string = '', to: string = '', from: string = '') => {
    setData(prev => ({ ...prev, loading: true }));
    try {
      const filter: TTableFilter & { to?: string; from?: string } = { limit: TABLE_LIMIT, page };
      if (keyword) filter.search = keyword;
      if (sort) filter.sort = sort;
      if (to) filter.to = to;
      if (from) filter.from = from;

      const result = await kfiAxios.get('/acknowledgement', { params: filter });
      const { success, acknowledgements, hasPrevPage, hasNextPage, totalPages } = result.data;
      if (success) {
        setData(prev => ({
          ...prev,
          acknowledgements,
          totalPages: totalPages,
          nextPage: hasNextPage,
          prevPage: hasPrevPage,
        }));
        setCurrentPage(page);
        setSearchKey(keyword);
        setSortKey(sort);
        setFrom(from);
        setTo(to);
        return;
      }
    } catch (error) {
      present({
        message: 'Failed to get acknowledgement records. Please try again',
        duration: 1000,
      });
    } finally {
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  const handlePagination = (page: number) => getAcknowledgements(page, searchKey, sortKey);

  useIonViewWillEnter(() => {
    getAcknowledgements(currentPage);
  });

  return (
    <IonPage className="">
      <IonContent className="[--background:#F1F1F1]" fullscreen>
        <div className="h-full flex flex-col items-stretch justify-start">
          <PageTitle pages={['Transaction', 'Acknowledgement']} />
          <div className="px-3 pb-3 flex-1 flex flex-col">
            <div className=" bg-white p-3 rounded-2xl shadow-lg my-3 flex flex-col lg:flex-row-reverse gap-2 flex-wrap">
              <div className="w-full flex-1 flex items-center justify-end">
                <AcknowledgementFilter getAcknowledgements={getAcknowledgements} />
              </div>
              <div className="flex items-start">
                <div>{canDoAction(token.role, token.permissions, 'acknowledgement', 'create') && <CreateAcknowledgement getAcknowledgements={getAcknowledgements} />}</div>
                <div>{canDoAction(token.role, token.permissions, 'acknowledgement', 'print') && <PrintAllAcknowledgement />}</div>
                <div>{canDoAction(token.role, token.permissions, 'acknowledgement', 'export') && <ExportAllAcknowledgement />}</div>
              </div>
            </div>
            <div className="px-3 pt-3 pb-5 bg-white rounded-xl flex-1 shadow-lg">
              <div className="relative overflow-auto rounded-xl">
                <Table>
                  <TableHeader>
                    <TableHeadRow>
                      <TableHead>OR Number</TableHead>
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
                          <TableCell>{acknowledgement.code}</TableCell>
                          <TableCell>{formatDateTable(acknowledgement.date)}</TableCell>
                          <TableCell>{acknowledgement.bankCode.description}</TableCell>
                          <TableCell>{acknowledgement.checkNo}</TableCell>
                          <TableCell>{formatMoney(acknowledgement.amount)}</TableCell>
                          <TableCell>{acknowledgement.encodedBy.username}</TableCell>
                          {haveActions(token.role, 'acknowledgement', token.permissions, ['update', 'delete', 'visible', 'print', 'export']) && (
                            <TableCell>
                              <AcknowledgementActions
                                acknowledgement={acknowledgement}
                                getAcknowledgements={getAcknowledgements}
                                setData={setData}
                                searchKey={searchKey}
                                sortKey={sortKey}
                                to={to}
                                from={from}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                rowLength={data.acknowledgements.length}
                              />
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
          <TablePagination currentPage={currentPage} totalPages={data.totalPages} onPageChange={handlePagination} disabled={data.loading} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Acknowledgement;
