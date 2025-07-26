import { IonContent, IonIcon, IonPopover } from '@ionic/react';
import { chevronForwardOutline } from 'ionicons/icons';
import React from 'react';
import NoChildNav from './NoChildNav';
import classNames from 'classnames';

type WithChildNavProps = {
  label: string;
  resource: string | string[];
  childPaths: { label: string; path: string; resource: string | string[] }[];
};

const WithChildNav = ({ label, resource, childPaths }: WithChildNavProps) => {
  return (
    <div>
      <div
        role="button"
        className={classNames(
          'flex items-center justify-between gap-2 text-[0.8rem] text-slate-700 hover:bg-slate-200 py-1 mx-2 px-2 rounded-md cursor-pointer active:bg-slate-200',
        )}
        id={`${label}-childPaths`}
      >
        {label}
        <IonIcon icon={chevronForwardOutline} className="text-xs" />
      </div>
      <IonPopover showBackdrop={false} trigger={`${label}-childPaths`} triggerAction="click" alignment="start" side="right" className="![--max-width:12rem]">
        <IonContent class="[--padding-top:0.5rem] [--padding-bottom:0.5rem]">
          {childPaths.map(child => (
            <NoChildNav key={child.path} label={child.label} path={child.path} resource={child.resource} />
          ))}
        </IonContent>
      </IonPopover>
    </div>
  );
};

export default WithChildNav;
