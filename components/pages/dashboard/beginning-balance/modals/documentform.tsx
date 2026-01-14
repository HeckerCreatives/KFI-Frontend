import React from 'react';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import InputText from '../../../../ui/forms/InputText';
import { UseFormReturn } from 'react-hook-form';
import InputRadio from '../../../../ui/forms/InputRadio';
import { IonIcon } from '@ionic/react';
import { close } from 'ionicons/icons';
import { AccountSetting02Icon, Calendar01Icon, DocumentAttachmentIcon, House01Icon } from 'hugeicons-react';
import { BegBalanceDocumemtFormData } from '../../../../../validations/beginningbalance.schema';

type PrintExportFilterFormProps = {
  loading: boolean;
  form: UseFormReturn<BegBalanceDocumemtFormData>;
  type?: string
};

const PrintExportFilterForm = ({ form, loading, type }: PrintExportFilterFormProps) => {

    console.log(form.watch('year'), form.formState.errors)




  return (
    <div className="space-y-1 mt-4">
      <div className="border p-3 rounded-md border-slate-300">
      
        <div className="flex flex-col gap-1 flex-wrap">
          <div className="flex items-end flex-wrap gap-2">
            <div className="flex-1 relative">
              <p className=' text-xs'>Year</p>

              <FormIonItem className="flex-1">
               <InputText
                  type='number'
                  disabled={loading}
                  name="year"
                  control={form.control}
                  clearErrors={form.clearErrors}
                  placeholder="Type here"
                  className="!px-2 !py-2 rounded-md"
                  max={String(new Date().getFullYear())}
                
                />
              </FormIonItem>
              {/* {form.watch('docNoFrom') && (
                <IonIcon
                  onClick={() => clearDoc('from')}
                  icon={close}
                  className="absolute top-7 right-2 z-50 h-6 w-6 cursor-pointer hover:text-slate-600 text-slate-500 active:text-slate-400"
                />
              )} */}
            </div>
           
          </div>

          <div className="border p-3 rounded-md border-slate-300">
                  <p className=" mb-2 text-sm !font-semibold">Options</p>
                  <InputRadio
                    control={form.control}
                    name="type"
                    disabled={loading}
                    clearErrors={form.clearErrors}
                    options={[
                      { label: 'Print', value: 'print' },
                      { label: 'Export', value: 'export' },
                    ]}
                  />
                </div>
        
        </div>
      </div>

    </div>
  );
};

export default PrintExportFilterForm;
