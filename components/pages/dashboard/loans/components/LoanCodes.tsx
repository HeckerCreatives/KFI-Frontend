import { useFieldArray, UseFormReturn } from 'react-hook-form';
import InputText from '../../../../ui/forms/InputText';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import { ProductLoanFormData } from '../../../../../validations/loan.schema';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../../ui/table/Table';
import { IonButton, IonIcon } from '@ionic/react';
import { arrowBack, arrowForward, trashBin } from 'ionicons/icons';
import InputSelect from '../../../../ui/forms/InputSelect';
import ChartOfAccountSelection from '../../../../ui/selections/ChartOfAccountSelection';
import classNames from 'classnames';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import React from 'react';

const LoanCodes = ({ form, loading }: { form: UseFormReturn<ProductLoanFormData>; loading: boolean }) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `loanCodes`,
  });

  const [page, setPage] = useState(1);
  const limit = 5;



    const handleNextPage = () => {
      if (page !== Math.ceil(fields.length / limit)) {
        setPage(prev => prev + 1);
      }
    };
  
    const handlePrevPage = () => {
      if (page > 0) {
        setPage(prev => prev - 1);
      }
    };
  
  
    const currentPageItems = React.useMemo(() => {
      return fields.slice((page - 1) * limit, page * limit);
    }, [fields, page, limit]);
  

  return (
    <div className="mt-2">
      <div className="mb-2 text-start">
        <IonButton
          onClick={() => append({ module: '', loanType: '', acctCode: '', acctCodeLabel: '', sortOrder: '' })}
          type="button"
          title="Add loan code"
          fill="clear"
          className="max-h-8 min-h-8 btn-color text-white capitalize font-semibold rounded-md m-0"
          strong
        >
          + Loan Code
        </IonButton>
      </div>
      <div className="relative overflow-auto">
        <Table>
          <TableHeader>
            <TableHeadRow className="border-b-0 bg-slate-100">
              <TableHead>Module</TableHead>
              <TableHead className=' '>Loan Type</TableHead>
              <TableHead>Account Code</TableHead>
              <TableHead className="max-w-10">Sort Order</TableHead>
              {fields.length > 1 && <TableHead className="text-center max-w-10">Actions</TableHead>}
            </TableHeadRow>
          </TableHeader>
          <TableBody>
            
            {fields.map((field, index) => (
              
              <TableRow key={`loanCodes-${field.id}`} className="border-b-0">
                <TableCell className="border-4 border-slate-100 align-top">
                  <FormIonItem className="flex-1">
                    <InputSelect
                      disabled={loading}
                      name={`loanCodes.${index}.module`}
                      control={form.control}
                      clearErrors={form.clearErrors}
                      placeholder="Type here"
                      className="!px-2 !py-2 rounded-md !min-w-40"
                      options={[
                        { label: 'LR - Loan Release', value: 'LR' },
                        { label: 'OR - Official Receipt', value: 'OR' },
                      ]}
                    />
                  </FormIonItem>
                </TableCell>
                <TableCell className="border-4 border-slate-100 align-top ">
                  <FormIonItem>
                    <InputSelect
                      disabled={loading}
                      name={`loanCodes.${index}.loanType`}
                      control={form.control}
                      clearErrors={form.clearErrors}
                      placeholder="Loan type"
                      className="!px-2 !py-2 rounded-md !min-w-40"
                      options={[
                        { label: 'OTHER ( For LR )', value: 'OTHER' },
                        { label: 'EDUC - Educational ( For LR & OR )', value: 'EDUC' },
                        { label: 'GRP - Group ( For OR )', value: 'GRP' },
                        { label: 'SEA - Seasonal ( For OR )', value: 'SEA' },
                        { label: 'IND - Individual ( For OR )', value: 'IND' },
                      ]}
                    />
                  </FormIonItem>
                </TableCell>
                <TableCell className="border-4 border-slate-100 align-top">
                  <div className="flex items-center justify-start gap-1">
                    <FormIonItem className="flex-1">
                      <InputText
                        disabled={loading}
                        name={`loanCodes.${index}.acctCodeLabel`}
                        control={form.control}
                        clearErrors={form.clearErrors}
                        placeholder="Account Code"
                        className="!px-2 !py-2 rounded-md !min-w-40"
                        readOnly
                      />
                    </FormIonItem>
                    <div className="">
                      <ChartOfAccountSelection
                        chartOfAccountLabel={`loanCodes.${index}.acctCodeLabel`}
                        chartOfAccountValue={`loanCodes.${index}.acctCode`}
                        setValue={form.setValue}
                        clearErrors={form.clearErrors}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="border-4 border-slate-100 align-top max-w-24 min-w-24">
                  <FormIonItem>
                    <InputText
                      disabled={loading}
                      name={`loanCodes.${index}.sortOrder`}
                      control={form.control}
                      clearErrors={form.clearErrors}
                      placeholder="Sort Order"
                      className="!px-2 !py-2 rounded-md"
                    />
                  </FormIonItem>
                </TableCell>
                {fields.length > 1 && (
                  <TableCell className="border-4 border-slate-100 text-center align-top">
                    <div>
                      <IonButton
                        onClick={() => remove(index)}
                        type="button"
                        title="Remove loan code"
                        fill="clear"
                        className="max-h-8 min-h-8 !p-0 bg-red-600 text-white capitalize font-semibold rounded-md m-0"
                        strong
                      >
                        <IonIcon icon={trashBin} className="text-sm" />
                      </IonButton>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>

       <div className="flex items-center justify-end gap-2 mt-3">
        

         {/* {fields.length > 0 && (
                  <div className="w-full pb-3">
                    <div className="flex items-center justify-center gap-2 py-1 px-5 rounded-md w-fit mx-auto">
                      <div>
                        <IonButton onClick={handlePrevPage} disabled={page === 1} fill="clear" className="max-h-10 min-h-6 h-8 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md">
                          <IonIcon icon={arrowBack} />
                        </IonButton>
                      </div>
                      <div>
                        <div className="text-sm !font-semibold  px-3 py-1.5 rounded-lg text-slate-700">
                          {page} / {Math.ceil(fields.length / limit)}
                        </div>
                      </div>
                      <div>
                        <IonButton
                          onClick={handleNextPage}
                          disabled={page === Math.ceil(fields.length / limit)}
                          fill="clear"
                          className="max-h-10 min-h-6 h-8 bg-[#FA6C2F] text-white capitalize font-semibold rounded-md"
                        >
                          <IonIcon icon={arrowForward} />
                        </IonButton>
                      </div>
                    </div>
                  </div>
                )} */}
      </div>
      </div>
    </div>
  );
};
export default LoanCodes;
