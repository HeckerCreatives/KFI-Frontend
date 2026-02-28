import { IonButton, IonCheckbox, IonModal, IonSelect, IonSelectOption } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Search01Icon } from 'hugeicons-react';
import kfiAxios from '../../../../../utils/axios';
import SelectionHeader from '../../../../../ui/selections/SelectionHeader';
import FormIonItem from '../../../../../ui/utils/FormIonItem';
import classNames from 'classnames';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../../../ui/table/Table';
import TableLoadingRow from '../../../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../../../ui/forms/TableNoRows';
import { AcknowledgementFormData } from '../../../../../../validations/acknowledgement.schema';
import { formatDateTable } from '../../../../../utils/date-utils';

type Option = {
  _id: string;
  code?: string;
  cvNo?: string;
  dueDate?: string;
  week?: string | number;
  name?: string;
  centerNo?: string;
  particular?: string;
  acctCodeId?: string;
  acctCode?: string;
  description?: string;
  debit?: string | number;
  credit?: string | number;
  loanReleaseEntryId?: string;
  clientId?: string,
};

export type TAcknowledgement = {
  acknowledgements: Option[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};


type Props = {
  center: string,
  form: UseFormReturn<AcknowledgementFormData>
}


const ORLoadEntries = ({center, form}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dueDateId, setDueDateId] = useState('') 
  const [type, setType] = useState('seasonal') 
  const [duedates, setDuedates] = useState<any[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [data, setData] = useState<TAcknowledgement>({
    acknowledgements: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });

  function dismiss() {
    setIsOpen(false);
  }

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleSearch = async (page: number) => {
    setData(prev => ({ ...prev, loading: true }));
    try {
      const filter: any = { dueDateId: dueDateId, type: type};
      const result = await kfiAxios.get('/acknowledgement/load-entries', { params: filter });
      const { success, acknowledgements, hasPrevPage, hasNextPage, totalPages } = result.data;
      if (success) {
        setData(prev => ({
          ...prev,
          acknowledgements,
          totalPages: totalPages,
          nextPage: hasNextPage,
          prevPage: hasPrevPage,
        }));
        setSelectedIds([]);
        return;
      }
    } catch (error) {
    } finally {
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  const handleDueDates = async () => {
  
      try {
        setLoading(true);
        const result = await kfiAxios.get(`/transaction/due-dates/${center}`);
        const { success, dueDates } = result.data;
    

        setDuedates(dueDates ?? [])
     
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
  

  const mapEntryForForm = (entry: Option) => {
    const particular = entry.particular ?? `${entry.centerNo ? `${entry.centerNo} - ` : ''}${entry.name ?? ''}`.trim();
    return {
      loanReleaseEntryId: entry.loanReleaseEntryId ?? entry._id ?? '',
      cvNo: `${entry.cvNo ?? entry.code ?? ''}`,
      dueDate: entry.dueDate ? formatDateTable(entry.dueDate) : '',
      noOfWeeks: `${entry.week ?? ''}`,
      name: entry.name ?? '',
      particular,
      acctCodeId: entry.acctCodeId ?? '',
      acctCode: entry.acctCode ?? '',
      description: entry.description ?? '',
      debit: `${entry.debit ?? '0'}`,
      credit: `${entry.credit ?? entry.debit ?? '0'}`,
      clientId: entry.clientId ?? ''
    };
  };

  const handleLoadSelected = () => {
    const selectedEntries = data.acknowledgements
      .filter((entry) => selectedIds.includes(entry._id))
      .map(mapEntryForForm);


    form.setValue('entries', selectedEntries, { shouldDirty: true, shouldValidate: true });
    form.clearErrors('entries');
    setSelectedIds([]);
    setData({
      acknowledgements: [],
      loading: false,
      totalPages: 0,
      nextPage: false,
      prevPage: false,
    });
    dismiss();
  };

  const handlePagination = (page: number) => handleSearch(page);
  const allSelected = data.acknowledgements.length > 0 && selectedIds.length === data.acknowledgements.length;


  const toggleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      if (checked) return prev.includes(id) ? prev : [...prev, id];
      return prev.filter((selectedId) => selectedId !== id);
    });
  };

  useEffect(() => {
    if (isOpen) handlePagination(1), handleDueDates();
  }, [isOpen]);

  return (
    <>
      <div className="">
        <IonButton onClick={handleOpen} fill="clear" className={classNames('max-h-9 min-h-9 btn-color text-white capitalize font-semibold rounded-md m-0 text-xs', classNames)} strong>
         Load Entries
        </IonButton>
      </div>
      <IonModal
        isOpen={isOpen}
        backdropDismiss={false}
        className=" [--border-radius:0.35rem] auto-height md:[--max-width:70%] md:[--width:100%] lg:[--max-width:50%] lg:[--width:50%] [--width:95%]"
      >
        
        <div className="inner-content !p-6  border-2 !border-slate-200">
            <SelectionHeader dismiss={dismiss} disabled={loading} title="Official Receipt Selection" />

          <div className="">
            <div className="flex items-center flex-wrap justify-start gap-2">
              <div className="flex items-center min-w-20 gap-2">
             

                   <FormIonItem>

                  <IonSelect
                  placeholder='Due dates'
                  labelPlacement="stacked"
                   interface="popover"
                  value={dueDateId}
                  onIonChange={e => {
                      setDueDateId(e.target.value);
                    }}
                   className={classNames(
                      '!border border-zinc-300 [--highlight-color-focused:none] !px-2 !py-1 text-xs !overflow-y-auto !min-w-[12rem] !max-h-[5rem] !min-h-[0.5rem] ',
                    )}
                    >
                      {duedates.map((item, index) => (
                        <IonSelectOption key={index}  value={item._id} className="text-xs [--min-height:0.5rem]">
                          {item.transaction?.code}
                        </IonSelectOption>
                      ))}
                    </IonSelect>

                    
                  
                  </FormIonItem>


                  <FormIonItem>
                    <IonSelect
                    placeholder='Type'
                    labelPlacement="stacked"
                   interface="popover"
                    value={type}
                      onIonChange={e => {
                      setType(e.detail.value);
                    }}
                    className={classNames(
                        '!border border-zinc-300 [--highlight-color-focused:none] !px-2 !py-1 text-xs !min-h-[0.5rem] !min-w-[12rem]',
                      )}
                      >
                          <IonSelectOption  value={'seasonal'} className="text-xs [--min-height:0.5rem]">
                            Seasonal
                          </IonSelectOption>
                          <IonSelectOption  value={'group'} className="text-xs [--min-height:0.5rem]">
                            Group
                          </IonSelectOption>
                          <IonSelectOption  value={'individual'} className="text-xs [--min-height:0.5rem]">
                            Individual
                          </IonSelectOption>
                    </IonSelect>
                  </FormIonItem>


               

              

                <IonButton
                  disabled={data.loading}
                  onClick={() => handleSearch(1)}
                  type="button"
                  fill="clear"
                  className="max-h-10 min-h-[2rem] bg-[#FA6C2F] text-white capitalize font-semibold rounded-md text-xs"
                  strong
                >
                  <Search01Icon size={15} stroke='.8' className=' mr-1'/>
                  {data.loading ? 'Finding...' : 'Find'}
                </IonButton>
              </div>
            </div>
          </div>
          <div className="relative overflow-auto">
            <Table>
              <TableHeader>
                <TableHeadRow className="border-b-0 bg-slate-100">
                  <TableHead className="!py-2 w-12">
                    <IonCheckbox
                      checked={allSelected}
                      onIonChange={(e) => {
                        if (e.detail.checked) {
                          setSelectedIds(data.acknowledgements.map((item) => item._id));
                          return;
                        }
                        setSelectedIds([]);
                      }}
                    />
                  </TableHead>
                  <TableHead className="!py-2">Cv#</TableHead>
                  <TableHead className="!py-2">Acct. Code</TableHead>
                  <TableHead className="!py-2">Due Date</TableHead>
                </TableHeadRow>
              </TableHeader>
              <TableBody>
                {data.loading && <TableLoadingRow colspan={1} />}
                {!data.loading && data.acknowledgements.length < 1 && <TableNoRows colspan={4} label="No official receipt found" />}
                {!data.loading &&
                  data.acknowledgements.map((entry: Option) => (
                    <TableRow key={entry._id} className="border-b-0 [&>td]:!py-1">
                      <TableCell className="">
                        <IonCheckbox
                          checked={selectedIds.includes(entry._id)}
                          onIonChange={(e) => toggleSelect(entry._id, e.detail.checked)}
                        />
                      </TableCell>
                      <TableCell className="">{entry.cvNo ?? entry.code}</TableCell>
                      <TableCell className="">{entry.acctCode ?? '-'}</TableCell>
                      <TableCell className="">{entry.dueDate ? formatDateTable(entry.dueDate) : '-'}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          <div className="w-full flex items-center justify-end !mt-6 gap-2">
            <IonButton
              onClick={dismiss}
              type="button"
              fill="clear"
              className="max-h-10 min-h-6 bg-zinc-100 w-32 text-black capitalize font-semibold rounded-md"
              strong
            >
              Cancel
            </IonButton>
            <IonButton
              disabled={selectedIds.length === 0 || data.loading}
              onClick={handleLoadSelected}
              type="button"
              fill="clear"
              className="max-h-10 min-h-6 bg-[#FA6C2F] w-32 text-white capitalize font-semibold rounded-md"
              strong
            >
              Load
            </IonButton>
          </div>
          {/* <TablePagination currentPage={currentPage} totalPages={data.totalPages} onPageChange={handlePagination} disabled={data.loading} /> */}
        </div>
      </IonModal>
    </>
  );
};

export default ORLoadEntries;
