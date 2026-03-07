import React, { useEffect, useRef, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, useIonToast, IonIcon, useIonViewWillEnter } from '@ionic/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { NatureFormData, natureSchema } from '../../../../../validations/nature.schema';
import kfiAxios from '../../../../utils/axios';
import { FinancialStatements, TErrorData, TFormError } from '../../../../../types/types';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';
import { useOnlineStore } from '../../../../../store/onlineStore';
import { db } from '../../../../../database/db';
import FinancialStatementForm from './tb-form';
import { fschema, FSEntriesFormData, fsentriesschema, FSFormData } from '../../../../../validations/financialstatement.schema';
import { createSharp } from 'ionicons/icons';
import FinancialStatementEntryForm from './entries-form';
import FSFormTable from '../components/entry-table';
import { TBEntriesFormData, tbentriesschema } from '../../../../../validations/trial-balance-schema';

type UpdateProps = {
    item: FinancialStatements
    currentPage: number
    getList: (page: number) => void;
};

const UpdateFSEntries = ({ getList, item, currentPage }: UpdateProps) => {
  const [loading, setLoading] = useState(false);

  const modal = useRef<HTMLIonModalElement>(null);
  const online = useOnlineStore((state) => state.online);
  const [present] = useIonToast();
   const [prevEntries, setPrevEntries] = useState<any[]>([]);
   const [deletedIds, setDeletedIds] = useState<string[]>([]);

   const formattedEntries = item.entries?.map((item) => ({
    ...item,
     _id: item._id,
      line: item.line,
      acctCode: item.acctCode._id,
      acctCodeName: item.acctCode.code,
      acctCodeDescription: item.acctCode.description,
      remarks: item.remarks,
    
   }))

  
  const form = useForm<TBEntriesFormData>({
    resolver: zodResolver(tbentriesschema),
    defaultValues: {
       
        reportCode: item.reportCode,
        reportName: item.reportName,
        title: item.title,
        subTitle: item.subTitle,
        entries: formattedEntries
    },
  });

  useEffect(() => {
    form.reset({
       reportCode: item.reportCode,
        reportName: item.reportName,
        title: item.title,
        subTitle: item.subTitle,
        entries: formattedEntries
    })
  },[item])

  

 

  async function onSubmit(data: TBEntriesFormData) {
      setLoading(true);

      const prevIds = new Set(prevEntries.map((e) => e._id));

        const formattedEntries = data.entries.map((entry, index) => {
            const isExisting = prevIds.has(entry._id);
        return {
             _id: isExisting ? entry._id : undefined,
            line: index + 1,
            acctCode: entry.acctCode,
            remarks: entry.remarks,
        };
        });

       const currentIds = new Set(
        data.entries.map(e => e._id).filter(Boolean)
        );

        const finalDeletedIds: string[] = prevEntries
        .map(e => typeof e === 'string' ? e : e._id)
        .filter(id => !currentIds.has(id));



     if(online){
       try {
        const result = await kfiAxios.post(`/trial-balance/entry/${item._id}`, {...data, entries: formattedEntries, deletedIds: finalDeletedIds});
        const { success } = result.data;
        if (success) {
            getList(currentPage)
             present({
          message: 'Record successfully updated. ',
          duration: 1000,
        });
          dismiss();
          return;
        }
      } catch (error: any) {
        const errs: TErrorData | string = error?.response?.data?.error || error.message;
        const errors: TFormError[] | string = checkError(errs);
        const fields: string[] = Object.keys(form.formState.defaultValues as Object);
        formErrorHandler(errors, form.setError, fields);
      } finally {
        setLoading(false);
      }
     } else {
       try {
                 const existing = await db.trialBalance.get(item.id);
                 if (!existing) {
                   console.warn("Data not found");
                   return;
                 }
                 const updated = {
                   ...existing,
                   ...data, 
                    entries: data.entries.map((item) => ({
                      ...item,
                      acctCode: {
                        _id: item.acctCode,
                        code: item.acctCodeName,
                        description: item.acctCodeDescription,
                      },
                      action: item.action === "delete" ? item.action : item._id ? "update" : "create",
                      _synced: false,
                    })),
                    action: existing.isOldData ? 'update' : 'create',
                    _synced: false,
                 };
          
                 await db.trialBalance.update(item.id, updated);
          
                getList(currentPage)
                 dismiss();
                 present({
                   message: "Data successfully updated!",
                   duration: 1000,
                 });
                setLoading(false)
      
          
               } catch (error) {
                setLoading(false)
                 console.error("Offline update failed:", error);
               }
     }
    
  }



    function dismiss() {
        form.reset();
        modal.current?.dismiss();
    }




  return (
    <>
      <div className="text-start">
        <IonButton fill="clear" id={`edit-tbentries-${item._id}`}
        
       className="space-x-1 rounded-md w-24 min-h-7 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0] bg-purple-100 text-purple-900 capitalize text-xs"
        >
        
                 <IonIcon icon={createSharp} className="text-[1rem] mr-1" /> Entries
        </IonButton>
      </div>
      <IonModal
        ref={modal}
        trigger={`edit-tbentries-${item._id}`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height [--width:95%] [--max-width:64rem]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-20">
            <ModalHeader disabled={loading} title="Nature - Add Record" sub="System" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="p-6 flex flex-col gap-6">
           <ModalHeader disabled={loading} title="Trial Balance - Entries" sub="Manage financial data." dismiss={dismiss} />
          <div>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FinancialStatementEntryForm form={form} loading={loading} />
              <FSFormTable form={form} loading={loading} />
              <div className="text-end border-t mt-2 pt-1 space-x-2">
                <IonButton disabled={loading} color="tertiary" type="submit" className="!text-sm capitalize" strong={true}>
                  {loading ? 'Saving...' : 'Save'}
                </IonButton>
                <IonButton disabled={loading} onClick={dismiss} color="danger" type="button" className="!text-sm capitalize" strong={true}>
                  Cancel
                </IonButton>
              </div>
            </form>
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default UpdateFSEntries;
