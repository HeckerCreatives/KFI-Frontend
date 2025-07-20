import { IonButton, IonHeader, IonIcon, IonInput, IonModal, IonToolbar } from '@ionic/react';
import { arrowBackCircle, caretForwardOutline } from 'ionicons/icons';
import React, { useRef, useState } from 'react';
import SelectionHeader from './SelectionHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../table/Table';
import FormIonItem from '../utils/FormIonItem';
import classNames from 'classnames';
import kfiAxios from '../../utils/axios';
import TableLoadingRow from '../forms/TableLoadingRow';
import TableNoRows from '../forms/TableNoRows';
import { FieldValues, Path, PathValue, UseFormClearErrors, UseFormSetValue } from 'react-hook-form';

type Option = {
  _id: string;
  type: string;
};

type BusinessTypeSelectionProps<T extends FieldValues> = {
  setValue: UseFormSetValue<T>;
  clearErrors: UseFormClearErrors<T>;
  businessTypeLabel: Path<T>;
  businessTypeValue: Path<T>;
};

const BusinessTypeSelection = <T extends FieldValues>({ businessTypeLabel, businessTypeValue, setValue, clearErrors }: BusinessTypeSelectionProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [datas, setDatas] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const ionInputRef = useRef<HTMLIonInputElement>(null);

  function dismiss() {
    setIsOpen(false);
  }

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleSearch = async () => {
    const value = ionInputRef.current?.value;
    setLoading(true);
    try {
      const result = await kfiAxios.get('/business-type/selection', { params: { keyword: value } });
      const { success, businessTypes } = result.data;
      if (success) {
        setDatas(businessTypes);
        return;
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBusinessType = (businessType: Option) => {
    const typeValue = businessType.type as PathValue<T, Path<T>>;
    const idValue = businessType._id as PathValue<T, Path<T>>;
    setValue(businessTypeLabel as Path<T>, typeValue as any);
    setValue(businessTypeValue as Path<T>, idValue as any);
    clearErrors(businessTypeLabel);
    clearErrors(businessTypeValue);
    setDatas([]);
    dismiss();
  };

  return (
    <>
      <div className="text-end">
        <IonButton onClick={handleOpen} fill="clear" className="max-h-9 min-h-9 btn-color text-white capitalize font-semibold rounded-md m-0" strong>
          Find
        </IonButton>
      </div>
      <IonModal isOpen={isOpen} backdropDismiss={false} className="auto-height md:[--max-width:70%] md:[--width:100%] lg:[--max-width:50%] lg:[--width:50%]">
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-10">
            <SelectionHeader dismiss={dismiss} disabled={loading} title="Business Type Selection" />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content !p-2  border-2 !border-slate-100">
          <div className="">
            <div className="flex items-center flex-wrap justify-start gap-2">
              <div className="flex items-center min-w-20">
                <FormIonItem className="flex-1">
                  <IonInput
                    ref={ionInputRef}
                    clearInput
                    type="search"
                    aria-label="Type here"
                    placeholder="Type here"
                    disabled={loading}
                    className={classNames(
                      'text-sm !bg-white rounded-md !px-2 ![--highlight-color-focused:none] md:![--padding-bottom:0] ![--padding-top:0] ![--padding-start:0] border border-slate-400 ![--min-height:1rem] !min-h-[1rem]',
                    )}
                  />
                </FormIonItem>
                <IonButton onClick={handleSearch} type="button" fill="clear" className="max-h-10 min-h-[2rem] bg-[#FA6C2F] text-white capitalize font-semibold rounded-md" strong>
                  {loading ? 'Finding...' : 'Find'}
                </IonButton>
              </div>
            </div>
          </div>
          <div className="relative overflow-auto">
            <Table>
              <TableHeader>
                <TableHeadRow className="border-b-0 bg-slate-100">
                  <TableHead className="!py-2">Type</TableHead>
                </TableHeadRow>
              </TableHeader>
              <TableBody>
                {loading && <TableLoadingRow colspan={2} />}
                {!loading && datas.length < 1 && <TableNoRows colspan={2} label="No business type found" />}
                {!loading &&
                  datas.map((data: Option) => (
                    <TableRow onClick={() => handleSelectBusinessType(data)} key={data._id} className="border-b-0 [&>td]:!py-1 cursor-pointer">
                      <TableCell className="">{data.type}</TableCell>
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

export default BusinessTypeSelection;
