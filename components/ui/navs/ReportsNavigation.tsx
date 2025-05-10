import { IonAccordion, IonIcon, IonItem, IonLabel, IonList, IonMenuToggle } from '@ionic/react';
import { cellular } from 'ionicons/icons';
import React from 'react';
import { NavLink } from '../../../types/types';
import { usePathname } from 'next/navigation';
import classNames from 'classnames';

const ReportsNavigation = () => {
  const pathname = usePathname();

  const fileLinks: NavLink[] = [
    { path: '/dashboard/soa-report', label: 'Statement of Acct.' },
    { path: '/dashboard/cp-report', label: 'Client Profile' },
    { path: '/dashboard/center-report', label: 'Center' },
    { path: '/dashboard/wc-report', label: 'Weekly Collection' },
    { path: '/dashboard/jv-report', label: 'Journal Voucher' },
    { path: '/dashboard/ev-report', label: 'Expense Voucher' },
    { path: '/dashboard/or-report', label: 'Official Receipt' },
    { path: '/dashboard/lr-report', label: 'Loan Release' },
    { path: '/dashboard/df-report', label: 'Damayan Fund' },
    { path: '/dashboard/el-report', label: 'Emergency Loan' },
    { path: '/dashboard/lrvor-report', label: 'Loan Release cs O.R.' },
    { path: '/dashboard/pbd-report', label: 'Porject by Due date' },
  ];

  return (
    <IonAccordion value="reports">
      <IonItem
        slot="header"
        className={classNames(
          '!text-[1rem] space-x-2 text-slate-500 [--padding-start:0.25rem] [--padding-end:0] hover:[--color:#FA6C2F]',
          fileLinks.find((link: NavLink) => pathname === link.path) && '!text-[#fa6c2f]',
        )}
      >
        <IonIcon size="small" icon={cellular} className="!text-inherit" />
        <IonLabel>Reports</IonLabel>
      </IonItem>
      <div className="ion-padding" slot="content">
        <IonList className="p-0">
          {fileLinks.map(link => (
            <IonMenuToggle key={link.path} autoHide={false}>
              <IonItem
                routerLink={link.path}
                className={classNames(
                  '[--padding-start:1rem] [--min-height:2.25rem] [--border-color:transparent] text-[1rem] space-x-2 text-slate-500 hover:[--color:#FA6C2F]',
                  pathname === link.path && '!text-[#fa6c2f]',
                )}
              >
                <IonLabel>{link.label}</IonLabel>
              </IonItem>
            </IonMenuToggle>
          ))}
        </IonList>
      </div>
    </IonAccordion>
  );
};

export default ReportsNavigation;
