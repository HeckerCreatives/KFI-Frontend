import { IonButton, IonContent, IonIcon, IonPopover } from '@ionic/react';
import { chevronDownOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import NoChildNav from './NoChildNav';
import { NavLink } from '../../../../types/types';
import WithChildNav from './WithChildNav';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';

const Diagnostics = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const fileLinks: NavLink[] = [
    { path: '/dashboard/unbalance-entries', label: 'Unbalance Entries', resource: 'unbalance entries' },
    { path: '/dashboard/login-logs', label: 'Login Logs', resource: 'login logs' },
    { path: '/dashboard/action-logs', label: 'Action Logs', resource: 'action logs' },
  ];

  return (
    <div>
      <IonButton
        fill="clear"
        className={classNames(
          'min-h-6 text-[0.8rem] capitalize [--padding-start:1rem] [--padding-end:1rem] rounded-lg [--padding-bottom:0] [--padding-top:0]  [--color:black]  [--ripple-color:transparent]',
          isOpen && '!font-semibold',
          fileLinks.map(link => link.path).includes(pathname) ? 'bg-orange-600 text-white' : 'bg-transparent',
        )}
        id="diagnostics"
        onClick={() => setIsOpen(true)}
      >
        Diagnostics&nbsp;
        <IonIcon icon={chevronDownOutline} className="text-xs" />
      </IonButton>
      <IonPopover onDidDismiss={() => setIsOpen(false)} showBackdrop={false} trigger="diagnostics" triggerAction="click" className="[--max-width:12rem]">
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

export default Diagnostics;
