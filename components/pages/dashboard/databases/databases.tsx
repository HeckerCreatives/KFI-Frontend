import { IonButton, IonContent, IonInput, IonModal, IonPage, useIonToast } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import PageTitle from '../../../ui/page/PageTitle';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../ui/table/Table';
import kfiAxios from '../../../utils/axios';
import TableNoRows from '../../../ui/forms/TableNoRows';
import { Signatures } from '../../../ui/common/Signatures';
import { FileExportIcon, RefreshIcon } from 'hugeicons-react';
import { dropClientMasterFile, syncAR, syncBanks, syncCenters, syncCoa, syncDmayanFund, syncEmergencyLoan, syncExpenseVoucher, syncJournalVoucher, syncLoanCodes, syncLoanProducts, syncLoanRelease, syncNatures, syncOR, syncPaymentSchedules, syncSuppliers, syncSystemParams } from '../../../../database/sync';
import { db } from '../../../../database/db';
import InputText from '../../../ui/forms/InputText';
import ModalHeader from '../../../ui/page/ModalHeader';
import { BackupModalContent } from './backupdata-modal';
import { BackupEntriesModalContent } from './backupdata-entries-modal';


const Databases = () => {
  const [signatures, setSignatures] = useState<Signatures[]>([])
  const [from, setFrom] = useState<any>('')
  const [to, setTo] = useState<any>('')
  const [present] = useIonToast();
  const [backupData, setBackupData] = useState(false)
  const [dataEntries, setDataEntries] = useState(false)
  


  const getClients = async () => {
    const data = await db.banks.toArray();

  };

 

      useEffect(() => {
      const init = async () => {
        await getClients();    // read inserted data
      };

      init();
    }, []);

     const dropDatabase = async () => {
    await db.delete(); 
console.log("Database deleted");
  }




  return (
    <IonPage className=" w-full flex items-center justify-center h-full bg-zinc-100 ">
      <IonContent className="[--background:#f4f4f5] max-w-[1920px] h-full" fullscreen>
        <div className="h-full flex flex-col gap-4 items-stretch justify-start p-4">
          <PageTitle pages={['All Files', 'Databases']} />
          <div className="px-3 pb-3 flex-1">

            <div className=' grid grid-cols-4 gap-6'>
               <div className=' bg-white rounded-md p-4 flex flex-col gap-4 h-fit w-full'>
          <p className=' text-sm !font-bold'>Sync Database</p>
          <IonButton onClick={() => setBackupData(true)} fill="clear" id="export_all_client" className="max-h-10 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
            <RefreshIcon stroke='.8' size={15} className=' mr-2'/>
            Sync
          </IonButton>

           <IonButton onClick={dropDatabase} fill="clear" id="export_all_client" className="max-h-10 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
            <RefreshIcon stroke='.8' size={15} className=' mr-2'/>
            Drop
          </IonButton>

          <IonModal
          isOpen={backupData}
          id='backup-modal'
           onDidDismiss={() => setBackupData(false)}
          className=" [--border-radius:0.7rem] auto-height [--max-width:34rem] [--width:95%]"
          >
            <div className=' p-6'>
             <BackupModalContent
              onClose={() => setBackupData(false)}
            />
            </div>

          </IonModal>

        </div>

        <div className=' bg-white rounded-md p-4 flex flex-col gap-4 w-full'>
          <p className=' text-sm !font-bold'>Sync Data Entries</p>
          <div className=' w-full flex gap-2'>
            <div className=' flex flex-col gap-1 w-full'>
              <p className=' text-xs'>From</p>
              <IonInput value={from} onIonChange={(e) => setFrom(e.target.value)} type='date' placeholder='Date' 
                className={'text-xs !p-2  !bg-white ![--background:white] md:![--padding-bottom:0] ![--padding-top:0] ![--padding-start:0] border border-zinc-300 ![--min-height:0.75rem] !min-h-[0.75rem]'}
              />
            </div>

            <div className=' flex flex-col gap-1 w-full'>
              <p className=' text-xs'>To</p>
              <IonInput value={to} onIonChange={(e) => setTo(e.target.value)} type='date' placeholder='Date' 
               className={'text-xs !p-2  !bg-white ![--background:white] md:![--padding-bottom:0] ![--padding-top:0] ![--padding-start:0] border border-zinc-300 ![--min-height:0.75rem] !min-h-[0.75rem]'}/>
            </div>
            
          </div>
          <IonButton disabled={from === '' && to === ''} onClick={() => setDataEntries(true)} fill="clear" id="export_all_client" className="max-h-10 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
            <RefreshIcon stroke='.8' size={15} className=' mr-2'/>
            Sync
          </IonButton>

           <IonModal
          isOpen={dataEntries}
           onDidDismiss={() => setDataEntries(false)}
          className=" [--border-radius:0.7rem] auto-height [--max-width:34rem] [--width:95%]"
          >
            <div className=' p-6'>
             <BackupEntriesModalContent
              onClose={() => setDataEntries(false)}
              dateFrom={from}
              dateTo={to}
              
            />
            </div>

          </IonModal>

         

        </div>
            </div>
           
           
       

          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

 export default Databases;

