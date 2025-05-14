import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical } from 'ionicons/icons';
import UpdateBank from '../modals/UpdateBank';
import DeleteBank from '../modals/DeleteBank';
import { Bank } from '../../../../../types/types';
import { TBank } from '../Bank';

type BankActionsProps = {
  bank: Bank;
  setData: React.Dispatch<React.SetStateAction<TBank>>;
  getBanks: (page: number, keyword?: string, sort?: string) => {};
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchKey: string;
  sortKey: string;
  rowLength: number;
};

const BankActions = ({ bank, setData, currentPage, setCurrentPage, getBanks, searchKey, sortKey, rowLength }: BankActionsProps) => {
  return (
    <>
      <IonButton fill="clear" id={`bank-${bank._id}`} className="[--padding-start:0] [--padding-end:0] [--padding-top:0] [--padding-bottom:0] min-h-5">
        <IonIcon icon={ellipsisVertical} className="text-[#FA6C2F]" />
      </IonButton>
      <IonPopover showBackdrop={false} trigger={`bank-${bank._id}`} triggerAction="click" className="[--max-width:10rem]">
        <IonContent>
          <UpdateBank bank={bank} setData={setData} />
          <DeleteBank bank={bank} getBanks={getBanks} searchkey={searchKey} sortKey={sortKey} currentPage={currentPage} rowLength={rowLength} />
        </IonContent>
      </IonPopover>
    </>
  );
};

export default BankActions;
