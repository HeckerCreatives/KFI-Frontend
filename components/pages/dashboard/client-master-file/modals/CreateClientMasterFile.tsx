import React, { useEffect, useRef, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar } from '@ionic/react';
import { useForm } from 'react-hook-form';
import classNames from 'classnames';
import ModalHeader from '../../../../ui/page/ModalHeader';
import CMFPersonalForm from '../components/CMFPersonalForm';
import CMFOtherForm from '../components/CMFOtherForm';
import { ClientMasterFileFormData, clientMasterFileSchema } from '../../../../../validations/client-master-file.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import kfiAxios from '../../../../utils/axios';
import { TErrorData, TFormError } from '../../../../../types/types';
import checkError from '../../../../utils/check-error';
import formErrorHandler from '../../../../utils/form-error-handler';

type CreateClientMasterFileProps = {
  getClients: (page: number) => void;
};

const CreateClientMasterFile = ({ getClients }: CreateClientMasterFileProps) => {
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState('personal');

  const modal = useRef<HTMLIonModalElement>(null);

  const form = useForm<ClientMasterFileFormData>({
    resolver: zodResolver(clientMasterFileSchema),
    defaultValues: {
      name: '',
      address: '',
      city: '',
      zipCode: '',
      telNo: '',
      mobileNo: '',
      birthdate: '',
      birthplace: '',
      age: '',
      sex: '',
      spouse: '',
      civilStatus: '',
      parent: '',
      memberStatus: '',
      groupNumber: '',
      center: '',
      acctOfficer: '',
      dateRelease: '',
      business: '',
      position: '',
      acctNumber: '',
      dateResigned: '',
      newStatus: '',
      reason: '',
    },
  });

  function dismiss() {
    form.reset();
    modal.current?.dismiss();
  }

  async function onSubmit(data: ClientMasterFileFormData) {
    setLoading(true);
    try {
      const result = await kfiAxios.post('/customer', data);
      const { success } = result.data;
      if (success) {
        getClients(1);
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
      <div className="text-end lg:mt-1">
        <IonButton fill="clear" id="create-cmf-modal" className="max-h-10 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
          + Add Record
        </IonButton>
      </div>
      <IonModal ref={modal} trigger="create-cmf-modal" backdropDismiss={false} className="auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:70%] lg:[--width:70%]">
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-20">
            <ModalHeader disabled={loading} title="Client Master File - Add Record" sub="Manage Account" dismiss={dismiss} />
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

export default CreateClientMasterFile;
