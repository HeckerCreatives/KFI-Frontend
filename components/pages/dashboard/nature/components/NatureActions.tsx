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
    < div className=' flex items-center gap-2'>
     
          <UpdateNature nature={nature} setData={setData} />
          <DeleteNature nature={nature} getNatures={getNatures} searchkey={searchKey} sortKey={sortKey} currentPage={currentPage} rowLength={rowLength} />
        
    </ div>
  );
};

export default NatureActions;
