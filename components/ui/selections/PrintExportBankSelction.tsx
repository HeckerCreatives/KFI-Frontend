"use client";

import { IonButton, IonInput, IonModal, IonCheckbox } from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import {
  FieldValues,
  Path,
  PathValue,
  UseFormClearErrors,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import kfiAxios from "../../utils/axios";
import SelectionHeader from "./SelectionHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableHeadRow,
  TableRow,
} from "../table/Table";
import FormIonItem from "../utils/FormIonItem";
import TableLoadingRow from "../forms/TableLoadingRow";
import TableNoRows from "../forms/TableNoRows";
import TablePagination from "../forms/TablePagination";
import { Search01Icon } from "hugeicons-react";

type Option = {
  _id: string;
  code: string;
  description: string;
};

type TBanks = {
  banks: Option[];
  totalPages: number;
  nextPage: boolean;
  prevPage: boolean;
  loading: boolean;
};

type BankSelectionProps<T extends FieldValues> = {
  setValue: UseFormSetValue<T>;
  clearErrors: UseFormClearErrors<T>;
  bankLabel: Path<T>;
  bankValue: Path<T>; 
  className?: string;
  watch: UseFormWatch<T>;
  
  
};

const PrintExportBankSelection = <T extends FieldValues>({
  bankLabel,
  bankValue,
  setValue,
  clearErrors,
  className = "",
  watch
}: BankSelectionProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedBanks, setSelectedBanks] = useState<Option[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [data, setData] = useState<TBanks>({
    banks: [],
    loading: false,
    totalPages: 0,
    nextPage: false,
    prevPage: false,
  });

  const ionInputRef = useRef<HTMLIonInputElement>(null);

  const dismiss = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);

  const watchedSelectedIds = watch(bankValue);
  
      useEffect(() => {
      if (!watchedSelectedIds || watchedSelectedIds.length === 0) {
          setSelectedBanks([]);
      }
      }, [watchedSelectedIds]);

  const handleSearch = async (page: number) => {
    const value = ionInputRef.current?.value;
    setLoading(true);
    try {
      const filter: any = { keyword: value, page, limit: 10 };
      const result = await kfiAxios.get("/bank/selection", { params: filter });
      const { success, banks, totalPages, hasNextPage, hasPrevPage } =
        result.data;
      if (success) {
        setData({
          banks,
          loading: false,
          totalPages,
          nextPage: hasNextPage,
          prevPage: hasPrevPage,
        });
        setCurrentPage(page);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePagination = (page: number) => handleSearch(page);

  const toggleSelect = (bank: Option) => {
    setSelectedBanks((prev) => {
      const exists = prev.find((b) => b._id === bank._id);
      if (exists) {
        return prev.filter((b) => b._id !== bank._id);
      } else {
        return [...prev, bank];
      }
    });
  };

  const handleCheckboxChange = (bank: Option, checked: boolean) => {
    if (checked) {
      setSelectedBanks((prev) => [...prev, bank]);
    } else {
      setSelectedBanks((prev) => prev.filter((b) => b._id !== bank._id));
    }
  };

  const handleConfirmSelection = () => {
    const ids = selectedBanks.map((b) => b._id) as PathValue<T, Path<T>>;
    const labels = selectedBanks.map((b) => b.code).join(", ") as PathValue<T, Path<T>>;
    const selected = selectedBanks.map((b) => ({
        id: b._id,
        name: b.code,
    })) as PathValue<T, Path<T>>;

    // Store both
   setValue(bankValue, ids as any);
    setValue(bankLabel, labels as any);
    setValue("banksSelected" as Path<T>, selected as any);


    clearErrors(bankValue);
    clearErrors(bankLabel);
    clearErrors("banksSelected" as Path<T>);
    dismiss();
    };


  useEffect(() => {
    if (isOpen) handleSearch(1);
  }, [isOpen]);

  return (
    <>
      <IonButton
        onClick={handleOpen}
        fill="clear"
        className={classNames(
          "max-h-9 min-h-9 btn-color text-white capitalize font-semibold rounded-md m-0 text-xs",
          className
        )}
        strong
      >
        <Search01Icon size={15} stroke=".8" className="mr-1" />
        Select Banks
      </IonButton>

      <IonModal
        isOpen={isOpen}
        backdropDismiss={false}
        className="[--border-radius:0.7rem] auto-height [--max-width:42rem] [--width:95%]"
      >
        <div className="inner-content !p-6 border-2 !border-slate-100">
          <SelectionHeader
            dismiss={dismiss}
            disabled={loading}
            title="Bank Selection"
          />

          {/* Search Field */}
          <div className="flex items-center flex-wrap justify-start gap-2 mb-3">
            <FormIonItem className="">
              <IonInput
                ref={ionInputRef}
                clearInput
                type="search"
                placeholder="Search bank..."
                disabled={loading}
                className={classNames(
                  "text-sm !bg-white rounded-md !px-2 border border-slate-400 !min-h-[2rem] max-w-[12rem]"
                )}
              />
            </FormIonItem>
            <IonButton
              onClick={() => handleSearch(1)}
              type="button"
              fill="clear"
              className="max-h-10 min-h-[2rem] bg-[#FA6C2F] text-white capitalize font-semibold rounded-md text-xs"
              strong
            >
              <Search01Icon size={15} stroke=".8" className="mr-1" />
              {loading ? "Finding..." : "Find"}
            </IonButton>
          </div>

          {/* Table with checkboxes */}
          <div className="relative overflow-auto">
            <Table>
              <TableHeader>
                <TableHeadRow className="border-b-0 bg-slate-100">
                  <TableHead className="!py-2 w-10 text-center">Select</TableHead>
                  <TableHead className="!py-2">Code</TableHead>
                  <TableHead className="!py-2">Description</TableHead>
                </TableHeadRow>
              </TableHeader>
              <TableBody>
                {loading && <TableLoadingRow colspan={3} />}
                {!loading && data.banks.length < 1 && (
                  <TableNoRows colspan={3} label="No bank found" />
                )}
                {!loading &&
                  data.banks.map((bank: Option) => {
                    const selected = selectedBanks.some(
                      (b) => b._id === bank._id
                    );
                    return (
                      <TableRow key={bank._id} className="border-b-0 [&>td]:!py-1">
                        <TableCell className="text-center">
                          <IonCheckbox
                            checked={selected}
                            onIonChange={(e) =>
                              handleCheckboxChange(bank, e.detail.checked)
                            }
                          />
                        </TableCell>
                        <TableCell>{bank.code}</TableCell>
                        <TableCell>{bank.description}</TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <TablePagination
            currentPage={currentPage}
            totalPages={data.totalPages}
            onPageChange={handlePagination}
            disabled={data.loading}
          />

          <div className="flex justify-end mt-4">
            <IonButton
             type="button"
                  fill="clear"
              onClick={handleConfirmSelection}
              className="!bg-[#FA6C2F] text-white rounded-md text-sm"
            >
              Confirm Selection ({selectedBanks.length})
            </IonButton>
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default PrintExportBankSelection;
