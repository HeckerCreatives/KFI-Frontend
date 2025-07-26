import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import { chevronDownOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import NoChildNav from './NoChildNav';
import { NavLink } from '../../../../types/types';
import WithChildNav from './WithChildNav';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';

const TransactionNav = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const fileLinks: NavLink[] = [
    { path: '/dashboard/loan-release', label: 'Loan Release', resource: 'loan release' },
    {
      path: '',
      label: 'Voucher',
      resource: ['expense voucher', 'journal voucher'],
      children: [
        { path: '/dashboard/expense-voucher', label: 'Expense Voucher', resource: 'expense voucher' },
        { path: '/dashboard/journal-voucher', label: 'Journal Voucher', resource: 'journal voucher' },
      ],
    },
    {
      path: '',
      label: 'Receipt',
      resource: ['acknowledgement', 'release'],
      children: [
        { path: '/dashboard/acknowledgement', label: 'Acknowledgement', resource: 'acknowledgement' },
        { path: '/dashboard/release', label: 'Release', resource: 'release' },
      ],
    },
    { path: '/dashboard/emergency-loan', label: 'Emergency Loan', resource: 'emergency loan' },
    { path: '/dashboard/damayan-fund', label: 'Damayan Fund', resource: 'damayan fund' },
  ];

  return (
    <div>
      <IonButton
        fill="clear"
        className={classNames(
          'min-h-10 border-b-2 text-[0.8rem] capitalize [--padding-start:0] [--padding-end:0] [--padding-bottom:0] [--padding-top:0] !m-0  [--color:black]  [--ripple-color:transparent]',
          isOpen && '!font-semibold',
          fileLinks.map(link => link.path).includes(pathname) ? 'border-slate-600' : 'border-transparent',
        )}
        id="transactions"
        onClick={() => setIsOpen(true)}
      >
        Transactions&nbsp;
        <IonIcon icon={chevronDownOutline} className="text-xs" />
      </IonButton>
      <IonPopover onDidDismiss={() => setIsOpen(false)} showBackdrop={false} trigger="transactions" triggerAction="click" className="[--max-width:12rem]">
        <IonContent class="[--padding-top:0.5rem] [--padding-bottom:0.5rem]">
          {fileLinks.map(link =>
            link.children ? (
              <WithChildNav key={link.label} label={link.label} resource={link.resource} childPaths={link.children} />
            ) : (
              <NoChildNav key={link.label} label={link.label} path={link.path} resource={link.resource} />
            ),
          )}
        </IonContent>
      </IonPopover>
    </div>
  );
};

export default TransactionNav;
