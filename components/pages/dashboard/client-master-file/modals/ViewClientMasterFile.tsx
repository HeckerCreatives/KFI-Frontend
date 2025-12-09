import { IonButton, IonIcon, IonModal } from '@ionic/react';
import React, { useState } from 'react';
import { eye } from 'ionicons/icons';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { formatDateTable } from '../../../../utils/date-utils';
import { ClientMasterFile } from '../../../../../types/types';
import ViewClientCard from '../components/ViewClientCard';
import { UserAccountIcon, UserSquareIcon } from 'hugeicons-react';

const ViewClientMasterFile = ({ member }: { member: ClientMasterFile }) => {
  const [isOpen, setIsOpen] = useState(false);

  const dismiss = () => setIsOpen(false);

  return (
    <>
      <IonButton
        onClick={() => setIsOpen(true)}
        type="button"
        fill="clear"
        className="space-x-1 rounded-md w-16 h-7 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0] bg-orange-100 text-orange-900 capitalize min-h-4 text-xs"
      >
        <IonIcon icon={eye} className="text-sm" />
        <span>View</span>
      </IonButton>

      <IonModal
        isOpen={isOpen}
        backdropDismiss={false}
        className="[--border-radius:0.5rem] auto-height [--width:95%] [--max-width:95%]"
      >
        <div className="inner-content !p-6 h-full flex flex-col">
          <ModalHeader
            title="Client Information"
            sub="Manage client information."
            dismiss={dismiss}
          />

          <div className="overflow-y-auto pr-2 flex-1 space-y-6 mt-4">

            <div>
              <h3 className="text-sm !font-semibold text-slate-700 mb-3 flex items-center gap-1">
                <UserSquareIcon size={28} stroke='.8' className=' bg-green-50 p-1 rounded-md text-green-600'/>
                Personal Information</h3>

                <div className=' w-fit aspect-square overflow-hidden mb-6'>
                  <img width={100} height={100} src={`https://kfiapi.axcela-ph.com/${member.image?.path}`} alt="" className=''/>
                </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <ViewClientCard label="Name" value={member?.name || ''} />
                <ViewClientCard label="Address" value={member?.address || ''} />
                <ViewClientCard label="City" value={member?.city || ''} />
                <ViewClientCard label="Zip Code" value={member?.zipCode || ''} />
                <ViewClientCard label="Telephone No." value={member?.telNo || ''} />
                <ViewClientCard label="Mobile" value={member?.mobileNo || ''} />
                <ViewClientCard label="Birthdate" value={formatDateTable(member?.birthdate) || ''} />
                <ViewClientCard label="Birthplace" value={member?.birthplace || ''} />
                <ViewClientCard label="Age" value={`${member?.age}` || ''} />
                <ViewClientCard label="Sex" value={member?.sex || ''} />
                <ViewClientCard label="Parent" value={member?.parent || ''} />
                <ViewClientCard label="Spouse" value={member?.spouse || ''} />
              </div>
            </div>

            <div>
               <h3 className="text-sm !font-semibold text-slate-700 mb-3 flex items-center gap-1">
                                <UserAccountIcon size={28} stroke='.8' className=' bg-blue-50 p-1 rounded-md text-blue-600'/>

                Membership Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <ViewClientCard label="Civil Status" value={member?.civilStatus || ''} />
                <ViewClientCard label="Position" value={member?.position || ''} />
                <ViewClientCard label="Member Status" value={member?.memberStatus || ''} />
                <ViewClientCard label="Center" value={`${member?.center.centerNo}` || ''} />
                <ViewClientCard label="Account Officer" value={member?.acctOfficer || ''} />
                <ViewClientCard label="Date Release" value={formatDateTable(member?.dateRelease) || ''} />
                <ViewClientCard label="Business" value={`${member?.business.type}` || ''} />
                <ViewClientCard label="Account Number" value={member?.acctNumber || ''} />
              </div>
            </div>

            <div>
               <h3 className="text-sm !font-semibold text-slate-700 mb-3 flex items-center gap-1">
                <UserSquareIcon size={28} stroke='.8' className=' bg-teal-50 p-1 rounded-md text-teal-600'/>

               Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <ViewClientCard label="Reason" value={member?.reason || ''} />
                <ViewClientCard label="Children" value={member?.children.map(c => c.name).join(', ') || ''} />
                <ViewClientCard label="Beneficiary" value={member?.beneficiaries?.map(b => b.name).join(', ') || ''} />
              </div>
            </div>

          </div>
        </div>
      </IonModal>
    </>
  );
};

export default ViewClientMasterFile;
