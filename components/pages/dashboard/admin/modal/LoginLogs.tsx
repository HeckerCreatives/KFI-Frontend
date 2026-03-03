import { IonButton, IonHeader, IonIcon, IonModal, IonToolbar, useIonToast } from '@ionic/react';
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
    logs: any[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const LoginLogs = ({ user }: AddPermissionProps) => {
  const [present] = useIonToast();
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [data, setData] = useState<TAction>({
    logs: [],
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
      const result = await kfiAxios.get(`/user/login-logs/${user._id}`, { params: filter });
      const { success, logs, hasPrevPage, hasNextPage, totalPages } = result.data;
      if (success) {
        setData(prev => ({
          ...prev,
          logs: logs,
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
      {/* <div className="text-end">
        <div
          onClick={handleOpen}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={list} className="text-[1rem]" /> Action Logs
        </div>
      </div> */}
      <IonButton
        fill="clear"
        onClick={handleOpen}
        className="space-x-1 rounded-md min-w-32 min-h-7 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0] bg-purple-50 text-purple-900 capitalize text-xs"
      >
        <IonIcon icon={list} className="text-xs" />
        <span>Login Logs</span>
      </IonButton>
      <IonModal
        isOpen={isOpen}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height [--width:95%] md:[--max-width:90%] md:[--width:95%] lg:[--max-width:50%] lg:[--width:50%]"
      >
        
        <div className="inner-content space-y-4 !p-6">
            <ModalHeader disabled={data.loading} title="Admin - User Login Logs" sub="Manage user login logs." dismiss={dismiss} />

          <div className="h-full flex flex-col items-stretch justify-start">
            <div className="flex-1">
              <p className=' text-sm !font-medium'>
                Login Logs of <span className=' text-orange-500'>{user.username}</span>
              </p>
              <div className="relative overflow-auto">
                <Table>
                  <TableHeader>
                    <TableHeadRow>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Date</TableHead>
                     
                    </TableHeadRow>
                  </TableHeader>
                  <TableBody>
                    {data.loading && <TableLoadingRow colspan={3} />}
                    {!data.loading && data.logs.length < 1 && <TableNoRows label="No login logs found" colspan={3} />}
                    {!data.loading &&
                      data.logs.length > 0 &&
                      data.logs.map((item: any) => (
                        <TableRow key={item._id} className="capitalize">
                          <TableCell>{item.ipAddress}</TableCell>
                          <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                        
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

export default LoginLogs;
