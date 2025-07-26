import { IonButton, IonContent, IonIcon, IonPopover, IonTitle } from '@ionic/react';
import { chevronDownOutline } from 'ionicons/icons';
import React from 'react';
import TransactionNav from './nav-menu/TransactionNav';
import GeneralLedgerNav from './nav-menu/GeneralLedgerNav';
import SystemNav from './nav-menu/SystemNav';
import Diagnostics from './nav-menu/Diagnostics';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';

const TopNavigation = () => {
  const pathname = usePathname();

  return (
    <div className="px-2.5 font-semibold text-sm h-12 border-b-slate-200 border-b">
      <div className="flex items-center justify-start gap-5 px-2 h-full">
        <div>
          <IonButton
            fill="clear"
            routerLink="/dashboard/home"
            className={classNames(
              'min-h-6 text-[0.8rem] capitalize [--padding-start:1rem] [--padding-end:1rem] rounded-lg [--padding-bottom:0] [--padding-top:0]  [--color:black]  [--ripple-color:transparent]',
              pathname === '/dashboard/home' ? 'bg-orange-600 text-white' : 'bg-transparent',
            )}
          >
            Dashboard
          </IonButton>
        </div>
        <div>
          <IonButton
            fill="clear"
            routerLink="/dashboard/admin"
            className={classNames(
              'min-h-6 text-[0.8rem] capitalize [--padding-start:1rem] [--padding-end:1rem] rounded-lg [--padding-bottom:0] [--padding-top:0]  [--color:black]  [--ripple-color:transparent]',
              ['/dashboard/admin', '/dashboard/client'].includes(pathname) ? 'bg-orange-600 text-white' : 'bg-transparent',
            )}
          >
            Manage Account
          </IonButton>
        </div>
        <TransactionNav />
        <GeneralLedgerNav />
        <SystemNav />
        <Diagnostics />
      </div>
    </div>
  );
};

export default TopNavigation;
