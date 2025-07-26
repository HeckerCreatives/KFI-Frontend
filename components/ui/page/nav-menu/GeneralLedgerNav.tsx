import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import { chevronDownOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import NoChildNav from './NoChildNav';
import { NavLink } from '../../../../types/types';
import WithChildNav from './WithChildNav';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';

const GeneralLedgerNav = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const fileLinks: NavLink[] = [
    { path: '/dashboard/audit-trail', label: 'Audit Trail', resource: 'audit trail' },
    { path: '/dashboard/financial-statement', label: 'Financial Statement', resource: 'financial statement' },
    { path: '/dashboard/trial-balance', label: 'Trial Balance', resource: 'trial balance' },
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
        id="general-ledgers"
        onClick={() => setIsOpen(true)}
      >
        General Ledgers&nbsp;
        <IonIcon icon={chevronDownOutline} className="text-xs" />
      </IonButton>
      <IonPopover onDidDismiss={() => setIsOpen(false)} showBackdrop={false} trigger="general-ledgers" triggerAction="click" className="[--max-width:12rem]">
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

export default GeneralLedgerNav;
