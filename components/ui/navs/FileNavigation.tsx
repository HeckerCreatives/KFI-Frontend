import { IonIcon, IonItem, IonLabel, IonMenuToggle } from '@ionic/react';
import React from 'react';
import { NavLink } from '../../../types/types';
import { cellular } from 'ionicons/icons';
import { usePathname } from 'next/navigation';
import classNames from 'classnames';

const FileNavigation = () => {
  const pathname = usePathname();

  const fileLinks: NavLink[] = [
    { path: '/dashboard/chart-of-account', label: 'Chart of Account' },
    { path: '/dashboard/center', label: 'Center' },
    { path: '/dashboard/client-master-file', label: 'Client Master File' },
    // { path: '/dashboard/client-profile', label: 'Client Profile' },
    { path: '/dashboard/loans', label: 'Loans' },
    { path: '/dashboard/bank', label: 'Bank' },
    { path: '/dashboard/weekly-saving-table', label: 'Weekly Saving Table' },
    { path: '/dashboard/supplier', label: 'Supplier' },
    { path: '/dashboard/business-type', label: 'Business Type' },
    // { path: '/dashboard/business-fix', label: 'Business Fix' },
    { path: '/dashboard/nature', label: 'Nature' },
    { path: '/dashboard/group-account', label: 'Group Account' },
  ];

  return (
    <div>
      <h6 className="text-slate-400 text-sm italic px-3 mb-0 mt-1">All Files</h6>
      <div>
        {fileLinks.map((link, i) => (
          <IonMenuToggle key={link.path} autoHide={false}>
            <IonItem
              routerLink={link.path}
              className={classNames(
                '[--padding-start:0] [--min-height:2.25rem] [--border-color:transparent] text-[1rem] space-x-2 text-slate-500 hover:[--color:#FA6C2F]',
                pathname === link.path && '!text-[#fa6c2f]',
              )}
            >
              <div className="flex items-center justify-start gap-2 px-3">
                <IonIcon size="small" icon={cellular} />
                <IonLabel>{link.label}</IonLabel>
              </div>
            </IonItem>
          </IonMenuToggle>
        ))}
      </div>
    </div>
  );
};

export default FileNavigation;
