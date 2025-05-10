import { IonAlert, IonIcon } from '@ionic/react';
import { trashBin } from 'ionicons/icons';
import React from 'react';

const DeleteExpenseVoucher = ({ index }: { index: number }) => {
  return (
    <>
      <div
        id={`present-alert-${index}`}
        className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
      >
        <IonIcon icon={trashBin} className="text-[1rem]" /> Delete
      </div>
      <IonAlert
        header="Are you sure you want to delete this record?"
        trigger={`present-alert-${index}`}
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Alert canceled');
            },
          },
          {
            text: 'OK',
            role: 'confirm',
            handler: () => {
              console.log('Alert confirmed');
            },
          },
        ]}
        onDidDismiss={({ detail }) => console.log(`Dismissed with role: ${detail.role}`)}
      ></IonAlert>
    </>
  );
};

export default DeleteExpenseVoucher;
