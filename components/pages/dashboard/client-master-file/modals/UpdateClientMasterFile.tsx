import React, { useEffect, useRef, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, IonIcon } from '@ionic/react';
import { useForm } from 'react-hook-form';
import classNames from 'classnames';
import ModalHeader from '../../../../ui/page/ModalHeader';
import CMFPersonalForm from '../components/CMFPersonalForm';
import CMFOtherForm from '../components/CMFOtherForm';
import { ClientMasterFileFormData, clientMasterFileSchema } from '../../../../../validations/client-master-file.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import kfiAxios from '../../../../utils/axios';
import { ClientMasterFile, TErrorData, TFormError } from '../../../../../types/types';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';
import { TClientMasterFile } from '../ClientMasterFile';
import { formatDateInput } from '../../../../utils/date-utils';
import { createSharp } from 'ionicons/icons';

type UpdateClientMasterFileProps = {
  client: ClientMasterFile;
  setData: React.Dispatch<React.SetStateAction<TClientMasterFile>>;
};

const UpdateClientMasterFile = ({ client, setData }: UpdateClientMasterFileProps) => {
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState('personal');

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
      groupNumber: client.groupNumber,
      center: client.center._id,
      acctOfficer: client.acctOfficer,
      dateRelease: formatDateInput(client.dateRelease),
      business: client.business._id,
      position: client.position,
      acctNumber: client.acctNumber,
      dateResigned: formatDateInput(client.dateResigned),
      newStatus: client.newStatus,
      reason: client.reason,
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
        groupNumber: client.groupNumber,
        center: client.center._id,
        acctOfficer: client.acctOfficer,
        dateRelease: formatDateInput(client.dateRelease),
        business: client.business._id,
        position: client.position,
        acctNumber: client.acctNumber,
        dateResigned: formatDateInput(client.dateResigned),
        newStatus: client.newStatus,
        reason: client.reason,
      });
    }
  }, [client, form.reset]);

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
      <div className="text-end">
        <div
          id={`update-cmf-modal-${client._id}`}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={createSharp} className="text-[1rem]" /> Update
        </div>
      </div>
      <IonModal
        ref={modal}
        trigger={`update-cmf-modal-${client._id}`}
        backdropDismiss={false}
        className="auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:70%] lg:[--width:70%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-20">
            <ModalHeader disabled={loading} title="Client Master File - Edit Record" sub="All Actions" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content !px-0">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <div className="bg-slate-100 p-3 my-2">
                <IonButton
                  disabled={loading}
                  type="button"
                  fill="clear"
                  onClick={() => setActive('personal')}
                  className={classNames(
                    'max-h-10 min-h-6 w-40 bg-white text-black shadow-lg capitalize font-semibold rounded-md',
                    active === 'personal' && '!bg-[#FA6C2F] !text-white',
                  )}
                  strong
                >
                  Personal Info
                </IonButton>
                <IonButton
                  disabled={loading}
                  type="button"
                  fill="clear"
                  onClick={() => setActive('other')}
                  className={classNames(
                    'max-h-10 min-h-6 w-40 bg-white text-black shadow-lg capitalize font-semibold rounded-md',
                    active === 'other' && '!bg-[#FA6C2F] !text-white',
                  )}
                  strong
                >
                  Others
                </IonButton>
              </div>
              <div className={classNames(active !== 'personal' && 'hidden')}>
                <CMFPersonalForm form={form} loading={loading} />
              </div>
              <div className={classNames(active !== 'other' && 'hidden')}>
                <CMFOtherForm form={form} loading={loading} />
              </div>
              {form.formState.errors.root && <div className="text-sm text-red-600 italic text-center">{form.formState.errors.root.message}</div>}
              {Object.keys(form.formState.errors).length > 0 && <div className="text-sm text-red-600 italic text-center">Please fill up all required information.</div>}
            </div>
            <div className="text-end border-t mt-2 pt-1 space-x-2 px-3">
              <IonButton disabled={loading} color="tertiary" type="submit" className="!text-sm capitalize" strong={true}>
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
