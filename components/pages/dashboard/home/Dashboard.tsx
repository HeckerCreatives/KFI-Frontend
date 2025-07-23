import { IonCol, IonContent, IonGrid, IonIcon, IonPage, IonRow } from '@ionic/react';
import React from 'react';
import PageTitle from '../../../ui/page/PageTitle';
import { cashSharp, peopleSharp, personAddSharp, personRemoveSharp } from 'ionicons/icons';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import DashboardCard from './components/DashboardCard';

const Dashboard = () => {
  const arrDummy: string[] = Array.from(Array(10)).fill('');

  return (
    <IonPage className="">
      <IonContent className="[--background:#F1F1F1]" fullscreen>
        <div className="h-full flex flex-col items-stretch justify-start">
          <PageTitle pages={['Dashboard']} />
          <div className="px-3 pb-3 flex-1">
            <h3 className="px-2 m-0 mt-5 font-semibold text-slate-600 text-[1rem]">Hi, Welcome to KFI</h3>
            <div className="space-y-2">
              <div className="overflow-auto py-2">
                <div className="flex flex-nowrap items-center justify-around gap-2">
                  <DashboardCard title="Total Members" value="9,999,999" icon={peopleSharp} />
                  <DashboardCard title="Total Active Members" value="9,999,999" icon={personAddSharp} />
                  <DashboardCard title="Total Inactive Members" value="9,999,999" icon={personRemoveSharp} />
                  <DashboardCard title="Total Loan Amount" value="9,999,999" icon={cashSharp} />
                </div>
              </div>
              <div className="bg-white shadow-lg rounded-sm px-3 pt-1 pb-2">
                <h3 className="text-[0.9rem] font-semibold border-b pb-2">Loans per Account Officer</h3>
                <div className="relative overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableHeadRow className="bg-white !border-0 [&>th]:uppercase">
                        <TableHead>Account Officer</TableHead>
                        <TableHead className="text-center">Center</TableHead>
                        <TableHead className="text-center">Total Members</TableHead>
                        <TableHead className="text-center">Total Loan Amount</TableHead>
                      </TableHeadRow>
                    </TableHeader>
                    <TableBody>
                      {arrDummy.map((arr: string, i: number) => (
                        <TableRow key={i} className="!border-0 odd:bg-orange-50">
                          <TableCell className="">Bien Daniel</TableCell>
                          <TableCell className="text-center">Binangonan</TableCell>
                          <TableCell className="text-center">523</TableCell>
                          <TableCell className="text-center">5,000,000</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              <div className="flex flex-row flex-wrap h-full items-start gap-2 justify-center">
                <div className="bg-white shadow-lg w-full rounded-sm px-3 pt-1 pb-2 flex-1">
                  <h3 className="text-[0.9rem] font-semibold border-b pb-2">Recent Loan</h3>
                  <div className="relative overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableHeadRow className="bg-white !border-0 [&>th]:uppercase">
                          <TableHead>Name</TableHead>
                          <TableHead className="text-center">Amount</TableHead>
                        </TableHeadRow>
                      </TableHeader>
                      <TableBody>
                        {arrDummy.map((arr: string, i: number) => (
                          <TableRow key={i} className="!border-0 odd:bg-orange-50">
                            <TableCell className="">Bien Daniel</TableCell>
                            <TableCell className="text-center">10,000</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                <div className="bg-white shadow-lg rounded-sm w-full px-3 pt-1 pb-2 flex-1">
                  <h3 className="text-[0.9rem] font-semibold border-b pb-2">Recent Member</h3>
                  <div className="relative overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableHeadRow className="bg-white !border-0 [&>th]:uppercase">
                          <TableHead>Name</TableHead>
                          <TableHead className="text-center">Center</TableHead>
                        </TableHeadRow>
                      </TableHeader>
                      <TableBody>
                        {arrDummy.map((arr: string, i: number) => (
                          <TableRow key={i} className="!border-0 odd:bg-orange-50">
                            <TableCell className="">Bien Daniel</TableCell>
                            <TableCell className="text-center">Binangonan</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
