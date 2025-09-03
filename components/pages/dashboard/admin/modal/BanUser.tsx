import { IonButton, IonHeader, IonIcon, IonModal, IonToolbar, useIonToast } from '@ionic/react';
import React, { useState } from 'react';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { useForm } from 'react-hook-form';
import { BanFormData, banSchema } from '../../../../../validations/ban.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import InputSelect from '../../../../ui/forms/InputSelect';
import kfiAxios from '../../../../utils/axios';
import { ban } from 'ionicons/icons';

type BanUserProps = {
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
  refetch: () => void;
  banned: number;
  active: number;
};

const BanUser = ({ selected, setSelected, refetch, banned, active }: BanUserProps) => {
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
        present({
          message: 'Status successfully changed!.',
          duration: 1000,
        });
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
        {/* <IonButton onClick={handleOpen} fill="clear" className="max-h-10 min-h-6 bg-red-600 text-white capitalize font-semibold rounded-md" strong>
          <IonIcon icon={ban} className="text-sm" />
          &nbsp;Ban({banned}) / Activate({active})
        </IonButton> */}

        <IonButton onClick={handleOpen} fill="clear" className="max-h-10 min-h-6 bg-red-600 text-white capitalize font-semibold rounded-md" strong>
          <IonIcon icon={ban} className="text-sm" />
          &nbsp; Active / Ban 
        </IonButton>
      </div>
      <IonModal
        isOpen={isOpen}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height [--max-width:35rem] [--width:95%]"
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader disabled={loading} title="User - Ban / Activate Users" sub="Manage Account" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6">

            <ModalHeader disabled={loading} title="User - Ban / Activate Users" sub="Manage user account." dismiss={dismiss} />

          <div className=" mt-6">
            <p className="text-sm">Are you sure, you want to ban/active this user?</p>
            <p className="text-xs text-zinc-500">This action cannot be undone. This will permanently ban the user account.</p>
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
              <div className="text-end mt-6 space-x-2">
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
