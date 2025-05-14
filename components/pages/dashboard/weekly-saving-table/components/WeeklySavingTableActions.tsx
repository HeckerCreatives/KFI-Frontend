import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical } from 'ionicons/icons';
import UpdateWeeklySavingTable from '../modals/UpdateWeeklySavingTable';
import DeleteWeeklySavingTable from '../modals/DeleteWeeklySavingTable';
import { WeeklySavings } from '../../../../../types/types';
import { TWeeklySavingsTable } from '../WeeklySavingTable';

type WeeklySavingTableActionsProps = {
  saving: WeeklySavings;
  setData: React.Dispatch<React.SetStateAction<TWeeklySavingsTable>>;
  getWeeklySavings: (page: number, keyword?: string, sort?: string) => {};
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchKey: string;
  sortKey: string;
  rowLength: number;
};

const WeeklySavingTableActions = ({ saving, setData, getWeeklySavings, currentPage, setCurrentPage, searchKey, sortKey, rowLength }: WeeklySavingTableActionsProps) => {
  return (
    <>
      <IonButton fill="clear" id={`wst-${saving._id}`} className="[--padding-start:0] [--padding-end:0] [--padding-top:0] [--padding-bottom:0] min-h-5">
        <IonIcon icon={ellipsisVertical} className="text-[#FA6C2F]" />
      </IonButton>
      <IonPopover showBackdrop={false} trigger={`wst-${saving._id}`} triggerAction="click" className="[--max-width:10rem]">
        <IonContent>
          <UpdateWeeklySavingTable saving={saving} setData={setData} />
          <DeleteWeeklySavingTable saving={saving} getWeeklySavings={getWeeklySavings} searchkey={searchKey} sortKey={sortKey} currentPage={currentPage} rowLength={rowLength} />
        </IonContent>
      </IonPopover>
    </>
  );
};

export default WeeklySavingTableActions;
