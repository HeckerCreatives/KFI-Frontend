import { IonButton, IonContent, IonPage } from '@ionic/react';
import React from 'react';
import PageTitle from '../../../../ui/page/PageTitle';
import LRVORReportFilter from './components/LRVORReportFilter';

const LoanReleaseVsOrReport = () => {
  return (
    <IonPage className="">
      <IonContent className="[--background:#F1F1F1]" fullscreen>
        <div className="h-full flex flex-col items-stretch justify-start">
          <PageTitle pages={['Reports', 'Loan Release vs O.R.']} />
          <div className="px-3 pb-3">
            <div className="flex items-center justify-center gap-3 bg-white px-3 py-2 rounded-2xl shadow-lg mt-3 mb-4">
              <LRVORReportFilter />
            </div>
            <div className="relative overflow-auto bg-white p-3">
              <div className="text-end">
                <IonButton type="button" fill="clear" className="max-h-10 min-h-6 w-32 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
                  Print
                </IonButton>
              </div>
              <div>{/* REPORT PREVIEW */}</div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoanReleaseVsOrReport;
