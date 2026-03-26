import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../../ui/table/Table';
import { IonButton, IonIcon, IonSelect, IonSelectOption, useIonToast } from '@ionic/react';
import kfiAxios from '../../../../utils/axios';
import TableLoadingRow from '../../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../../ui/forms/TableNoRows';
import ViewRecentMember from '../modals/ViewRecentMember';
import { useForm } from 'react-hook-form';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import SearchInput from '../../../../ui/forms/InputSearch';
import { search } from 'ionicons/icons';

type TSearch = {
  code: string;
};

type Props = {
  setSelected: React.Dispatch<React.SetStateAction<string>>
  selected: string
}


export type Member = {
  createdAt: string
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

const RecentMembers = ({setSelected, selected} : Props) => {
  const [present] = useIonToast();

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [data, setData] = useState<TRecentMember>({
    clients: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });
  const [items, setItems] = useState<string[]>([])
    
  
    const form = useForm<TSearch>({
          defaultValues: {
            code: '',
          },
        });
    
     const code = form.watch('code')

  const getRecentMembers = async (page: number, ) => {
    setData(prev => ({ ...prev, loading: true }));
    try {
      const result = await kfiAxios.get('/statistics/recent-members', {params: {code: code}});
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

  const onSubmit = (data: TSearch) => {
      getRecentMembers(currentPage)
  };
      useEffect(() => {
         const getData = async () => {
  
        try {
          const result = await kfiAxios.get('/statistics/recent-members', {params: {code: code}});
           const { success, customers } = result.data;
          if (success) {
            setItems(customers.map((item: any) => item.name));
          }
        } catch (error) {
          // handle error
        } finally {
        }
      };
  
      const timer = setTimeout(() => {
        getData();
        getRecentMembers(currentPage)
      }, 500);
  
      return () => clearTimeout(timer);
     
    }, [code]);
  

  return (
      <div className=" flex flex-col space-y-2 bg-white rounded-xl shadow-lg">
                           <div className="flex items-center justify-between bg-orange-50 p-4 rounded-t-xl">
                          <div className="min-w-44">
                            <IonSelect
                              aria-label={'no label'}
                              interface="popover"
                              placeholder="Recent Loan"
                              labelPlacement="stacked"
                              className={'!px-3 !py-2.5 border border-zinc-300 rounded-xl [--highlight-color-focused:none] bg-white !text-[0.8rem] !min-h-[1.2rem] min-w-full '}
                              onIonChange={e => setSelected(e.detail.value)}
                              value={selected}
                            >
                              <IonSelectOption value="recent loan" className="h-10 text-xs ![--min-height:1rem] [&>ion-radio]:checked:bg-red-600">
                                Recent Loan
                              </IonSelectOption>
                              <IonSelectOption value="recent member" className="h-18 text-xs ![--min-height:1rem]">
                                Recent Member
                              </IonSelectOption>
                            </IonSelect>
                          </div>

                           <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center flex-wrap lg:justify-end gap-2 ">
                            <div className="flex items-center min-w-20 overflow-visible!">
                              <FormIonItem className="flex-1 overflow-visible!">

                                <SearchInput
                                  name="code"
                                  control={form.control}
                                  clearErrors={form.clearErrors}
                                  // label="Code"
                                  placeholder="Search ..."
                                  className="!px-3 !py-1 rounded-xl"
                                  suggestions={items}
                                />
                              </FormIonItem>
                             
                            </div>
                          </form>
    
                          
                        </div>
                             <div className="relative max-h-[500px] h-full flex flex-col !rounded-xl">
       <div className=' w-full absolute top-0 z-[9]'>
        <Table>
          <TableHeader>
            <TableHeadRow className="bg-white !border-0 [&>th]:uppercase">
              <TableHead className="  !font-[600] bg-zinc-100">Name</TableHead>
              <TableHead className="  !font-[600] bg-zinc-100">Center</TableHead>
              <TableHead className="  !font-[600] bg-zinc-100">Date</TableHead>
              <TableHead className="   !font-[600] bg-zinc-100">Actions</TableHead>
            </TableHeadRow>
           
          </TableHeader>
           <TableBody
                style={{ visibility: 'collapse' }}
            
            >
            {data.loading && <TableLoadingRow colspan={8} />}
            {!data.loading && data.clients.length < 1 && <TableNoRows label="No Record Found" colspan={8} />}
            {!data.loading &&
              data.clients.length > 0 &&
              data.clients.map((client: Member, i: number) => (
                <TableRow key={`${client.name}-${i}`} className="!border-0  [&>td]:text-[0.8rem]">
                  <TableCell className="">{client.name}</TableCell>
                  <TableCell className="">
                    {client.center?.centerNo} - {client.center?.description}
                  </TableCell>
                  <TableCell>{client.createdAt?.split('T')[0] || ''}</TableCell>
                  <TableCell className="">
                    <ViewRecentMember member={client} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
         
        </Table>
      </div>
     <div className="relative max-h-[500px] overflow-auto flex-1 !rounded-xl ">
     
      <Table className=''>
          <TableHeader>
            <TableHeadRow className="bg-white !border-0 [&>th]:uppercase">
              <TableHead className=" text-orange-700 !font-[600]">Name</TableHead>
              <TableHead className="text-center  text-orange-700 !font-[600]">Center</TableHead>
              <TableHead className="  !font-[600] bg-zinc-100">Date</TableHead>

              <TableHead className="text-center  text-orange-700 !font-[600]">Actions</TableHead>
            </TableHeadRow>
          </TableHeader>
          <TableBody>
          {data.loading && <TableLoadingRow colspan={8} />}
            {!data.loading && data.clients.length < 1 && <TableNoRows label="No Record Found" colspan={8} />}
            {!data.loading &&
              data.clients.length > 0 &&
              data.clients.map((client: Member, i: number) => (
                <TableRow key={`${client.name}-${i}`} className="!border-0  [&>td]:text-[0.8rem]">
                  <TableCell className="">{client?.name}</TableCell>
                  <TableCell className="">
                    {client?.center?.centerNo} - {client?.center?.description}
                  </TableCell>
                  <TableCell>{client.createdAt?.split('T')[0] || ''}</TableCell>
                  <TableCell className="">
                    <ViewRecentMember member={client} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
    </div>

    </div>
                          </div>
   
   
  );
};

export default RecentMembers;
