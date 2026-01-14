import React from 'react';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import InputText from '../../../../ui/forms/InputText';
import { UseFormReturn } from 'react-hook-form';
import InputRadio from '../../../../ui/forms/InputRadio';
import LoanReleaseSelection from '../../../../ui/selections/LoanReleaseSelection';
import { IonIcon } from '@ionic/react';
import { close } from 'ionicons/icons';
import { AccountSetting02Icon, Calendar01Icon, DocumentAttachmentIcon, House01Icon } from 'hugeicons-react';
import BankSelection from '../../../../ui/selections/BankSelection';
import PrintExportBankSelection from '../../../../ui/selections/PrintExportBankSelction';
import { PrintExportFilterFormData } from '../../../../../validations/print-export-schema';
import PrintExportAccountSelection from '../../../../ui/selections/PrintExportCOASelection';

type PrintExportFilterFormProps = {
  loading: boolean;
  form: UseFormReturn<PrintExportFilterFormData>;
  type?: string
};

const PrintExportFilterForm = ({ form, loading, type }: PrintExportFilterFormProps) => {
  const clearDoc = (type: 'from' | 'to') => {
    if (type === 'from') {
      form.setValue('docNoFrom', '');
      form.setValue('docNoFromLabel', '');
      
    }

    if (type === 'to') {
      form.setValue('docNoTo', '');
      form.setValue('docNoToLabel', '');
    }
  };

  const seletedbanks = form.watch('banksSelected')
  const seletedAccounts = form.watch('coaSelected')
  const renderOptions = ['by-document','by-date','by-accounts']


  return (
    <div className="space-y-1 mt-4">
      {type === 'by-document' && (
        <div className="border p-3 rounded-md border-slate-300">
        <h6 className="m-0 mb-1 text-sm !font-semibold flex items-center gap-2">
          <DocumentAttachmentIcon size={25} stroke='.8' className=' p-1 rounded-md bg-green-100 text-green-700'/>
          Document No.</h6>
        <div className="flex flex-col gap-1 flex-wrap">
          <div className="flex items-end flex-wrap gap-2">
            <div className="flex-1 relative">
              <p className=' text-xs'>From</p>

              <FormIonItem className="flex-1">
                <InputText
                  disabled={loading}
                  name="docNoFromLabel"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  // label="From"
                  placeholder="Click find to search from document no."
                  className="!px-2 !py-2 rounded-md"
                  readOnly
                  labelClassName="truncate min-w-10 !text-slate-600 !text-sm text-end !w-5"
                />
              </FormIonItem>
              {form.watch('docNoFrom') && (
                <IonIcon
                  onClick={() => clearDoc('from')}
                  icon={close}
                  className="absolute top-3 right-2 z-50 h-6 w-6 cursor-pointer hover:text-slate-600 text-slate-500 active:text-slate-400"
                />
              )}
            </div>
            <div className="!mb-1.5">
              <LoanReleaseSelection loanReleaseLabel="docNoFromLabel" loanReleaseValue="docNoFrom" clearErrors={form.clearErrors} setValue={form.setValue} />
            </div>
          </div>
          <div className="flex items-end flex-wrap gap-2">
            <div className="flex-1 relative">
              <p className=' text-xs'>To</p>

              <FormIonItem className="flex-1 ">
                <InputText
                  disabled={loading}
                  name="docNoToLabel"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  // label="To"
                  placeholder="Click find to search from document no."
                  className="!px-2 !py-2 rounded-md"
                  readOnly
                  labelClassName="truncate min-w-10 !text-slate-600 !text-sm text-end"
                />
              </FormIonItem>
              {form.watch('docNoTo') && (
                <IonIcon
                  onClick={() => clearDoc('to')}
                  icon={close}
                  className="absolute top-3 right-2 z-50 h-6 w-6 cursor-pointer hover:text-slate-600 text-slate-500 active:text-slate-400"
                />
              )}
            </div>
            <div className=" !mb-1.5">
              <LoanReleaseSelection loanReleaseLabel="docNoToLabel" loanReleaseValue="docNoTo" clearErrors={form.clearErrors} setValue={form.setValue} />
            </div>
          </div>
        </div>
      </div>
      )}

      {type === 'by-date' && (
        <div className="border p-3 rounded-md border-slate-300">
        <h6 className="m-0 mb-1 text-sm !font-semibold flex items-center gap-2">
          <Calendar01Icon size={25} stroke='.8' className=' p-1 rounded-md bg-green-100 text-green-700'/>
          Date</h6>
        <div className="flex flex-col gap-1 flex-wrap">
          <div className="flex items-end flex-wrap gap-2">
            <div className="flex-1 relative">
              <p className=' text-xs'>From</p>

              <FormIonItem className="flex-1">
                <InputText
                  disabled={loading}
                  name="dateFrom"
                  type="date"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  placeholder="Type here"
                  max="9999-12-31"
                  className="!p-2 rounded-md !text-[0.7rem] "
                  labelClassName="truncate min-w-[7.5rem] !text-[0.7rem]  !text-slate-600 text-end"
                  // readOnly
                  
                />
              </FormIonItem>
             
            </div>
          
          </div>
          <div className="flex items-end flex-wrap gap-2">
            <div className="flex-1 relative">
              <p className=' text-xs'>To</p>

              <FormIonItem className="flex-1 ">
                                <InputText
                  disabled={loading}
                  name="dateTo"
                  type="date"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  placeholder="Type here"
                  max="9999-12-31"
                  className="!p-2 rounded-md !text-[0.7rem] "
                  labelClassName="truncate min-w-[7.5rem] !text-[0.7rem]  !text-slate-600 text-end"
                  // readOnly
                  
                />
              </FormIonItem>
             
            </div>
           
          </div>
        </div>
      </div>
      )}

      {type === 'by-bank' && (
        <div className="border p-3 rounded-md border-slate-300">
        <h6 className="m-0 mb-1 text-sm !font-semibold flex items-center gap-2">
          <House01Icon size={25} stroke='.8' className=' p-1 rounded-md bg-green-100 text-green-700'/>
          Select banks</h6>
        <div className="flex flex-col gap-1 flex-wrap">
          <div className="flex items-end flex-wrap gap-2">
            <div className="flex-1 relative">
              <p className=' text-xs'>Selected banks</p>

              <div className=' w-full flex flex-wrap gap-2 my-2'>
                {seletedbanks?.map((item, index) => (
                  <p key={index} className=' text-sm px-4 py-2 bg-zinc-100 rounded-full !font-semibold'>{item.name}</p>
                ))}

                {seletedbanks?.length === 0 && (
                  <p className=' text-xs text-zinc-500 py-4 w-full text-center'>No banks selected.</p>
                )}

              </div>

              <PrintExportBankSelection setValue={form.setValue} clearErrors={form.clearErrors} bankValue='bankIds' bankLabel={'bankLabel' as any} watch={form.watch}/>
             
            </div>
          
          </div>
        
        </div>
      </div>
      )}

       {type === 'by-accounts' && (
        <>
        <div className="border p-3 rounded-md border-slate-300">
        <h6 className="m-0 mb-1 text-sm !font-semibold flex items-center gap-2">
          <AccountSetting02Icon size={25} stroke='.8' className=' p-1 rounded-md bg-green-100 text-green-700'/>
          Select accounts</h6>
        <div className="flex flex-col gap-1 flex-wrap">
          <div className="flex items-end flex-wrap gap-2">
            <div className="flex-1 relative">
              <p className=' text-xs'>Selected accounts</p>

              <div className=' w-full flex flex-wrap gap-2 my-2 max-h-[12rem] overflow-y-auto'>
                {seletedAccounts?.map((item, index) => (
                  <p key={index} className=' text-sm px-4 py-2 bg-zinc-100 rounded-full !font-semibold'>{item.name}</p>
                ))}

                {seletedAccounts?.length === 0 && (
                  <p className=' text-xs text-zinc-500 py-4 w-full text-center'>No accounts selected.</p>
                )}

              </div>

              <PrintExportAccountSelection setValue={form.setValue} clearErrors={form.clearErrors} coaValue='chartOfAccountsIds' coaLabel={'coaLabel' as any} watch={form.watch}/>
             
            </div>
          
          </div>
        
        </div>
      </div>
         <div className="border p-3 rounded-md border-slate-300">
        <h6 className="m-0 mb-1 text-sm !font-semibold flex items-center gap-2">
          <Calendar01Icon size={25} stroke='.8' className=' p-1 rounded-md bg-green-100 text-green-700'/>
          Date</h6>
        <div className="flex flex-col gap-1 flex-wrap">
          <div className="flex items-end flex-wrap gap-2">
            <div className="flex-1 relative">
              <p className=' text-xs'>From</p>

              <FormIonItem className="flex-1">
                <InputText
                  disabled={loading}
                  name="dateFrom"
                  type="date"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  placeholder="Type here"
                  max="9999-12-31"
                  className="!p-2 rounded-md !text-[0.7rem] "
                  labelClassName="truncate min-w-[7.5rem] !text-[0.7rem]  !text-slate-600 text-end"
                  // readOnly
                  
                />
              </FormIonItem>
             
            </div>
          
          </div>
          <div className="flex items-end flex-wrap gap-2">
            <div className="flex-1 relative">
              <p className=' text-xs'>To</p>

              <FormIonItem className="flex-1 ">
                                <InputText
                  disabled={loading}
                  name="dateTo"
                  type="date"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  placeholder="Type here"
                  max="9999-12-31"
                  className="!p-2 rounded-md !text-[0.7rem] "
                  labelClassName="truncate min-w-[7.5rem] !text-[0.7rem]  !text-slate-600 text-end"
                  // readOnly
                  
                />
              </FormIonItem>
             
            </div>
           
          </div>
        </div>
        </div>
        </>
        
      )}

       {(type === 'past-dues' || type === 'aging-of-loans' || type === 'weekly-collections') && (
        <>
      
         <div className="border p-3 rounded-md border-slate-300">
        <h6 className="m-0 mb-1 text-sm !font-semibold flex items-center gap-2">
          <Calendar01Icon size={25} stroke='.8' className=' p-1 rounded-md bg-green-100 text-green-700'/>
          Loan Release Date</h6>
        <div className="flex flex-col gap-1 flex-wrap">
          <div className="flex items-end flex-wrap gap-2">
            <div className="flex-1 relative">
              <p className=' text-xs'>From</p>

              <FormIonItem className="flex-1">
                <InputText
                  disabled={loading}
                  name="loanReleaseDateFrom"
                  type="date"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  placeholder="Type here"
                  max="9999-12-31"
                  className="!p-2 rounded-md !text-[0.7rem] "
                  labelClassName="truncate min-w-[7.5rem] !text-[0.7rem]  !text-slate-600 text-end"
                  // readOnly
                  
                />
              </FormIonItem>
             
            </div>
          
          </div>
          <div className="flex items-end flex-wrap gap-2">
            <div className="flex-1 relative">
              <p className=' text-xs'>To</p>

              <FormIonItem className="flex-1 ">
                                <InputText
                  disabled={loading}
                  name="loanReleaseDateTo"
                  type="date"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  placeholder="Type here"
                  max="9999-12-31"
                  className="!p-2 rounded-md !text-[0.7rem] "
                  labelClassName="truncate min-w-[7.5rem] !text-[0.7rem]  !text-slate-600 text-end"
                  // readOnly
                  
                />
              </FormIonItem>
             
            </div>
           
          </div>
        </div>
        </div>
        </>
        
      )}

      {renderOptions.some((item) => item.includes(type || '')) && (
         <div className="border p-3 rounded-md border-slate-300">
        <h6 className="m-0 mb-2 text-sm !font-semibold">Options</h6>
        <InputRadio
          control={form.control}
          name="option"
          clearErrors={form.clearErrors}
          options={[
            { label: 'Summary', value: 'summary' },
            { label: 'Detailed', value: 'detailed' },
          ]}
        />
      </div>
      )}

     
      
     
    </div>
  );
};

export default PrintExportFilterForm;
