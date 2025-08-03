import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../../ui/table/Table';
import { useIonToast } from '@ionic/react';
import kfiAxios from '../../../../utils/axios';
import TableLoadingRow from '../../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../../ui/forms/TableNoRows';
import ViewRecentMember from '../modals/ViewRecentMember';

export type Member = {
  name: string;
  address: string;
  city: string;
  zipCode: string;
  mobileNo: string;
  telNo: string;
  birthdate: string;
  birthplace: string;
  age: number;
  sex: string;
  parent: string;
  spouse: string;
  civilStatus: string;
  position: string;
  memberStatus: string;
  center: { centerNo: string; description: string };
  acctOfficer: string;
  dateRelease: string;
  business: { type: string };
  acctNumber: string;
  dateResigned: string;
  reason: string;
  children: { name: string }[];
  beneficiaries: { name: string }[];
};
export type TRecentMember = {
  clients: Member[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

const RecentMembers = () => {
  const [present] = useIonToast();

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [data, setData] = useState<TRecentMember>({
    clients: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });

  const getRecentMembers = async (page: number) => {
    setData(prev => ({ ...prev, loading: true }));
    try {
      const result = await kfiAxios.get('/statistics/recent-members');
      const { success, customers } = result.data;
      if (success) {
        setData(prev => ({ ...prev, clients: customers }));
        setCurrentPage(page);
        return;
      }
    } catch (error) {
      present({
        message: 'Failed to get recent members records. Please try again',
        duration: 1000,
      });
    } finally {
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    getRecentMembers(currentPage);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="relative overflow-auto flex-1">
        <Table>
          <TableHeader>
            <TableHeadRow className="bg-white !border-0 [&>th]:uppercase">
              <TableHead className=" text-orange-700 !font-[600]">Name</TableHead>
              <TableHead className="text-center  text-orange-700 !font-[600]">Center</TableHead>
              <TableHead className="text-center  text-orange-700 !font-[600]">Actions</TableHead>
            </TableHeadRow>
          </TableHeader>
          <TableBody>
            {data.loading && <TableLoadingRow colspan={3} />}
            {!data.loading && data.clients.length < 1 && <TableNoRows label="No Recent Member Found" colspan={3} />}
            {!data.loading &&
              data.clients.length > 0 &&
              data.clients.map((client: Member, i: number) => (
                <TableRow key={`${client.name}-${i}`} className="!border-0 odd:bg-orange-50 [&>td]:text-[0.8rem]">
                  <TableCell className="">{client.name}</TableCell>
                  <TableCell className="text-center">
                    {client.center.centerNo} - {client.center.description}
                  </TableCell>
                  <TableCell className="text-center">
                    <ViewRecentMember member={client} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RecentMembers;
