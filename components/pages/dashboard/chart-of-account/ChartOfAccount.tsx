import { IonButtons, IonContent, IonIcon, IonItem, IonPage, IonText, IonTitle, useIonAlert } from '@ionic/react';
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import CreateChartOfAccount from './modals/CreateChartOfAccount';
import UpdateChartOfAccount from './modals/UpdateChartOfAccount';
import DeleteChartOfAccount from './modals/DeleteChartOfAccount';
import ChartOfAccountFilter from './components/ChartOfAccountFilter';
import PageTitle from '../../../ui/page/PageTitle';
import ChartOfAccountActions from './components/ChartOfAccountActions';

const ChartOfAccount = () => {
  const arrDummy: string[] = Array.from(Array(10)).fill('');

  return (
    <IonPage className="">
      <IonContent className="[--background:#F1F1F1]" fullscreen>
        <div className="h-full flex flex-col items-stretch justify-start">
          <PageTitle pages={['All Files', 'Chart of Account']} />
          <div className="px-3 pb-3">
            <div className="flex items-center justify-center gap-3 bg-white px-3 py-2 rounded-2xl shadow-lg mt-3 mb-4">
              <CreateChartOfAccount />
              <ChartOfAccountFilter />
            </div>
            <div className="relative overflow-auto">
              <Table>
                <TableHeader>
                  <TableHeadRow>
                    <TableHead>Account Code</TableHead>
                    <TableHead>Account Name</TableHead>
                    <TableHead>Classification</TableHead>
                    <TableHead>Nature of Account</TableHead>
                    <TableHead>Closing Account</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableHeadRow>
                </TableHeader>
                <TableBody>
                  {arrDummy.map((arr: string, i: number) => (
                    <TableRow key={i}>
                      <TableCell>1002</TableCell>
                      <TableCell>Cash on Hand</TableCell>
                      <TableCell>Assets</TableCell>
                      <TableCell>Debit</TableCell>
                      <TableCell>Debit</TableCell>
                      <TableCell>
                        <ChartOfAccountActions index={i} />
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

export default ChartOfAccount;
