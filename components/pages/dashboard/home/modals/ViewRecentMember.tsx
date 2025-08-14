import { IonButton, IonHeader, IonIcon, IonModal, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { eye, eyeOutline } from 'ionicons/icons';
import DetailsCard from '../components/DetailsCard';
import { Member } from '../components/RecentMembers';
import { formatDateTable } from '../../../../utils/date-utils';
import AccountInformation from '../../../../ui/member-details/AccountInformation';
import AccountDetails from '../../../../ui/member-details/AccountDetails';
import OtherDetails from '../../../../ui/member-details/OtherDetails';
import classNames from 'classnames';
import ContactInformation from '../../../../ui/member-details/ContactInformation';

const ViewRecentMember = ({ member }: { member: Member }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState<'personal' | 'account' | 'contact' | 'other'>('personal');

  const dismiss = () => {
    setIsOpen(false);
  };

  return (
    <>
      <IonButton
        onClick={() => setIsOpen(true)}
        type="button"
        fill="clear"
        className="space-x-1 rounded-lg w-16 h-6 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  bg-[#ffe808] text-slate-700 capitalize min-h-4 text-xs"
      >
        <IonIcon icon={eye} className="text-xs" />
        &nbsp;View
      </IonButton>
      <IonModal
        isOpen={isOpen}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:50rem] md:[--width:50rem] lg:[--max-width:50rem] lg:[--width:50rem]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader title="Recent Member Details" sub="System" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content">
          <div className="px-2 py-1">
            <div className="mb-3">
              <h5 className="m-0 !font-semibold text-slate-600">Member Details</h5>
              <p className="m-0 text-sm text-slate-600">Comprehensive member information and account management</p>
            </div>
            <div className="mb-3 flex items-center gap-2">
              <div
                onClick={() => setActive('personal')}
                role="button"
                className={classNames(
                  'text-[0.8rem] border w-fit px-5 py-1 rounded-xl',
                  active === 'personal' ? 'text-orange-600 border-orange-300' : 'text-slate-700  border-slate-400',
                )}
              >
                Account Information
              </div>
              <div
                onClick={() => setActive('account')}
                role="button"
                className={classNames(
                  'text-[0.8rem] border w-fit px-5 py-1 rounded-xl',
                  active === 'account' ? 'text-orange-600 border-orange-300' : 'text-slate-700  border-slate-400',
                )}
              >
                Account Details
              </div>
              <div
                onClick={() => setActive('contact')}
                role="button"
                className={classNames(
                  'text-[0.8rem] border w-fit px-5 py-1 rounded-xl',
                  active === 'contact' ? 'text-orange-600 border-orange-300' : 'text-slate-700  border-slate-400',
                )}
              >
                Contact Information
              </div>
              <div
                onClick={() => setActive('other')}
                role="button"
                className={classNames(
                  'text-[0.8rem] border w-fit px-5 py-1 rounded-xl',
                  active === 'other' ? 'text-orange-600 border-orange-300' : 'text-slate-700  border-slate-400',
                )}
              >
                Other Details
              </div>
            </div>
            <div>
              {active === 'personal' && <AccountInformation member={member} />}
              {active === 'account' && <AccountDetails member={member} />}
              {active === 'contact' && <ContactInformation member={member} />}
              {active === 'other' && <OtherDetails member={member} />}
            </div>
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default ViewRecentMember;
