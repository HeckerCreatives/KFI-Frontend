import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import React from 'react';
import { ellipsisVertical } from 'ionicons/icons';
import { AccessToken, EmergencyLoan } from '../../../../../types/types';
import { jwtDecode } from 'jwt-decode';
import { TData } from '../EmergencyLoan';
import { canDoAction } from '../../../../utils/permissions';
import UpdateEmergencyLoan from '../modals/UpdateEmergencyLoan';
import ViewEmergencyLoan from '../modals/ViewEmergencyLoan';
import DeleteEmergencyLoan from '../modals/DeleteEmergencyLoan';
import PrintEmergencyLoan from '../modals/prints/PrintEmergencyLoan';
import ExportEmergencyLoan from '../modals/prints/ExportEmergencyLoan';
import { Ellipsis } from 'lucide-react';

type EmergencyLoanActionsProps = {
  emergencyLoan: EmergencyLoan;
  setData: React.Dispatch<React.SetStateAction<TData>>;
  getEmergencyLoans: (page: number, keyword?: string, sort?: string, to?: string, from?: string) => {};
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchKey: string;
  sortKey: string;
  to: string;
  from: string;
  rowLength: number;
};

const EmergencyLoanActions = ({ emergencyLoan, setData, getEmergencyLoans, currentPage, setCurrentPage, searchKey, sortKey, to, from, rowLength }: EmergencyLoanActionsProps) => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]')
  const triggerId = `expensevoucher-action-trigger-${emergencyLoan._id}`;



  return (
    <>
          <button
            className=" !p-2 bg-zinc-100 rounded-xl text-zinc-800"
            id={triggerId}
          >
           <Ellipsis size={20}/>
          </button>
    
          <IonPopover
           showBackdrop={false}
           trigger={triggerId}
           triggerAction="click"
           className="[--max-width:12rem] !p-6 !rounded-xl"
         >
           <IonContent class="[--padding-top:0.25rem] [--padding-bottom:0.25rem] !p-6 !rounded-xl">
           <div className=' w-full flex flex-col p-4'>
             <p className=' text-sm text-zinc-400 mb-2'>Actions</p>
              {canDoAction(token.role, permissions, 'emergency loan', 'visible') && <ViewEmergencyLoan emergencyLoan={emergencyLoan} />}
                {canDoAction(token.role, permissions, 'emergency loan', 'update') && <UpdateEmergencyLoan emergencyLoan={emergencyLoan} setData={setData} currentPage={currentPage} getEmergencyLoans={getEmergencyLoans} />}
                {canDoAction(token.role, permissions, 'emergency loan', 'delete') && (
                  <DeleteEmergencyLoan
                    emergencyLoan={emergencyLoan}
                    getEmergencyLoans={getEmergencyLoans}
                    searchkey={searchKey}
                    sortKey={sortKey}
                    currentPage={currentPage}
                    rowLength={rowLength}
                  />
                )}
                {canDoAction(token.role, permissions, 'emergency loan', 'print') && <PrintEmergencyLoan emergencyLoan={emergencyLoan} />}
                {canDoAction(token.role, permissions, 'emergency loan', 'export') && <ExportEmergencyLoan emergencyLoan={emergencyLoan} />}
              </div>
              </IonContent>
            </IonPopover>
            </>


  );
};

export default EmergencyLoanActions;
