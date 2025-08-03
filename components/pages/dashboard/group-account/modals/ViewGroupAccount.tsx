import React, { useEffect, useRef, useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, IonIcon, useIonToast } from '@ionic/react';
import { createSharp, eye } from 'ionicons/icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalHeader from '../../../../ui/page/ModalHeader';
import GroupAccountForm from '../components/GroupAccountForm';
import { GroupAccountFormData, groupAccountSchema } from '../../../../../validations/group-account.schema';
import { GroupAccount, TErrorData, TFormError } from '../../../../../types/types';
import kfiAxios from '../../../../utils/axios';
import formErrorHandler from '../../../../utils/form-error-handler';
import checkError from '../../../../utils/check-error';
import classNames from 'classnames';

type ViewGroupAccountProps = {
  groupAccount: GroupAccount;
};

const ViewGroupAccount = ({ groupAccount }: ViewGroupAccountProps) => {
  const [loading, setLoading] = useState(false);
  const modal = useRef<HTMLIonModalElement>(null);

  function dismiss() {
    modal.current?.dismiss();
  }

  return (
    <>
      {/* <div className="text-end">
        <div
          id={`update-group-account-modal-${groupAccount._id}`}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={createSharp} className="text-[1rem]" /> Edit
        </div>
      </div> */}
      <IonButton
        id={`view-group-account-modal-${groupAccount._id}`}
        type="button"
        fill="clear"
        className="space-x-1 rounded-lg w-16 h-6 ![--padding-start:0] ![--padding-end:0] ![--padding-top:0] ![--padding-bottom:0]  bg-[#ffe808] text-slate-700 capitalize min-h-4 text-xs"
      >
        <IonIcon icon={eye} className="text-xs" />
        <span>View</span>
      </IonButton>
      <IonModal
        ref={modal}
        trigger={`view-group-account-modal-${groupAccount._id}`}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:30rem] md:[--width:100%] lg:[--max-width:30rem] lg:[--width:50%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-12">
            <ModalHeader title="Group Account - View Record" sub="System" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content">
          <div className="w-full flex items-start gap-2 text-slate-600">
            <div className={classNames('text-slate-600 text-[0.85rem]  font-semibold truncate w-fit')}>Code</div>
            <div className={classNames('border border-slate-400 min-h-8 text-[0.7rem] py-0 px-3 text-sm flex items-center flex-1 rounded-md capitalize')}>{groupAccount.code}</div>
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default ViewGroupAccount;
