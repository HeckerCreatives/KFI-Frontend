import { string, z } from "zod";

export const printExportFilterSchema = z.object({
  docNoFrom: z.string().optional().or(z.literal("")),
  docNoFromLabel: z.string().optional().or(z.literal("")),
  docNoTo: z.string().optional().or(z.literal("")),
  docNoToLabel: z.string().optional().or(z.literal("")),
  dateFrom: z.string().optional().or(z.literal("")),
  dateTo: z.string().optional().or(z.literal("")),
  option: z.string().optional().or(z.literal("")),
  bankIds: z.array(z.string()).default([]).optional(),
  chartOfAccountsIds: z.array(z.string()).default([]).optional(),
  banksSelected: z.array(z.object({id: z.string(), name: z.string()})).default([]).optional(),
  coaSelected: z.array(z.object({id: z.string(), name: z.string()})).default([]).optional(),
});


export type PrintExportFilterFormData = z.infer<typeof printExportFilterSchema>;