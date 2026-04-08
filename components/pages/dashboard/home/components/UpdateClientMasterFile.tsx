import React, { useEffect, useRef, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, IonIcon, useIonToast, IonItem } from '@ionic/react';
import { useForm } from 'react-hook-form';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { ClientMasterFileFormData, clientMasterFileSchema } from '../../../../../validations/client-master-file.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import kfiAxios from '../../../../utils/axios';
import { AccessToken, ClientMasterFile, TErrorData, TFormError } from '../../../../../types/types';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';
import { formatDateInput } from '../../../../utils/date-utils';
import { createSharp } from 'ionicons/icons';
import { jwtDecode } from 'jwt-decode';
import classNames from 'classnames';
import { useOnlineStore } from '../../../../../store/onlineStore';
import { db } from '../../../../../database/db';
import { Edit } from 'lucide-react';
import { TClientMasterFile } from '../../client-master-file/ClientMasterFile';
import CMFPersonalForm from './CMFPersonalForm';

type UpdateClientMasterFileProps = {
  client: ClientMasterFile;
};

const UpdateClientMasterFile = ({ client }: UpdateClientMasterFileProps) => {
  const [loading, setLoading] = useState(false);
  const [present] = useIonToast();

  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);

  const modal = useRef<HTMLIonModalElement>(null);
  const online = useOnlineStore((state) => state.online);
  

  const form = useForm<ClientMasterFileFormData>({
    resolver: zodResolver(clientMasterFileSchema),
    defaultValues: {
      name: client.name,
      address: client.address,
      city: client.city,
      zipCode: client.zipCode,
      telNo: client.telNo,
      mobileNo: client.mobileNo,
      birthdate: client?.birthdate?.split('T')[0] || '',
      birthplace: client.birthplace,
      age: `${client.age}`,
      sex: client.sex,
      spouse: client.spouse,
      civilStatus: client.civilStatus,
      parent: client.parent,
      memberStatus: client.memberStatus,
      center: client.center?._id,
      centerLabel: client.center?.centerNo,
      acctOfficer: client.acctOfficer,
      dateRelease: client.dateRelease ? formatDateInput(client.dateRelease) : '' ,
      business: client.business?._id,
      businessLabel: client.business?.type,
      position: client.position,
      acctNumber: client.acctNumber,
      dateResigned: client.dateResigned ? formatDateInput(client.dateResigned) : '',
      reason: client.reason,
      beneficiary: [{ name: '' }],
      children: [{ name: '' }],
      clientImage: client.image?.path,
      bankAccountNo: client.bankAccountNo
    },
  });

  useEffect(() => {
    if (client) {
      form.reset({
       name: client.name,
      address: client.address,
      city: client.city,
      zipCode: client.zipCode,
      telNo: client.telNo,
      mobileNo: client.mobileNo,
      birthdate: client?.birthdate?.split('T')[0] || '',
      birthplace: client.birthplace,
      age: `${client.age}`,
      sex: client.sex,
      spouse: client.spouse,
      civilStatus: client.civilStatus,
      parent: client.parent,
      memberStatus: client.memberStatus,
      memberStatusLabel: client.memberStatus,
      center: client.center?._id,
      centerLabel: client.center?.centerNo,
      acctOfficer: client.acctOfficer,
      dateRelease: client.dateRelease ? formatDateInput(client.dateRelease) : '' ,
      business: client.business?._id,
      businessLabel: client.business?.type,
      position: client.position,
      acctNumber: client.acctNumber,
      dateResigned: client.dateResigned ? formatDateInput(client.dateResigned) : '',
      reason: client.reason,
      clientImage: client.image?.path,
      bankAccountNo: client.bankAccountNo,
      children: client.children,
      beneficiary: client.beneficiaries,




      });
    }
  }, [client, form]);

  function dismiss() {
    form.reset();
    modal.current?.dismiss();
    form.setValue('clientImage', '')
  }

  async function onSubmit(data: ClientMasterFileFormData) {
  setLoading(true);

  if (online) {
    // ONLINE UPDATE
    try {
      const result = await kfiAxios.put(`/customer/${client.id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { success } = result.data;

      if (success) {
      

        dismiss();
        present({
          message: "Client successfully updated!.",
          duration: 1000,
        });
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
    // OFFLINE UPDATE
    try {

      console.log(client._id)
      const existing = await db.clientMasterFile.get(client._id);
      

      if (!existing) {
        console.warn("Client not found.");
        setLoading(false);
        return;
      }

      await db.clientMasterFile.update(client._id, {
          ...existing.data,
          ...data,
          business: {
            type: data.businessLabel,
            _id: data.business
           },
           center:{
            centerNo: data.centerLabel,
            _id: data.center
           },
           beneficiaries: data.beneficiary,
           action: existing.isOldData ? 'update' : 'create',
            _synced: false,

      });


      dismiss();
      present({
        message: "Client record updated.",
        duration: 1200,
      });

    } catch (err) {
      console.error("Offline edit failed:", err);
    } finally {
      setLoading(false);
    }
  }
}


  return (
    <>
     
      <IonButton
        type="button"
        id={`update-cmf-modal-${client._id}`}
        fill="clear"
        className=" capitalize text-sm !text-white w-fit btn-color !rounded-lg"
      >
        <Edit size={20} className=' mr-1'/>
        <span>Edit</span>
      </IonButton>
      <IonModal
        ref={modal}
        trigger={`update-cmf-modal-${client._id}`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height [--max-width:74rem] [--width:100%]"
      >
        
        <div className="inner-content !p-6">
         
            <ModalHeader disabled={loading} title="Client - Edit Record" sub="Manage client record." dismiss={dismiss} />


          <form onSubmit={form.handleSubmit(onSubmit) }>
            <CMFPersonalForm form={form} loading={loading} />
            {form.formState.errors.root && <div className="text-sm text-red-600 italic text-center">{form.formState.errors.root.message}</div>}
            <div className="text-end mt-8 space-x-2 px-3">
              <IonButton disabled={loading} type="submit" fill="clear" className="!text-sm capitalize !bg-[#FA6C2F] text-white rounded-[4px]" strong={true}>
                {loading ? 'Saving...' : 'Save'}
              </IonButton>
              <IonButton disabled={loading} onClick={dismiss} color="danger" type="button" className="!text-sm capitalize" strong={true}>
                Cancel
              </IonButton>
            </div>
          </form>
        </div>
      </IonModal>
    </>
  );
};

export default UpdateClientMasterFile;
