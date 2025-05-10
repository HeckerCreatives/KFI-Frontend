import { IonContent, IonItem, IonPage, IonTitle } from '@ionic/react';
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import ClientMasterFileFilter from './components/ClientMasterFileFilter';

const ClientMasterFile = () => {
  return (
    <IonPage>
      <IonContent className="ion-padding" fullscreen>
        <IonTitle className="px-0 font-semibold">Client Master File</IonTitle>
        <div className="mt-2">
          <IonItem routerLink="/client-master-file/new" routerDirection="none">
            + Add Record
          </IonItem>

          <ClientMasterFileFilter />
          <div className="relative overflow-auto">
            <Table>
              <TableHeader>
                <TableHeadRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Account No.</TableHead>
                  <TableHead>Center No.</TableHead>
                  <TableHead>Town/City</TableHead>
                  <TableHead>Actions</TableHead>
                </TableHeadRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Abraham Ganayo</TableCell>
                  <TableCell>KFI02-GS0001-0002</TableCell>
                  <TableCell>0001</TableCell>
                  <TableCell>Los Baños</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ClientMasterFile;
