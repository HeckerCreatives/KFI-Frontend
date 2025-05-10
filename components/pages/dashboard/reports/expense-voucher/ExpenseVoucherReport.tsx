import { IonButton, IonContent, IonPage } from '@ionic/react';
import React, { useState } from 'react';
import EvFilterByDate from './components/EvFilterByDate';
import EvFilterByDocNo from './components/EvFilterByDocNo';
import EvFilterByAccount from './components/EvFilterByAccount';
import EvFilterByBank from './components/EvFilterByBank';
import classNames from 'classnames';
import PageTitle from '../../../../ui/page/PageTitle';

const ExpenseVoucherReport = () => {
  const [active, setActive] = useState('by-date');

  return (
    <IonPage className="">
      <IonContent className="[--background:#F1F1F1]" fullscreen>
        <div className="h-full flex flex-col items-stretch justify-start">
          <PageTitle pages={['Reports', 'Expense Voucher']} />
          <div className="px-3 pb-3">
            <div className="flex items-center justify-center gap-3 bg-white px-3 py-2 rounded-2xl shadow-lg mt-3 mb-4">
              <div className="bg-slate-100 p-3 my-2 flex-1">
                <IonButton
                  type="button"
                  fill="clear"
                  onClick={() => setActive('by-date')}
                  className={classNames(
                    'max-h-10 min-h-6 w-40 bg-white text-black shadow-lg capitalize font-semibold rounded-md',
                    active === 'by-date' && '!bg-[#FA6C2F] !text-white',
                  )}
                  strong
                >
                  By Date
                </IonButton>
                <IonButton
                  type="button"
                  fill="clear"
                  onClick={() => setActive('by-doc-no')}
                  className={classNames(
                    'max-h-10 min-h-6 w-40 bg-white text-black shadow-lg capitalize font-semibold rounded-md',
                    active === 'by-doc-no' && '!bg-[#FA6C2F] !text-white',
                  )}
                  strong
                >
                  By Doc. No.
                </IonButton>
                <IonButton
                  type="button"
                  fill="clear"
                  onClick={() => setActive('by-account')}
                  className={classNames(
                    'max-h-10 min-h-6 w-40 bg-white text-black shadow-lg capitalize font-semibold rounded-md',
                    active === 'by-account' && '!bg-[#FA6C2F] !text-white',
                  )}
                  strong
                >
                  By Account
                </IonButton>
                <IonButton
                  type="button"
                  fill="clear"
                  onClick={() => setActive('by-bank')}
                  className={classNames(
                    'max-h-10 min-h-6 w-40 bg-white text-black shadow-lg capitalize font-semibold rounded-md',
                    active === 'by-bank' && '!bg-[#FA6C2F] !text-white',
                  )}
                  strong
                >
                  By Bank
                </IonButton>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-lg mt-3 mb-4">
              {active === 'by-date' && <EvFilterByDate />}
              {active === 'by-doc-no' && <EvFilterByDocNo />}
              {active === 'by-account' && <EvFilterByAccount />}
              {active === 'by-bank' && <EvFilterByBank />}
            </div>
            <div className="relative overflow-auto bg-white p-3">
              <div className="text-end">
                <IonButton type="button" fill="clear" className="max-h-10 w-32 min-h-6 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
                  Print
                </IonButton>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ExpenseVoucherReport;
