import { IonContent, IonPage, IonTitle } from '@ionic/react';
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import PageTitle from '../../../ui/page/PageTitle';
import CreateWeeklySavingTable from './modals/CreateWeeklySavingTable';
import WeeklySavingTableFilter from './components/WeeklySavingTableFilter';
import WeeklySavingTableActions from './components/WeeklySavingTableActions';

const WeeklySavingTable = () => {
  const arrDummy: string[] = Array.from(Array(10)).fill('');

  return (
    <IonPage className="">
      <IonContent className="[--background:#F1F1F1]" fullscreen>
        <div className="h-full flex flex-col items-stretch justify-start">
          <PageTitle pages={['All Files', 'Weekly Saving Table']} />
          <div className="px-3 pb-3">
            <div className="flex items-center justify-center gap-3 bg-white px-3 py-2 rounded-2xl shadow-lg mt-3 mb-4">
              <CreateWeeklySavingTable />
              <WeeklySavingTableFilter />
            </div>
            <div className="relative overflow-auto">
              <Table>
                <TableHeader>
                  <TableHeadRow>
                    <TableHead>Range Amount From</TableHead>
                    <TableHead>Range Amount To</TableHead>
                    <TableHead>WSF</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableHeadRow>
                </TableHeader>
                <TableBody>
                  {arrDummy.map((arr: string, i: number) => (
                    <TableRow key={i}>
                      <TableCell>6,000.00</TableCell>
                      <TableCell>10,000.00</TableCell>
                      <TableCell>30.00</TableCell>
                      <TableCell>
                        <WeeklySavingTableActions index={i} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default WeeklySavingTable;
