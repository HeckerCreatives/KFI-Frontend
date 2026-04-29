import React, { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Search01Icon } from 'hugeicons-react';
import classNames from 'classnames';
import kfiAxios from '../../../../utils/axios';
import { formatDateTable } from '../../../../utils/date-utils';
import SelectionHeader from '../../../../ui/selections/SelectionHeader';
import FormIonItem from '../../../../ui/utils/FormIonItem';
import { AcknowledgementFormData } from '../../../../../validations/acknowledgement.schema';
import TableLoadingRow from '../../../../ui/forms/TableLoadingRow';
import TableNoRows from '../../../../ui/forms/TableNoRows';
import { ReleaseFormData } from '../../../../../validations/release.schema';
import { Table, TableHeader, TableHeadRow, TableHead, TableBody, TableCell, TableRow } from '../../../../ui/table/Table';
import { IonButton, IonCheckbox, IonModal, IonSelect, IonSelectOption, IonPopover, IonContent, IonList, IonItem, IonLabel, IonSearchbar, IonText, IonInput } from '@ionic/react';

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
  loanReleaseId?: string;
  loanRelease?: string;
  clientId?: string
};

export type TAcknowledgement = {
  acknowledgements: Option[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

type DueDate = {
  _id: string;
  week: string | number;
  date: string;
  transaction: { code: string } | null;
  client: {name: string, _id: string}
};


type Props = {
  center: string,
  form: UseFormReturn<ReleaseFormData>
}

const DUE_DATE_PAGE_SIZE = 5;

const DueDateDropdown = ({
  duedates,
  value,
  onChange,
  disabled,
}: {
  duedates: DueDate[];
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const selected = duedates.find((d) => d._id === value);

  const filtered = duedates.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.transaction?.code?.toLowerCase().includes(q) ||
      String(item.week).toLowerCase().includes(q) ||
      item.date.split('T')[0].includes(q) ||
      item.client.name.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / DUE_DATE_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * DUE_DATE_PAGE_SIZE, safePage * DUE_DATE_PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleSelect = (id: string) => {
    onChange(id);
    setIsOpen(false);
    setSearch('');
    setPage(1);
  };

  return (
    <>
     

       <button
        className=" !p-2 !px-4 bg-zinc-100 rounded-lg text-zinc-800"
        id="due-date-trigger"
        disabled={disabled}
        onClick={() => setIsOpen(true)}
      >
       <span className="truncate text-left w-full text-xs">
          {selected
            ? `${selected.transaction?.code ?? ''}, Week: ${selected.week}, Date: ${selected.date.split('T')[0]}`
            : 'Due dates'}
        </span>
      </button>

      <IonPopover
        isOpen={isOpen}
        trigger="due-date-trigger"
        triggerAction="click"
        onDidDismiss={() => {
          setIsOpen(false);
          setSearch('');
          setPage(1);
        }}
        dismissOnSelect={false}
        showBackdrop={false}
        className="[--max-width:20rem] !p-6 !rounded-xl"
      >
        <IonContent class="[--padding-top:0.25rem] [--padding-bottom:0.25rem] !p-6 !rounded-xl">
          <IonInput
            value={search}
            onIonInput={(e) => setSearch(e.detail.value ?? '')}
            placeholder="Search due dates..."
            debounce={0}
            className="text-xs !px-4 !bg-zinc-50 !border !border-zinc-200 rounded-xl !mb-2"
          />

          <IonList lines="full" className="py-0">
            {paginated.length === 0 && (
              <IonItem>
                <IonLabel className="text-xs ion-text-center" color="medium">
                  No results found
                </IonLabel>
              </IonItem>
            )}
            {paginated.map((item) => (
              <IonItem
                key={item._id}
                button
                detail={false}
                onClick={() => handleSelect(item._id)}
                color={value === item._id ? '' : undefined}
              >
                <IonLabel className="!text-xs">
                  {item.transaction?.code ?? '—'}, Week: {item.week}, Date:{' '}
                  {item.date.split('T')[0]}, {item.client.name || ''}
                </IonLabel>
              </IonItem>
            ))}
          </IonList>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-3 py-2 border-t border-zinc-200">
              <IonText color="medium">
                <span className="text-xs">
                  Page {safePage} of {totalPages}
                </span>
              </IonText>
              <div className="flex items-center gap-1">
                <IonButton
                  size="small"
                  fill='clear'
                  disabled={safePage <= 1}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPage((p) => Math.max(1, p - 1));
                  }}
                  className=" !text-white !rounded-md !bg-orange-500"
                >
                  ‹
                </IonButton>
                <IonButton
                  fill='clear'
                  size="small"
                  disabled={safePage >= totalPages}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPage((p) => Math.min(totalPages, p + 1));
                  }}
                  className=" !text-white !rounded-md !bg-orange-500"
                >
                  ›
                </IonButton>
              </div>
            </div>
          )}
        </IonContent>
      </IonPopover>
    </>
  );
};



const ARLoadEntries = ({center, form}: Props) => {
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
      const result = await kfiAxios.get('/release/load-entries', { params: filter });
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

        const list = dueDates.filter((item: any) => item.transaction !== null)
    

        setDuedates(list ?? [])
     
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
  

  const mapEntryForForm = (entry: any) => {
    const particular = entry.particular ?? `${entry.centerNo ? `${entry.centerNo} - ` : ''}${entry.name ?? ''}`.trim();

    console.log(entry.acctCode)
    return {
      loanReleaseEntryId: entry.loanReleaseEntryId ?? entry._id ?? '',
      loanReleaseId: entry.loanReleaseId ?? entry.loanRelease ?? '',
      cvNo: `${entry.cvNo ?? entry.code ?? ''}`,
      dueDate: entry.dueDate ? formatDateTable(entry.dueDate) : '',
      noOfWeeks: `${entry.week ?? ''}`,
      week: `${entry.week ?? ''}`,
      name: entry.name ?? '',
      particular,
      acctCodeId: entry.acctCodeId ?? '',
      acctCode: entry.acctCode.code ?? '',
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
    if (isOpen) handleDueDates();
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
             

                <DueDateDropdown
                  duedates={duedates}
                  value={dueDateId}
                  onChange={setDueDateId}
                  disabled={loading}
                />


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
                {!data.loading && data.acknowledgements.length < 1 && <TableNoRows colspan={4} label="No data found" />}
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

export default ARLoadEntries;
