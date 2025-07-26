import { IonItem } from '@ionic/react';
import React from 'react';
import { NavLink } from '../../../../types/types';

const NoChildNav = ({ path, label }: NavLink) => {
  return (
    <IonItem
      routerLink={path}
      className="![--background-focused:transparent] ![--min-height:1rem] ![--background:transparent] ![--border-color:transparent] [--padding-start:0] ![--background-hover:transparent] ![--ripple-color:transparent] flex items-center gap-2 text-[0.8rem] text-slate-700 font-semibold hover:bg-slate-200 py-1 mx-2 px-2 rounded-md  cursor-pointer active:bg-slate-200"
    >
      {label}
    </IonItem>
  );
};

export default NoChildNav;
