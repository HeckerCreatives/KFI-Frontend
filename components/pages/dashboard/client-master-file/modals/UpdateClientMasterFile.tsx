import React, { useEffect, useRef, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, IonIcon, useIonToast } from '@ionic/react';
import { useForm } from 'react-hook-form';
import ModalHeader from '../../../../ui/page/ModalHeader';
import CMFPersonalForm from '../components/CMFPersonalForm';
import { ClientMasterFileFormData, clientMasterFileSchema } from '../../../../../validations/client-master-file.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import kfiAxios from '../../../../utils/axios';
import { AccessToken, ClientMasterFile, TErrorData, TFormError } from '../../../../../types/types';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';
import { TClientMasterFile } from '../ClientMasterFile';
import { formatDateInput } from '../../../../utils/date-utils';
import { createSharp } from 'ionicons/icons';
import { jwtDecode } from 'jwt-decode';

type UpdateClientMasterFileProps = {
  client: ClientMasterFile;
  setData: React.Dispatch<React.SetStateAction<TClientMasterFile>>;
};

const UpdateClientMasterFile = ({ client, setData }: UpdateClientMasterFileProps) => {
  const [loading, setLoading] = useState(false);
  const [present] = useIonToast();

  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);

  const modal = useRef<HTMLIonModalElement>(null);

  const form = useForm<ClientMasterFileFormData>({
    resolver: zodResolver(clientMasterFileSchema),
    defaultValues: {
      name: client.name,
      address: client.address,
      city: client.city,
      zipCode: client.zipCode,
      telNo: client.telNo,
      mobileNo: client.mobileNo,
      birthdate: formatDateInput(client.birthdate),
      birthplace: client.birthplace,
      age: `${client.age}`,
      sex: client.sex,
      spouse: client.spouse,
      civilStatus: client.civilStatus,
      parent: client.parent,
      memberStatus: client.memberStatus,
      center: client.center._id,
      centerLabel: client.center.centerNo,
      acctOfficer: client.acctOfficer,
      dateRelease: formatDateInput(client.dateRelease),
      business: client.business._id,
      businessLabel: client.business.type,
      position: client.position,
      acctNumber: client.acctNumber,
      dateResigned: client.dateResigned ? formatDateInput(client.dateResigned) : '',
      reason: client.reason,
      beneficiary: [{ name: '', relationship: '' }],
      children: [{ name: '' }],
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
        birthdate: formatDateInput(client.birthdate),
        birthplace: client.birthplace,
        age: `${client.age}`,
        sex: client.sex,
        spouse: client.spouse,
        civilStatus: client.civilStatus,
        parent: client.parent,
        memberStatus: client.memberStatus,
        memberStatusLabel: client.memberStatus,
        center: client.center._id,
        centerLabel: client.center.centerNo,
        acctOfficer: client.acctOfficer,
        dateRelease: formatDateInput(client.dateRelease),
        business: client.business._id,
        businessLabel: client.business.type,
        position: client.position,
        acctNumber: client.acctNumber,
        dateResigned: client.dateResigned ? formatDateInput(client.dateResigned) : '',
        reason: client.reason,
        beneficiary: client.beneficiaries.length > 1 ? client.beneficiaries : [{ name: '', relationship: '' }],
        children: client.children.length > 1 ? client.children : [{ name: '' }],
      });
    }
  }, [client, form]);

  function dismiss() {
    form.reset();
    modal.current?.dismiss();
  }

  async function onSubmit(data: ClientMasterFileFormData) {
    setLoading(true);
    try {
      const result = await kfiAxios.put(`/customer/${client._id}`, data);
      const { success } = result.data;
      if (success) {
        setData(prev => {
          let clone = [...prev.clients];
          let index = clone.findIndex(e => e._id === result.data.customer._id);
          clone[index] = { ...result.data.customer };
          return { ...prev, clients: clone };
        });
        dismiss();
        present({
          message: 'Client successfully updated!.',
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
  }

  return (
    <>
      {/* <div className="text-end">
        <div
          id={`update-cmf-modal-${client._id}`}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={createSharp} className="text-[1rem]" /> Edit
        </div>
      </div> */}
      <IonButton
        type="button"
        id={`update-cmf-modal-${client._id}`}
        fill="clear"
        className="space-x-1 rounded-lg w-16 h-6 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  bg-[#ff9a00] text-slate-700 capitalize min-h-4 text-xs"
      >
        <IonIcon icon={createSharp} className="text-xs" />
        <span>Edit</span>
      </IonButton>
      <IonModal
        ref={modal}
        trigger={`update-cmf-modal-${client._id}`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:95%] lg:[--width:95%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="Client - Edit Record" sub="Manage Account" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content !px-0">
          {/* <div className="px-2 text-end">
            {canDoAction(token.role, token.permissions, 'clients', 'visible') && (
              <>
                <ViewBeneficiaries client={client} setData={setData} />
                <ViewChildrens client={client} setData={setData} />
              </>
            )}
          </div> */}
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CMFPersonalForm form={form} loading={loading} />
            {form.formState.errors.root && <div className="text-sm text-red-600 italic text-center">{form.formState.errors.root.message}</div>}
            <div className="text-end border-t mt-2 pt-1 space-x-2 px-3">
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
