import { IonButtons, IonContent, IonPage, IonTitle } from '@ionic/react';
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import PageTitle from '../../../ui/page/PageTitle';
import CreateCenter from './modals/CreateCenter';
import CenterFilter from './components/CenterFilter';
import CenterActions from './components/CenterActions';

const Center = () => {
  const arrDummy: string[] = Array.from(Array(10)).fill('');

  return (
    <IonPage className="">
      <IonContent className="[--background:#F1F1F1]" fullscreen>
        <div className="h-full flex flex-col items-stretch justify-start">
          <PageTitle pages={['All Files', 'Center']} />
          <div className="px-3 pb-3">
            <div className="flex items-center justify-center gap-3 bg-white px-3 py-2 rounded-2xl shadow-lg mt-3 mb-4">
              <CreateCenter />
              <CenterFilter />
            </div>
            <div className="relative overflow-auto">
              <Table>
                <TableHeader>
                  <TableHeadRow>
                    <TableHead>Center No.</TableHead>
                    <TableHead>Center Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Center Chief</TableHead>
                    <TableHead>Treasurer</TableHead>
                    <TableHead>Account Officer</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableHeadRow>
                </TableHeader>
                <TableBody>
                  {arrDummy.map((arr: string, i: number) => (
                    <TableRow key={i}>
                      <TableCell>1001</TableCell>
                      <TableCell>KELP-Primesource Manpower</TableCell>
                      <TableCell>Mayondon, Los Banos Laguna</TableCell>
                      <TableCell>Juan Dela F. Del...</TableCell>
                      <TableCell>Vanessa Maylyn C. C...</TableCell>
                      <TableCell>Vanessa Maylyn C. C...</TableCell>
                      <TableCell>
                        <CenterActions index={i} />
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

export default Center;
