import { IonHeader, IonIcon, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import { list } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { Activity, TTableFilter, User } from '../../../../../types/types';
import kfiAxios from '../../../../utils/axios';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../../ui/table/Table';
import TableLoadingRow from '../../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../../ui/forms/TableNoRows';
import TablePagination from '../../../../ui/forms/TablePagination';
import { formatDateTable } from '../../../../utils/date-utils';
import { TABLE_LIMIT } from '../../../../utils/constants';

type AddPermissionProps = {
  user: User;
};

export type TAction = {
  actions: Activity[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const ActivityLogs = ({ user }: AddPermissionProps) => {
  const [present] = useIonToast();
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [data, setData] = useState<TAction>({
    actions: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });

  function dismiss() {
    setIsOpen(false);
  }

  const handleOpen = () => {
    setIsOpen(true);
  };

  const getActions = async (page: number, keyword: string = '', sort: string = '') => {
    setData(prev => ({ ...prev, loading: true }));
    try {
      const filter: TTableFilter = { limit: TABLE_LIMIT, page };
      const result = await kfiAxios.get(`/user/activity-logs/${user._id}`, { params: filter });
      const { success, activities, hasPrevPage, hasNextPage, totalPages } = result.data;
      if (success) {
        setData(prev => ({
          ...prev,
          actions: activities,
          totalPages: totalPages,
          nextPage: hasNextPage,
          prevPage: hasPrevPage,
        }));
        setCurrentPage(page);
        return;
      }
    } catch (error) {
      present({
        message: 'Failed to get action records. Please try again',
        duration: 1000,
      });
    } finally {
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  const handlePagination = (page: number) => getActions(page, '', '');

  useEffect(() => {
    if (isOpen) {
      getActions(currentPage);
    }
  }, [isOpen]);

  return (
    <>
      <div className="text-end">
        <div
          onClick={handleOpen}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={list} className="text-[1rem]" /> Action Logs
        </div>
      </div>
      <IonModal isOpen={isOpen} backdropDismiss={false} className="auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:50%] lg:[--width:50%]">
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-20">
            <ModalHeader disabled={data.loading} title="Admin - User Action Logs" sub="Manage Account" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content space-y-4">
          <div className="h-full flex flex-col items-stretch justify-start">
            <div className="px-3 pb-3 flex-1">
              <h5>
                Action Logs of <strong>{user.username}</strong>
              </h5>
              <div className="relative overflow-auto">
                <Table>
                  <TableHeader>
                    <TableHeadRow>
                      <TableHead>Action</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>Execution Date</TableHead>
                    </TableHeadRow>
                  </TableHeader>
                  <TableBody>
                    {data.loading && <TableLoadingRow colspan={3} />}
                    {!data.loading && data.actions.length < 1 && <TableNoRows label="No Action Record Found" colspan={3} />}
                    {!data.loading &&
                      data.actions.length > 0 &&
                      data.actions.map((action: Activity) => (
                        <TableRow key={action._id} className="capitalize">
                          <TableCell>{action.activity}</TableCell>
                          <TableCell>{action.resource}</TableCell>
                          <TableCell>{formatDateTable(action.createdAt)}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            <TablePagination currentPage={currentPage} totalPages={data.totalPages} onPageChange={handlePagination} disabled={data.loading} />
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default ActivityLogs;
