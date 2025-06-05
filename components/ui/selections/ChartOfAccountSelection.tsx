import { IonButton, IonHeader, IonInput, IonModal, IonToolbar } from '@ionic/react';
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
  code: string;
  description: string;
  nature: string;
  classification: string;
  deptStatus: string;
};

type ChartOfAccountSelectionProps<T extends FieldValues> = {
  setValue: UseFormSetValue<T>;
  clearErrors: UseFormClearErrors<T>;
  chartOfAccountLabel: Path<T>;
  chartOfAccountValue: Path<T>;
};

const ChartOfAccountSelection = <T extends FieldValues>({ chartOfAccountLabel, chartOfAccountValue, setValue, clearErrors }: ChartOfAccountSelectionProps<T>) => {
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
      const result = await kfiAxios.get('/chart-of-account/selection', { params: { keyword: value } });
      const { success, chartOfAccounts } = result.data;
      if (success) {
        setDatas(chartOfAccounts);
        return;
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCenter = (chartOfAccount: Option) => {
    const codeValue = `${chartOfAccount.code} - ${chartOfAccount.description}` as PathValue<T, Path<T>>;
    const idValue = chartOfAccount._id as PathValue<T, Path<T>>;
    setValue(chartOfAccountLabel as Path<T>, codeValue as any);
    setValue(chartOfAccountValue as Path<T>, idValue as any);
    clearErrors(chartOfAccountLabel);
    clearErrors(chartOfAccountValue);
    setDatas([]);
    dismiss();
  };

  return (
    <>
      <div className="text-end">
        <IonButton onClick={handleOpen} fill="clear" className="max-h-10 min-h-10 btn-color text-white capitalize font-semibold rounded-md m-0" strong>
          Find
        </IonButton>
      </div>
      <IonModal isOpen={isOpen} backdropDismiss={false} className="auto-height md:[--max-width:70%] md:[--width:100%] lg:[--max-width:50%] lg:[--width:50%]">
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-10">
            <SelectionHeader dismiss={dismiss} disabled={loading} title="Chart Of Account Selection" />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content !p-2  border-2 !border-slate-400">
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
                  <TableHead className="!py-2">Code</TableHead>
                  <TableHead className="!py-2">Description</TableHead>
                  <TableHead className="!py-2">Nature Of Account</TableHead>
                  <TableHead className="!py-2">Classification</TableHead>
                  <TableHead className="!py-2">Department Status</TableHead>
                </TableHeadRow>
              </TableHeader>
              <TableBody>
                {loading && <TableLoadingRow colspan={2} />}
                {!loading && datas.length < 1 && <TableNoRows colspan={5} label="No chart of account found" />}
                {!loading &&
                  datas.map((data: Option) => (
                    <TableRow onClick={() => handleSelectCenter(data)} key={data._id} className="border-b-0 [&>td]:!py-1 cursor-pointer">
                      <TableCell className="">{data.code}</TableCell>
                      <TableCell className="">{data.description}</TableCell>
                      <TableCell className="">{data.nature}</TableCell>
                      <TableCell className="">{data.classification}</TableCell>
                      <TableCell className="">{data.deptStatus}</TableCell>
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

export default ChartOfAccountSelection;
