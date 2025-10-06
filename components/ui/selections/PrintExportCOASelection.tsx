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

type TAccounts = {
  chartOfAccounts: Option[];
  totalPages: number;
  loading: boolean;
};

type AccountSelectionProps<T extends FieldValues> = {
  setValue: UseFormSetValue<T>;
  clearErrors: UseFormClearErrors<T>;
  coaLabel: Path<T>;
  coaValue: Path<T>;
  className?: string;
watch: UseFormWatch<T>;
};

const ITEMS_PER_PAGE = 10; // You can adjust this

const PrintExportAccountSelection = <T extends FieldValues>({
  coaLabel,
  coaValue,
  setValue,
  clearErrors,
  className = "",
  watch
}: AccountSelectionProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState<Option[]>([]);
  const [allAccounts, setAllAccounts] = useState<Option[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<Option[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const ionInputRef = useRef<HTMLIonInputElement>(null);

  const dismiss = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);

    const watchedSelectedIds = watch(coaValue);

    useEffect(() => {
    if (!watchedSelectedIds || watchedSelectedIds.length === 0) {
        setSelectedAccounts([]);
    }
    }, [watchedSelectedIds]);

  // Fetch all accounts once
  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const result = await kfiAxios.get("/chart-of-account/list");
      const { success, chartOfAccounts } = result.data;
      if (success) {
        setAllAccounts(chartOfAccounts);
        setFilteredAccounts(chartOfAccounts);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Search filter
  const handleSearch = () => {
    const keyword = String(ionInputRef.current?.value || "").toLowerCase();
    const filtered = allAccounts.filter(
      (acc) =>
        acc.code.toLowerCase().includes(keyword) ||
        acc.description.toLowerCase().includes(keyword)
    );
    setFilteredAccounts(filtered);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredAccounts.length / ITEMS_PER_PAGE);
  const paginatedData = filteredAccounts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleCheckboxChange = (acc: Option, checked: boolean) => {
    setSelectedAccounts((prev) =>
      checked
        ? [...prev, acc]
        : prev.filter((b) => b._id !== acc._id)
    );
  };

  // Confirm selection
  const handleConfirmSelection = () => {
    const ids = selectedAccounts.map((b) => b._id) as PathValue<T, Path<T>>;
    const labels = selectedAccounts.map((b) => b.description).join(", ") as PathValue<
      T,
      Path<T>
    >;
    const selected = selectedAccounts.map((b) => ({
      id: b._id,
      name: b.description,
    })) as PathValue<T, Path<T>>;

    setValue(coaValue, ids as any);
    setValue(coaLabel, labels as any);
    setValue("coaSelected" as Path<T>, selected as any);

    clearErrors(coaValue);
    clearErrors(coaLabel);
    clearErrors("coaSelected" as Path<T>);
    dismiss();
  };

  useEffect(() => {
    if (isOpen) fetchAccounts();
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
        Select Accounts
      </IonButton>

      <IonModal
        isOpen={isOpen}
        backdropDismiss={false}
        className="[--border-radius:0.7rem] auto-height [--max-width:42rem] [--width:95%]"
      >
        <div className="inner-content !p-6 border-2 !border-slate-100">
          <SelectionHeader dismiss={dismiss} disabled={loading} title="Account Selection" />

          {/* Search Field */}
          <div className="flex items-center flex-wrap justify-start gap-2 mb-3">
            <FormIonItem className="">
              <IonInput
                ref={ionInputRef}
                clearInput
                type="search"
                placeholder="Search account..."
                disabled={loading}
                className={classNames(
                  "text-sm !bg-white rounded-md !px-2 border border-slate-400 !min-h-[2rem] max-w-[12rem]"
                )}
              />
            </FormIonItem>
            <IonButton
              onClick={handleSearch}
              type="button"
              fill="clear"
              className="max-h-10 min-h-[2rem] bg-[#FA6C2F] text-white capitalize font-semibold rounded-md text-xs"
              strong
            >
              <Search01Icon size={15} stroke=".8" className="mr-1" />
              {loading ? "Finding..." : "Find"}
            </IonButton>
          </div>

          {/* Table */}
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
                {!loading && paginatedData.length < 1 && (
                  <TableNoRows colspan={3} label="No accounts found" />
                )}
                {!loading &&
                  paginatedData.map((acc) => {
                    const selected = selectedAccounts.some((b) => b._id === acc._id);
                    return (
                      <TableRow key={acc._id} className="border-b-0 [&>td]:!py-1">
                        <TableCell className="text-center">
                          <IonCheckbox
                            checked={selected}
                            onIonChange={(e) =>
                              handleCheckboxChange(acc, e.detail.checked)
                            }
                          />
                        </TableCell>
                        <TableCell>{acc.code}</TableCell>
                        <TableCell>{acc.description}</TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>

          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            disabled={loading}
          />

          <div className="flex justify-end mt-4">
            <IonButton
              type="button"
              fill="clear"
              onClick={handleConfirmSelection}
              className="!bg-[#FA6C2F] text-white rounded-md text-sm"
            >
              Confirm Selection ({selectedAccounts.length})
            </IonButton>
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default PrintExportAccountSelection;
