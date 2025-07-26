import { IonIcon, IonText } from '@ionic/react';
import classNames from 'classnames';
import { chevronForwardOutline } from 'ionicons/icons';
import React from 'react';

const PageTitle = ({ pages }: { pages: string[] }) => {
  return (
    <div className="flex items-center gap-3 h-11 px-5 pt-2">
      {pages.map((page, i) => (
        <div key={page} className="text-slate-700 flex items-center gap-4 !text-[0.85rem]">
          <IonText class={classNames(pages.length === i + 1 && '!font-semibold')}>{page}</IonText>
          {pages.length !== i + 1 && <IonIcon icon={chevronForwardOutline} className="text-xs" />}
        </div>
      ))}
    </div>
  );
};

export default PageTitle;
