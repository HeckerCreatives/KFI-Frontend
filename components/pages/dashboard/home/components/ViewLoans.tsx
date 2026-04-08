import { IonButton, IonIcon, IonModal } from '@ionic/react';
import React, { useState } from 'react';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { Eye } from 'lucide-react';


const ViewLoans = ({ item }: { item: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  const dismiss = () => setIsOpen(false);

  return (
    <>
      <IonButton
        onClick={() => setIsOpen(true)}
        type="button"
        fill="clear"
       className=" capitalize text-sm !text-zinc-700 w-fit bg-orange-50"
      >
        <Eye size={20} className=' mr-1'/>
        <span>View</span>
      </IonButton>

      <IonModal
        isOpen={isOpen}
        backdropDismiss={false}
        className="[--border-radius:0.5rem] auto-height [--width:95%] [--max-width:64rem]"
      >
        <div className="inner-content !p-6 h-full flex flex-col">
          <ModalHeader
            title="Loan"
            sub="Manage loan details"
            dismiss={dismiss}
          />

         <div className="overflow-y-auto pr-2 flex-1 space-y-6 mt-4">

        {/* Top metrics */}
        <div className="grid grid-cols-3 gap-2">
            <div className="bg-zinc-50 rounded-lg px-4 py-3">
            <p className="text-xs text-zinc-500 mb-1">Code</p>
            <p className="text-sm font-medium text-zinc-800">{item.code}</p>
            </div>
            <div className="bg-zinc-50 rounded-lg px-4 py-3">
            <p className="text-xs text-zinc-500 mb-1">Type</p>
            <p className="text-sm font-medium text-zinc-800">{item.type}</p>
            </div>
            <div className="bg-zinc-50 rounded-lg px-4 py-3">
            <p className="text-xs text-zinc-500 mb-1">Status</p>
            <span className="inline-block text-xs font-medium px-2 py-1 rounded-md bg-green-100 text-green-700 capitalize">
                {item.status}
            </span>
            </div>
        </div>

        {/* Amount + Weeks */}
        <div className="grid grid-cols-2 gap-2">
            <div className="bg-zinc-50 rounded-lg px-4 py-3">
            <p className="text-xs text-zinc-500 mb-1">Amount</p>
            <p className="text-xl font-medium text-zinc-800">
                ₱{item.amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </p>
            </div>
            <div className="bg-zinc-50 rounded-lg px-4 py-3">
            <p className="text-xs text-zinc-500 mb-1">No. of weeks</p>
            <p className="text-xl font-medium text-zinc-800">
                {item.noOfWeeks} <span className="text-sm font-normal text-zinc-500">weeks</span>
            </p>
            </div>
        </div>

        {/* Details table */}
        <div className="border border-zinc-100 rounded-lg overflow-hidden text-sm">
            {[
            { label: 'Date', value: new Date(item.date).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' }) },
            { label: 'Account period', value: new Date(item.acctYear, item.acctMonth - 1).toLocaleDateString('en-PH', { month: 'long', year: 'numeric' }) },
            { label: 'Center', value: item.center },
            { label: 'Bank', value: item.bank },
            { label: 'Loan ref', value: item.loan },
            { label: 'Encoded by', value: item.encodedBy },
            ].map(({ label, value }, i, arr) => (
            <div key={label} className={`flex px-4 py-2.5 ${i < arr.length - 1 ? 'border-b border-zinc-100' : ''}`}>
                <span className="text-zinc-500 w-2/5">{label}</span>
                <span className={`font-medium ${value ? 'text-zinc-800' : 'text-zinc-300'}`}>
                {value ?? '—'}
                </span>
            </div>
            ))}
        </div>

        </div>
        </div>
      </IonModal>
    </>
  );
};

export default ViewLoans;
