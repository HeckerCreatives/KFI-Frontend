import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical } from 'ionicons/icons';
import UpdateNature from '../modals/UpdateNature';
import DeleteNature from '../modals/DeleteNature';
import { Nature } from '../../../../../types/types';
import { TNature } from '../Nature';

type NatureActionsProps = {
  nature: Nature;
  setData: React.Dispatch<React.SetStateAction<TNature>>;
  getNatures: (page: number, keyword?: string, sort?: string) => {};
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchKey: string;
  sortKey: string;
  rowLength: number;
};

const NatureActions = ({ nature, setData, currentPage, setCurrentPage, getNatures, searchKey, sortKey, rowLength }: NatureActionsProps) => {
  return (
    <>
      <IonButton fill="clear" id={`nature-${nature._id}`} className="[--padding-start:0] [--padding-end:0] [--padding-top:0] [--padding-bottom:0] min-h-5">
        <IonIcon icon={ellipsisVertical} className="text-[#FA6C2F]" />
      </IonButton>
      <IonPopover showBackdrop={false} trigger={`nature-${nature._id}`} triggerAction="click" className="[--max-width:10rem]">
        <IonContent>
          <UpdateNature nature={nature} setData={setData} />
          <DeleteNature nature={nature} getNatures={getNatures} searchkey={searchKey} sortKey={sortKey} currentPage={currentPage} rowLength={rowLength} />
        </IonContent>
      </IonPopover>
    </>
  );
};

export default NatureActions;
