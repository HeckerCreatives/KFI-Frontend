import { IonButton, IonHeader, IonIcon, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import { trashBin } from 'ionicons/icons';
import React, { useRef, useState } from 'react';
import { FinancialStatements, Nature } from '../../../../../types/types';
import kfiAxios from '../../../../utils/axios';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { useOnlineStore } from '../../../../../store/onlineStore';
import { db } from '../../../../../database/db';
import { Trash } from 'lucide-react';

type DeleteNatureProps = {
  item: FinancialStatements;
  getList: (page: number) => void;
  currentPage: number;
};

const DeleteFS = ({item,getList,currentPage }: DeleteNatureProps) => {
  const [present] = useIonToast();
  const [loading, setLoading] = useState(false);

  const modal = useRef<HTMLIonModalElement>(null);
  const online = useOnlineStore((state) => state.online);

  function dismiss() {
    modal.current?.dismiss();
  }

  async function handleDelete() {
      setLoading(true);
     if(online){
       try {
        const result = await kfiAxios.delete(`/financial-statement/${item._id}`);
        const { success } = result.data;
        if (success) {
            getList(currentPage)
            present({
          message: 'Financial Statement successfully deleted. ',
          duration: 1000,
        });
          dismiss();
          return;
        }
      } catch (error: any) {
        present({
          message: 'Failed to delete the financial statement record. Please try again',
          duration: 1000,
        });
      } finally {
        setLoading(false);
      }
     } else {
       if (item._id) {
                   const existing = await db.financialStatements.get(item.id);
        
                 await db.financialStatements.update(item.id, {
                             deletedAt: new Date().toISOString(),
                             entries: existing.entries.map((item: any) => ({
                               ...item,
                               action: 'delete',
                               _synced: false,
                             })),
                             _synced: false,
                             action: "delete",
                           });
              } else {
                await db.financialStatements.delete(item.id);
              }
            getList(currentPage);
            dismiss()
             present({
                  message: 'Data successfully deleted!.',
                  duration: 1000,
                });
             
              
     }
   
  }


  return (
    <>
      
        <IonButton
               id={`delete-fs-modal-${item._id}`}
               type="button"
               fill="clear"
                className=" capitalize text-sm !text-zinc-700 w-fit"
                    >
                  <Trash size={15} className=' mr-1'/> Delete
             </IonButton>
      <IonModal
        ref={modal}
        trigger={`delete-fs-modal-${item._id}`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height [--width:95%] [--max-width:32rem]"
      >
         <div className="p-6 flex flex-col gap-6">
           <ModalHeader disabled={loading} title="Financial Statement - Delete Record" sub="Are you sure you want to delete this record?" dismiss={dismiss} />
          <p className="text-lg text-center py-5">Are you sure you want to delete this record?</p>
          <div className="text-end border-t mt-2 pt-1 space-x-2">
            <IonButton onClick={handleDelete} disabled={loading} color="danger" type="submit" className="!text-sm capitalize" strong={true}>
              {loading ? 'Deleting...' : 'Yes'}
            </IonButton>
            <IonButton disabled={loading} onClick={dismiss} color="tertiary" type="button" className="!text-sm capitalize" strong={true}>
              No
            </IonButton>
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default DeleteFS;
