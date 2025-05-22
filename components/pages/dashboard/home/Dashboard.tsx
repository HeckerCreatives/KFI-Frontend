import { IonCol, IonContent, IonGrid, IonIcon, IonPage, IonRow } from '@ionic/react';
import React from 'react';
import PageTitle from '../../../ui/page/PageTitle';
import { cashOutline, peopleOutline, personAddOutline, personCircleOutline, personCircleSharp, personOutline, personRemoveOutline } from 'ionicons/icons';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';

const Dashboard = () => {
  const arrDummy: string[] = Array.from(Array(10)).fill('');

  return (
    <IonPage className="">
      <IonContent className="[--background:#F1F1F1]" fullscreen>
        <div className="h-full flex flex-col items-stretch justify-start">
          <PageTitle pages={['Dashboard']} />
          <div className="px-3 pb-3 flex-1">
            <h3 className="px-2 m-0 mt-5 tracking-widest font-semibold text-slate-600">Hi, Welcome to KFI</h3>
            <div className="space-y-2">
              <div>
                <div className="flex flex-wrap items-center justify-around gap-2">
                  <div className="shadow-lg bg-[#F76B2E] p-4 flex-1 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="text-[1rem] font-semibold text-slate-100 tracking-wider truncate">Total Members</div>
                      <div className="min-w-6 min-h-6 p-2 grid place-items-center rounded-md bg-red-100">
                        <IonIcon icon={peopleOutline} className="text-red-800 min-w-6 max-w-6 max-h-6 min-h-6" />
                      </div>
                    </div>
                    <div className="text-3xl my-3 text-slate-100 font-semibold tracking-widest text-end">9,999,999</div>
                  </div>
                  <div className="shadow-lg bg-[#F76B2E] p-4 flex-1 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="text-[1rem] font-semibold text-slate-100 tracking-wider truncate">Total Active Members</div>
                      <div className="min-w-6 min-h-6 p-2 grid place-items-center rounded-md bg-green-100">
                        <IonIcon icon={personAddOutline} className="text-green-800 min-w-5 max-w-5 max-h-5 min-h-5" />
                      </div>
                    </div>
                    <div className="text-3xl my-3 text-slate-100 font-semibold tracking-widest text-end">9,999,999</div>
                  </div>
                  <div className="shadow-lg bg-[#F76B2E] p-4 flex-1 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="text-[1rem] font-semibold text-slate-100 tracking-wider truncate">Total Inactive Members</div>
                      <div className="min-w-6 min-h-6 p-2 grid place-items-center rounded-md bg-red-100">
                        <IonIcon icon={personRemoveOutline} className="text-red-800 min-w-6 max-w-6 max-h-6 min-h-6" />
                      </div>
                    </div>
                    <div className="text-3xl my-3 text-slate-100 font-semibold tracking-widest text-end">9,999,999</div>
                  </div>

                  <div className="shadow-lg bg-[#F76B2E] p-4 flex-1 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="text-[1rem] font-semibold text-slate-100 tracking-wider truncate">Total Loan Amount</div>
                      <div className="min-w-6 min-h-6 p-2 grid place-items-center rounded-md bg-orange-100">
                        <IonIcon icon={cashOutline} className="text-orange-800 min-w-6 max-w-6 max-h-6 min-h-6" />
                      </div>
                    </div>
                    <div className="text-3xl my-3 text-slate-100 font-semibold tracking-widest text-end">9,999,999</div>
                  </div>
                </div>
              </div>
              <div className="bg-white shadow-lg rounded-sm px-3 pt-1 pb-2">
                <h3 className="text-[1rem] tracking-widest font-semibold border-b pb-2">Loans per Account Officer</h3>
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
                  <h3 className="text-[1rem] tracking-widest font-semibold border-b pb-2">Recent Loan</h3>
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
                  <h3 className="text-[1rem] tracking-widest font-semibold border-b pb-2">Recent Member</h3>
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
