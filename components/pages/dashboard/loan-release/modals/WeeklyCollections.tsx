import React from 'react'
import LoanReleaseSelection from '../../../../ui/selections/LoanReleaseSelection'
import { UseFormReturn } from 'react-hook-form';
import { PrintExportFilterFormData } from '../../../../../validations/print-export-schema';
import { House01Icon } from 'hugeicons-react';
import PrintExportBankSelection from '../../../../ui/selections/PrintExportBankSelction';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import InputText from '../../../../ui/forms/InputText';
import CenterSelection from '../../../../ui/selections/CenterSelection';
import LoanReleaseDueDatesSelections from '../../../../ui/selections/LoanReleaseDueDates';
import InputRadio from '../../../../ui/forms/InputRadio';
import InputCheckbox from '../../../../ui/forms/InputCheckbox';


type Props = {
  form: UseFormReturn<PrintExportFilterFormData>;
};


export default function WeeklyCollections({form} : Props) {
  const centerId =form.watch('center')

  console.log(centerId)
  return (
    <div className='flex flex-col'>
      <p className=' mt-4 text-sm !font-semibold'>Center</p>
      <div className="flex items-center gap-2 flex-nowrap">
          <FormIonItem className="flex-1">
            <InputText
              readOnly
              name="centerLabel"
              control={form.control}
              clearErrors={form.clearErrors}
              // label="Center Code"
              placeholder="Click find to search for center code"
              className=" !p-2 rounded-md !text-[0.7rem]"
              labelClassName="truncate min-w-20 !text-[0.7rem] !text-slate-600 text-end"
            />
          </FormIonItem>
          <CenterSelection centerLabel="centerLabel" centerValue="center" clearErrors={form.clearErrors} setValue={form.setValue} className="text-xs" />
        </div>

      <p className=' mt-2 text-sm !font-semibold'>Loan Release</p>
      <div className="flex items-end gap-2 flex-nowrap w-full">
          <FormIonItem className=" flex gap-2 w-full">
            <div className=' flex flex-col gap-1 w-full'>
              <p className=' text-xs'>Date</p>
              <InputText
                name="loanReleaseDate"
                control={form.control}
                clearErrors={form.clearErrors}
                // label="Center Code"
                type='date'
                placeholder="Click find to search for center code"
                className=" !p-2 rounded-md !text-[0.7rem]"
                labelClassName="truncate min-w-20 !text-[0.7rem] !text-slate-600 text-end"
              />
            </div>
             <div className=' flex flex-col gap-1 w-full'>
              <p className=' text-xs'>Due Date</p>
              <InputText
                name="loanReleaseDueDate"
                control={form.control}
                clearErrors={form.clearErrors}
                // label="Center Code"
                type='date'
                placeholder="Click find to search for center code"
                className=" !p-2 rounded-md !text-[0.7rem]"
                labelClassName="truncate min-w-20 !text-[0.7rem] !text-slate-600 text-end"
              />
            </div>
            
            
          </FormIonItem>
          <LoanReleaseDueDatesSelections center='center' centerId={centerId || ''} setValue={form.setValue} clearErrors={form.clearErrors} loanReleaseDate='loanReleaseDate' loanReleaseDueDate='loanReleaseDueDate' weekNo='weekNo' />
        </div>

      <div className="flex items-end gap-2 flex-nowrap w-full mt-2">
          <FormIonItem className=" flex gap-2 w-full">
            <div className=' flex flex-col gap-1 w-full'>
              <p className=' text-xs'>Week No.</p>
              <InputText
                name="weekNo"
                control={form.control}
                clearErrors={form.clearErrors}
                // label="Center Code"
                type='number'
                placeholder="Type here"
                className=" !p-2 rounded-md !text-[0.7rem]"
                labelClassName="truncate min-w-20 !text-[0.7rem] !text-slate-600 text-end"
              />
            </div>
           
          </FormIonItem>
        
        </div>

        <div className="border p-3 rounded-md border-slate-300 mt-2 space-y-2">
         <div className=' w-full flex gap-2 '>
            <InputCheckbox
                control={form.control}
                name="multi"
                className=' !w-4'
              />
            <p className=' text-xs !w-full'>Multi</p>
          </div>
           <InputRadio
             control={form.control}
             name="type"
             clearErrors={form.clearErrors}
             options={[
               { label: 'Based on Actual OR.', value: 'actual-or' },
               { label: 'Based on Projection', value: 'projection' },
             ]}
           />
         </div>

        <div className="border p-3 rounded-md border-slate-300 mt-2">
           <h6 className="m-0 mb-2 text-sm !font-semibold">Format</h6>
           <InputRadio
             control={form.control}
             name="format"
             clearErrors={form.clearErrors}
             options={[
               { label: 'No CBU', value: 'no-cbu' },
               { label: 'Include Gross CBU Only', value: 'include-gross-cbu' },
             ]}
           />
         </div>

         <div className="border p-3 rounded-md border-slate-300 mt-2">
           <h6 className="m-0 mb-2 text-sm !font-semibold">Previous Balance Basis</h6>
           <InputRadio
             control={form.control}
             name="balance"
             clearErrors={form.clearErrors}
             options={[
               { label: 'As of Selected Week', value: 'selected-week' },
               { label: 'Current Balance', value: 'current-balance' },
             ]}
           />
         </div>

        
       
        
    </div>
  )
}
