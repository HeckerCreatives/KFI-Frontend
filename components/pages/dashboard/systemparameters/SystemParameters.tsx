import { IonContent, IonPage, useIonToast, useIonViewWillEnter } from '@ionic/react';
import React, { useState } from 'react';
import PageTitle from '../../../ui/page/PageTitle';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import { Nature as NatureType, TTableFilter } from '../../../../types/types';
import { TABLE_LIMIT } from '../../../utils/constants';
import kfiAxios from '../../../utils/axios';
import TableLoadingRow from '../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../ui/forms/TableNoRows';
import TablePagination from '../../../ui/forms/TablePagination';
import { Signatures } from '../../../ui/common/Signatures';
import UpdateSystemParameters from './modals/UpdateParams';


const SystemParameters = () => {
  const [signatures, setSignatures] = useState<Signatures[]>([])
 

     const getSignatures = async () => {
          try {
            const result = await kfiAxios.get('/system-params/signature');
            const { signatureParams } = result.data;
    
            setSignatures(signatureParams)
           
          } catch (error) {
          } finally {
          }
        };

   

  useIonViewWillEnter(() => {
    getSignatures();
  });

  return (
    <IonPage className=" w-full flex items-center justify-center h-full bg-zinc-100 ">
      <IonContent className="[--background:#f4f4f5] max-w-[1920px] h-full" fullscreen>
        <div className="h-full flex flex-col gap-4 items-stretch justify-start p-4">
          <PageTitle pages={['All Files', 'System Parameters']} />
          <div className="px-3 pb-3 flex-1">
           
           
              <Table>
                <TableHeader>
                  <TableHeadRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Prepared By</TableHead>
                    <TableHead>Checked By</TableHead>
                    <TableHead>Approved By</TableHead>
                    <TableHead>Action</TableHead>
                  </TableHeadRow>
                </TableHeader>
                <TableBody>
                  {signatures.length < 1 && <TableNoRows label="No Nature Record Found" colspan={3} />}
                  {
                    signatures.length > 0 &&
                    signatures.map((item, index) => (
                      <TableRow key={item._id}>
                        <TableCell className=' capitalize'>{item.type}</TableCell>
                        <TableCell>{item.preparedBy}</TableCell>
                        <TableCell>{item.checkedBy}</TableCell>
                        <TableCell>{item.approvedBy}</TableCell>
                        <TableCell>
                          <UpdateSystemParameters signatures={item} fetchData={getSignatures}/>
                        </TableCell>
                      
                      </TableRow>
                    ))}
                </TableBody>
              </Table>


          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SystemParameters;
