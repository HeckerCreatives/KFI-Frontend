import { IonContent, IonPage } from '@ionic/react';
import React from 'react';
import PageTitle from '../../../ui/page/PageTitle';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import CreateNature from './modals/CreateNature';
import NatureFilter from './components/NatureFilter';
import NatureActions from './components/NatureActions';

const Nature = () => {
  const arrDummy: string[] = Array.from(Array(10)).fill('');

  return (
    <IonPage className="">
      <IonContent className="[--background:#F1F1F1]" fullscreen>
        <div className="h-full flex flex-col items-stretch justify-start">
          <PageTitle pages={['All Files', 'Nature']} />
          <div className="px-3 pb-3">
            <div className="flex items-center justify-center gap-3 bg-white px-3 py-2 rounded-2xl shadow-lg mt-3 mb-4">
              <CreateNature />
              <NatureFilter />
            </div>
            <div className="relative overflow-auto">
              <Table>
                <TableHeader>
                  <TableHeadRow>
                    <TableHead>Nature</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableHeadRow>
                </TableHeader>
                <TableBody>
                  {arrDummy.map((arr: string, i: number) => (
                    <TableRow key={i}>
                      <TableCell>Nature</TableCell>
                      <TableCell>
                        <NatureActions index={i} />
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

export default Nature;
