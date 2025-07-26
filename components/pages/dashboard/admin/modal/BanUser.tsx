import { IonButton, IonHeader, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useState } from 'react';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { useForm } from 'react-hook-form';
import { BanFormData, banSchema } from '../../../../../validations/ban.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import InputSelect from '../../../../ui/forms/InputSelect';
import kfiAxios from '../../../../utils/axios';

type BanUserProps = {
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
  refetch: () => void;
};

const BanUser = ({ selected, setSelected, refetch }: BanUserProps) => {
  const [present] = useIonToast();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<BanFormData>({
    resolver: zodResolver(banSchema),
    defaultValues: {
      status: '',
    },
  });

  function dismiss() {
    setIsOpen(false);
  }

  const handleOpen = () => {
    if (selected.length < 1) {
      present({ message: 'Please select a user to ban', duration: 1000 });
      return;
    }
    setIsOpen(true);
  };

  const onSubmit = async (data: BanFormData) => {
    setLoading(true);
    const url = data.status === 'ban' ? '/user/ban' : '/user/unbanned';
    try {
      const result = await kfiAxios.put(url, { ids: selected });
      const { success } = result.data;
      if (success) {
        present({
          message: `Successfully ${data.status === 'ban' ? 'banned' : 'activated'}!.`,
          duration: 1000,
        });
        refetch();
        setSelected([]);
        setIsOpen(false);
        form.reset();
        return;
      }
    } catch (error: any) {
      const message = error?.response?.data?.error || error?.response?.data?.msg;
      present({
        message: message || 'Failed to ban the selected users. Please try again',
        duration: 1000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-end">
        <IonButton onClick={handleOpen} fill="clear" className="max-h-10 min-h-6 bg-red-600 text-white capitalize font-semibold rounded-md" strong>
          Ban / Activate
        </IonButton>
      </div>
      <IonModal isOpen={isOpen} backdropDismiss={false} className="auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:50%] lg:[--width:50%]">
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="User - Ban / Activate Users" sub="Manage Account" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content">
          <div className="p-3">
            <p className="text-lg">Are you sure, you want to ban/active this user?</p>
            <p className="text-sm">This action cannot be undone. This will permanently ban the user account.</p>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormIonItem className="w-full max-w-72 min-w-20 mt-3">
                <InputSelect
                  label="Ban/Activate"
                  placeholder="Ban/Activate"
                  name="status"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  options={[
                    { label: 'Ban Users', value: 'ban' },
                    { label: 'Activate Users', value: 'unban' },
                  ]}
                  className="!border-orange-500 rounded-md !w-full !py-1.5"
                  disabled={loading}
                />
              </FormIonItem>
              <div className="text-end border-t mt-2 pt-1 space-x-2">
                <IonButton disabled={loading} type="submit" fill="clear" className="!text-sm capitalize !bg-[#FA6C2F] text-white rounded-[4px]" strong={true}>
                  {loading ? 'Banning...' : 'Yes'}
                </IonButton>
                <IonButton disabled={loading} onClick={dismiss} color="danger" type="button" className="!text-sm capitalize" strong={true}>
                  No
                </IonButton>
              </div>
            </form>
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default BanUser;
