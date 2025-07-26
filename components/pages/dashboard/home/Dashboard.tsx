import { IonButton, IonCol, IonContent, IonGrid, IonIcon, IonInput, IonPage, IonRow, IonSelect, IonSelectOption } from '@ionic/react';
import React, { useRef, useState } from 'react';
import PageTitle from '../../../ui/page/PageTitle';
import { cashSharp, peopleSharp, personAddSharp, personRemoveSharp, search } from 'ionicons/icons';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import DashboardCard from './components/DashboardCard';

const Dashboard = () => {
  const arrDummy: string[] = Array.from(Array(10)).fill('');

  const [selected, setSelected] = useState('recent loan');

  return (
    <IonPage className="">
      <IonContent className="[--background:#F1F1F1]" fullscreen>
        <div className="h-full flex flex-col items-stretch justify-start">
          <PageTitle pages={['Dashboard']} />
          <div className="px-3 pb-3 flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              <div className="md:col-span-1 lg:col-span-2">
                <div className="overflow-auto py-2">
                  <div className="flex flex-nowrap items-center justify-around gap-2">
                    <DashboardCard title="Total Members" value="9,999,999" icon={peopleSharp} />
                    <DashboardCard title="Total Active Members" value="9,999,999" icon={personAddSharp} />
                    <DashboardCard title="Total Inactive Members" value="9,999,999" icon={personRemoveSharp} />
                    <DashboardCard title="Total Loan Amount" value="9,999,999" icon={cashSharp} />
                  </div>
                </div>
                <div className="bg-white shadow-lg rounded-sm px-3 pt-1 pb-2">
                  <div className="flex items-center justify-between border-b w-full">
                    <h3 className="text-[0.9rem] font-semibold pb-2">Loans per Account Officer</h3>
                    <div className="flex items-center">
                      <IonInput
                        aria-label={'no label'}
                        placeholder="Recent Loan"
                        labelPlacement="stacked"
                        className={'!border border-slate-400 text-[0.9rem] [--highlight-color-focused:none] rounded-md bg-white !px-2 !py-1 text-sm !min-h-[1.2rem]'}
                      ></IonInput>
                      <div>
                        <IonButton
                          type="submit"
                          fill="clear"
                          className="max-h-10 min-h-[1.8rem] ![--padding-top:0] ![--padding-bottom:0] ![--padding-end:0.4rem] ![--padding-start:0.45rem] bg-[#FA6C2F] text-white capitalize font-semibold rounded-md"
                          strong
                        >
                          <IonIcon icon={search} />
                        </IonButton>
                      </div>
                    </div>
                  </div>
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
              </div>
              <div className="flex flex-col">
                <div className="flex items-center justify-between border-b pt-2 pb-1 ">
                  <div className="min-w-64">
                    <IonSelect
                      aria-label={'no label'}
                      interface="popover"
                      placeholder="Recent Loan"
                      labelPlacement="stacked"
                      className={'!border border-slate-400 [--highlight-color-focused:none] rounded-md bg-white !px-2 !py-2 text-sm !min-h-[1.2rem] min-w-full'}
                      onIonChange={e => setSelected(e.detail.value)}
                      value={selected}
                    >
                      <IonSelectOption value="recent loan" className="text-sm [--min-height:0.5rem]">
                        Recent Loan
                      </IonSelectOption>
                      <IonSelectOption value="recent member" className="text-sm [--min-height:0.5rem]">
                        Recent Member
                      </IonSelectOption>
                    </IonSelect>
                  </div>
                </div>
                <div className="bg-white shadow-lg w-full rounded-sm px-3 pt-1 pb-2 flex-1">
                  {selected === 'recent loan' && (
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
                  )}

                  {selected === 'recent member' && (
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
                  )}
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
