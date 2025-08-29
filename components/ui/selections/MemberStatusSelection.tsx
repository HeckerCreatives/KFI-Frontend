import { IonButton, IonHeader, IonModal, IonToolbar } from '@ionic/react';
import React, { useRef, useState } from 'react';
import SelectionHeader from './SelectionHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../table/Table';
import classNames from 'classnames';
import TableLoadingRow from '../forms/TableLoadingRow';
import TableNoRows from '../forms/TableNoRows';
import { FieldValues, Path, PathValue, UseFormClearErrors, UseFormSetValue } from 'react-hook-form';
import { Search01Icon } from 'hugeicons-react';

type Option = {
  label: string;
  value: string;
};

type MemberStatusSelectionProps<T extends FieldValues> = {
  setValue: UseFormSetValue<T>;
  clearErrors: UseFormClearErrors<T>;
  memberStatusLabel: Path<T>;
  memberStatusValue: Path<T>;
  className?: string;
};

const MemberStatusSelection = <T extends FieldValues>({ memberStatusLabel, memberStatusValue, setValue, clearErrors, className = '' }: MemberStatusSelectionProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [datas] = useState<Option[]>([
    { label: 'Active On-Leave', value: 'Active On-Leave' },
    { label: 'Active-Existing', value: 'Active-Existing' },
    { label: 'Active-New', value: 'Active-New' },
    { label: 'Active-PastDue', value: 'Active-PastDue' },
    { label: 'Active-Returnee', value: 'Active-Returnee' },
    { label: 'Resigned', value: 'Resigned' },
  ]);
  const [loading, setLoading] = useState(false);

  function dismiss() {
    setIsOpen(false);
  }

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleSelectStatus = (status: Option) => {
    const statusLabel = status.label as PathValue<T, Path<T>>;
    const statusValue = status.value as PathValue<T, Path<T>>;
    setValue(memberStatusLabel as Path<T>, statusLabel as any);
    setValue(memberStatusValue as Path<T>, statusValue as any);
    clearErrors(memberStatusLabel);
    clearErrors(memberStatusValue);
    dismiss();
  };

  return (
    <>
      <IonButton onClick={handleOpen} fill="clear" className={classNames('max-h-9 min-h-9 btn-color text-white capitalize font-semibold !m-0 rounded-md text-xs', className)} strong>
        <Search01Icon size={15} stroke='.8' className=' mr-1'/>
        Find
      </IonButton>

      <IonModal
        isOpen={isOpen}
        backdropDismiss={false}
        className=" ![--border-radius:1rem] auto-height [--max-width:32rem] [--width:100%] "
      >
        {/* <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-10">
            <SelectionHeader dismiss={dismiss} disabled={loading} title="Member Status Selection" />
          </IonToolbar>
        </IonHeader> */}
        <div className="inner-content !p-6  border-2 !border-slate-400">

          <SelectionHeader dismiss={dismiss} disabled={loading} title="Member Status Selection" />

          <div className="relative overflow-auto mt-2">
            <Table>
              <TableHeader>
                <TableHeadRow className="border-b-0 bg-slate-100">
                  <TableHead className="!py-2">Code</TableHead>
                  <TableHead className="!py-2">Description</TableHead>
                </TableHeadRow>
              </TableHeader>
              <TableBody>
                {loading && <TableLoadingRow colspan={2} />}
                {!loading && datas.length < 1 && <TableNoRows colspan={2} label="No center found" />}
                {!loading &&
                  datas.map((data: Option) => (
                    <TableRow onClick={() => handleSelectStatus(data)} key={data.label} className="border-b-0 [&>td]:!py-1 cursor-pointer">
                      <TableCell className="">{data.label}</TableCell>
                      <TableCell className="">{data.value}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default MemberStatusSelection;
