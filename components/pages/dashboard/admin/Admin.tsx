import { IonContent, IonPage, useIonToast, useIonViewWillEnter } from '@ionic/react';
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

  const [data, setData] = useState<TUser>({
    users: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
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

  const handlePagination = (page: number) => getUsers(page, searchKey, sortKey);

  useIonViewWillEnter(() => {
    getUsers(currentPage);
  });

  return (
    <IonPage className="">
      <IonContent className="[--background:#F1F1F1]" fullscreen>
        <div className="h-full flex flex-col items-stretch justify-start">
          <PageTitle pages={['Manage Account', 'Admin']} />
          <div className="px-3 pb-3 flex-1">
            <div className="flex items-center justify-center gap-3 bg-white px-3 py-2 rounded-2xl shadow-lg mt-3 mb-4">
              <CreateUser getUsers={getUsers} />
              <UserFilter getUsers={getUsers} />
            </div>
            <div className="relative overflow-auto">
              <Table>
                <TableHeader>
                  <TableHeadRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableHeadRow>
                </TableHeader>
                <TableBody>
                  {data.loading && <TableLoadingRow colspan={3} />}
                  {!data.loading && data.users.length < 1 && <TableNoRows label="No User Account Found" colspan={3} />}
                  {!data.loading &&
                    data.users.length > 0 &&
                    data.users.map((user: User) => (
                      <TableRow key={user._id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>
                          <UserActions user={user} setData={setData} />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <TablePagination currentPage={currentPage} totalPages={data.totalPages} onPageChange={handlePagination} disabled={data.loading} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Admin;
