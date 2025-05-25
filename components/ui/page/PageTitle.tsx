import { IonIcon, IonText, IonTitle } from '@ionic/react';
import { caretForward } from 'ionicons/icons';
import React from 'react';

const PageTitle = ({ pages }: { pages: string[] }) => {
  return (
    <IonTitle className="px-0 font-semibold text-sm flex-none bg-desktop h-12 bg-center">
      <div className="flex items-center gap-5 bg-slate-900/40 h-12 px-5">
        {pages.map((page, i) => (
          <div key={page} className="text-white flex items-center gap-3 text-xl font-semibold tracking-widest">
            <IonText>{page}</IonText>
            {pages.length !== i + 1 && <IonIcon icon={caretForward} />}
          </div>
        ))}
      </div>
    </IonTitle>
  );
};

export default PageTitle;
