import { IonButton, IonCheckbox, IonContent, IonPage, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react';
import PageTitle from '../../../ui/page/PageTitle';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import CreateUser from './modal/CreateUser';
import { TTableFilter, User } from '../../../../types/types';
import { TABLE_LIMIT } from '../../../utils/constants';
import kfiAxios from '../../../utils/axios';
import TablePagination from '../../../ui/forms/TablePagination';
import TableLoadingRow from '../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../ui/forms/TableNoRows';
import UserFilter from './components/UserFilter';
import UserActions from './components/UserActions';
import { formatDateTable } from '../../../utils/date-utils';
import BanUser from './modal/BanUser';
import ManageAccountNav from '../../../ui/navs/ManageAccountNav';
import classNames from 'classnames';

export type TUser = {
  users: User[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const Admin = () => {
  const [present] = useIonToast();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchKey, setSearchKey] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('');
  const [selected, setSelected] = useState<string[]>([]);

  const [data, setData] = useState<TUser>({
    users: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });

  const [statistics, setStatistics] = useState({
    loading: false,
    banned: 0,
    active: 0,
    inactive: 0,
  });

  const getUsers = async (page: number, keyword: string = '', sort: string = '') => {
    setData(prev => ({ ...prev, loading: true }));
    try {
      const filter: TTableFilter = { limit: TABLE_LIMIT, page };
      if (keyword) filter.search = keyword;
      if (sort) filter.sort = sort;
      const result = await kfiAxios.get('/user', { params: filter });
      const { success, users, hasPrevPage, hasNextPage, totalPages } = result.data;
      if (success) {
        setData(prev => ({
          ...prev,
          users: users,
          totalPages: totalPages,
          nextPage: hasNextPage,
          prevPage: hasPrevPage,
        }));
        getStatistics();
        setCurrentPage(page);
        setSearchKey(keyword);
        setSortKey(sort);
        return;
      }
    } catch (error) {
      present({
        message: 'Failed to get user records. Please try again',
        duration: 1000,
      });
    } finally {
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  const getStatistics = async () => {
    try {
      setStatistics(prev => ({ ...prev, loading: true }));
      const result = await kfiAxios.get('/user/statistics');
      const { banned, active, inactive } = result.data;
      setStatistics(prev => ({ ...prev, banned, active, inactive }));
    } catch (error) {
      present({
        message: 'Failed to get user statistics. Please try again',
        duration: 1000,
      });
    } finally {
      setStatistics(prev => ({ ...prev, loading: false }));
    }
  };

  const handlePagination = (page: number) => getUsers(page, searchKey, sortKey);

  useIonViewWillEnter(() => {
    getUsers(currentPage);
  });

  const handleSelected = (e: CustomEvent) => {
    if (e.detail.checked && !selected.includes(e.detail.value)) {
      setSelected(prev => [...prev, e.detail.value]);
    }

    if (!e.detail.checked && selected.includes(e.detail.value)) {
      setSelected(prev => prev.filter(sel => sel !== e.detail.value));
    }
  };

  const refetch = () => getUsers(currentPage, searchKey, sortKey);

  return (
    <IonPage className="">
      <IonContent className="[--background:#F1F1F1]" fullscreen>
        <div className="h-full flex flex-col items-stretch justify-start">
          <div>
            <PageTitle pages={['Manage Account', 'Admin']} />
          </div>
          <div className="px-3 pb-3 pt-2 flex-1 flex flex-col">
            <ManageAccountNav />
            <div className="flex items-center justify-center gap-3 bg-white px-3 py-2 rounded-2xl shadow-lg my-3">
              <div className="flex items-center gap-2">
                <CreateUser getUsers={getUsers} />
                <BanUser selected={selected} setSelected={setSelected} refetch={refetch} banned={statistics.banned} active={statistics.active} />
              </div>
              <UserFilter getUsers={getUsers} />
            </div>
            <div className="px-3 pt-3 pb-5 bg-white rounded-xl flex-1 shadow-lg">
              <div className="relative overflow-auto rounded-xl">
                <Table>
                  <TableHeader>
                    <TableHeadRow>
                      <TableHead className="!min-w-5 !max-w-5" />
                      <TableHead>Username</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableHeadRow>
                  </TableHeader>
                  <TableBody>
                    {data.loading && <TableLoadingRow colspan={5} />}
                    {!data.loading && data.users.length < 1 && <TableNoRows label="No User Account Found" colspan={5} />}
                    {!data.loading &&
                      data.users.length > 0 &&
                      data.users.map((user: User) => (
                        <TableRow key={user._id}>
                          <TableCell className="!min-w-5 !max-w-5">
                            <IonCheckbox value={user._id} onIonChange={handleSelected} />
                          </TableCell>
                          <TableCell>{user.username}</TableCell>
                          <TableCell className="capitalize">
                            <div className={classNames('!font-semibold', user.status === 'banned' ? 'text-red-600' : 'text-green-600')}>{user.status}</div>
                          </TableCell>
                          <TableCell>{formatDateTable(user.createdAt)}</TableCell>
                          <TableCell>
                            <UserActions user={user} setData={setData} />
                          </TableCell>
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

export default Admin;
