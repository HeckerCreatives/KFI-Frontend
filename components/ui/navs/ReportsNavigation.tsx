import { IonAccordion, IonIcon, IonItem, IonLabel, IonList, IonMenuToggle } from '@ionic/react';
import { cellular } from 'ionicons/icons';
import React from 'react';
import { NavLink } from '../../../types/types';
import { usePathname } from 'next/navigation';
import classNames from 'classnames';

const ReportsNavigation = () => {
  const pathname = usePathname();

  return (
    <IonAccordion value="reports">
      <IonItem
        slot="header"
        className={classNames(
          '!text-[1rem] space-x-2 text-slate-500 [--padding-start:0.25rem] [--padding-end:0] hover:[--color:#FA6C2F]',
          // fileLinks.find((link: NavLink) => pathname === link.path) && '!text-[#fa6c2f]',
        )}
      >
        <IonIcon size="small" icon={cellular} className="!text-inherit" />
        <IonLabel>Reports</IonLabel>
      </IonItem>
      <div className="ion-padding" slot="content">
        <IonList className="p-0">
          {/* {fileLinks.map(link => (
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
          ))} */}
        </IonList>
      </div>
    </IonAccordion>
  );
};

export default ReportsNavigation;
