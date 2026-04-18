import { IonButton, IonCheckbox, IonContent, IonPage, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import PageTitle from '../../../ui/page/PageTitle';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import CreateUser from './modal/CreateUser';
import { AccessToken, TTableFilter, User } from '../../../../types/types';
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
import DashboardCard from '../home/components/DashboardCard';
import { UserMultiple02Icon, UserBlock01Icon, UserMinus01Icon } from 'hugeicons-react';
import { jwtDecode } from 'jwt-decode';
import { canDoAction } from '../../../utils/permissions';
import { useOnlineStore } from '../../../../store/onlineStore';
import { db } from '../../../../database/db';
import { Circle, Dot } from 'lucide-react';
import Paginations from '../../../ui/common/PaginationsV2';
import { SortableTableHeader } from '../../../ui/table/SortableTableHeader';

export type TUser = {
  users: User[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const SORTS = {
  USER_ASC: 'user-asc',
  USER_DESC: 'user-desc',
  NAME_ASC: 'name-asc',
  NAME_DESC: 'name-desc',
  CREATED_ASC: 'created-asc',
  CREATED_DESC: 'created-desc',
}

const Admin = () => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
    const permissions = JSON.parse(localStorage.getItem('permissions') || '[]')
  const [present] = useIonToast();
  const online = useOnlineStore((state) => state.online);
  

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchKey, setSearchKey] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('name-asc');
  const [usernameSort, setUsernameSort] = useState<string>('asc');
  const [statusSort, setStatusSort] = useState<string>('asc');
  const [createdSort, setCreatedSort] = useState<string>('asc');
  const [status, setStatus] = useState<string>('');
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

  const getUsers = async (page: number, keyword: string = '', sort: string = 'name-asc', status: string = '') => {
    setData(prev => ({ ...prev, loading: true }));
   if(online){
     try {
      const filter: TTableFilter = { limit: TABLE_LIMIT, page };
      if (keyword) filter.search = keyword;
      if (sort) filter.sort = sort;
      if (status) filter.status = status
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
   } else {
     setData(prev => ({ ...prev, loading: true }));
              
                  try {
                    const limit = TABLE_LIMIT;
              
                    let data = await db.users.toArray();
                    console.log(data)
                    const filteredData = data.filter(e => !e.deletedAt);
                    let allData =  filteredData
              
                    const totalItems = allData.length;
                    const totalPages = Math.ceil(totalItems / limit);
              
                    const start = (page - 1) * limit;
                    const end = start + limit;
              
                    const finalData = allData.slice(start, end);
              
                    const hasPrevPage = page > 1;
                    const hasNextPage = page < totalPages;
              
                    setData(prev => ({
                      ...prev,
                      users: finalData,
                      totalPages,
                      prevPage: hasPrevPage,
                      nextPage: hasNextPage,
                    }));
      
              
                    setCurrentPage(page);
                    setSearchKey(keyword);
                    setSortKey(sort);
                  } catch (error) {
                    present({
                      message: 'Failed to load records.',
                      duration: 1000,
                    });
                  } finally {
                    setData(prev => ({ ...prev, loading: false }));
                  }
   }
  };

  const getStatistics = async () => {
    if (online){
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
    }
   
  };

  const handlePagination = (page: number) => getUsers(page, searchKey, sortKey, status);

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

  const refetch = () => getUsers(currentPage, searchKey,sortKey, status);

  useEffect(() => {
    refetch()
  },[sortKey])


  return (
    <IonPage className=" w-full flex items-center justify-center h-screen bg-zinc-100 overflow-y-auto ">
      <IonContent className="[--background:#f4f4f5] max-w-[1920px] h-full" fullscreen>
        <div className="h-full flex flex-col gap-4 items-stretch justify-start p-4">

          <div className=' space-y-1'>
              {/* <PageTitle pages={['Dashboard']} /> */}
              <p className=' text-xl text-gray-700 !font-medium'>Manage Account</p>
              <p className=' text-sm text-gray-500 '>Manage user and members accounts.</p>

            </div>
            <ManageAccountNav />

           <div className="w-full grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
            <DashboardCard title="Active" value={`${statistics.active}`} icon={<UserMultiple02Icon stroke='.8' size={25}/>} />
            <DashboardCard title="Banned" value={`${statistics.banned}`} icon={<UserBlock01Icon stroke='.8' size={25}/>} />
            {/* <DashboardCard title="Inactive" value={`${statistics.inactive}`} icon={<UserMinus01Icon stroke='.8' size={20}/>} /> */}

           </div>
          <div className=" flex-1 flex flex-col gap-4">
           

            
            <div className="relative px-3 pt-3 pb-16 bg-white rounded-xl flex-1 shadow-lg">

               <div className="flex md:flex-row flex-col items-center justify-center gap-3">
              <div className=' w-fit flex items-center flex-wrap gap-1'>
                {canDoAction(token.role, permissions,'admin', 'create') && (
                <CreateUser getUsers={getUsers} />
                )}
                {canDoAction(token.role, permissions,'admin', 'update') && (
                  <BanUser selected={selected} setSelected={setSelected} refetch={refetch} banned={statistics.banned} active={statistics.active} />
                )}
              </div>
              <UserFilter getUsers={getUsers} setStatus={setStatus} />
            </div>



             
              <div className="relative rounded-xl mt-2 h-fit w-full overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableHeadRow>
                      <TableHead className="!min-w-5 !max-w-5" />
                      <TableHead>
                        <SortableTableHeader 
                          label="Name"
                          sortKey="name"
                          currentSort={sortKey}
                          ascValue={SORTS.NAME_ASC}
                          descValue={SORTS.NAME_DESC}
                          onSort={setSortKey}
                        />
                      </TableHead>
                      <TableHead>
                        <SortableTableHeader 
                          label="Username"
                          sortKey="user"
                          currentSort={sortKey}
                          ascValue={SORTS.USER_ASC}
                          descValue={SORTS.USER_DESC}
                          onSort={setSortKey}
                        />
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>
                        <SortableTableHeader 
                          label="Created At"
                          sortKey="created"
                          currentSort={sortKey}
                          ascValue={SORTS.CREATED_ASC}
                          descValue={SORTS.CREATED_DESC}
                          onSort={setSortKey}
                        />
                      </TableHead>
                      <TableHead>Actions</TableHead>
                    </TableHeadRow>
                  </TableHeader>
                  <TableBody>
                    {data.loading && <TableLoadingRow colspan={12} />}
                    {!data.loading && data.users.length < 1 && <TableNoRows label="No User Account Found" colspan={5} />}
                    {!data.loading &&
                      data.users.length > 0 &&
                      data.users.map((user: User) => (
                        <TableRow key={user._id}>
                          <TableCell className="!min-w-5 !max-w-5">
                            <IonCheckbox 
                             style={{ '--size': '14px' }} 
                            value={user._id} onIonChange={handleSelected} />
                          </TableCell>
                          <TableCell className=' !text-sm'>{user.name}</TableCell>

                          <TableCell>
                            <div className=' flex items-center gap-1 text-sm'>
                              <div className=' h-10 w-10 rounded-full flex items-center justify-center bg-orange-50 uppercase text-sm font-semibold uppercase'>
                                {user.username.substring(0, 1)}
                              </div>
                              <p>{user.username}</p>

                            </div>
                          </TableCell>
                          <TableCell className="capitalize text-sm">
                            <div className={classNames('!font-medium px-4 py-1 w-fit rounded-full text-sm flex items-center gap-2', user.status === 'banned' ? 'text-red-600 bg-red-50 border border-red-200' : 'text-green-600 bg-green-50 border border-green-200')}>
                              <Circle size={8} fill={user.status === 'active' ? '#16a34a' : '#dc2626'}/>
                              {user.status}</div>
                          </TableCell>
                          <TableCell className=' !text-sm'>{formatDateTable(user.createdAt)}</TableCell>
                          <TableCell>

                            <UserActions key={user._id} user={user} setData={setData} getList={getUsers} />
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>

             {data.users.length !==0 && (
                <Paginations currentPage={currentPage} totalPages={data.totalPages} onPageChange={handlePagination} disabled={data.loading} />

             )}


            </div>

            <div className=' w-full !h-[300px]'>

          </div>


          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Admin;
