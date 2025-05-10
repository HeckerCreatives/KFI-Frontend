import { IonItem } from '@ionic/react';
import classNames from 'classnames';
import React from 'react';

type TProps = {
  className?: string;
  children: React.ReactNode;
};

const FormIonItem = ({ children, className = '' }: TProps) => {
  return (
    <IonItem
      className={classNames(
        '[--border-style:none]  [--background-hover:none] [--ripple-color:transparent] [--padding-start:0] [--inner-padding-end:0] [--background:transparent]',
        className,
      )}
    >
      {children}
    </IonItem>
  );
};

export default FormIonItem;
