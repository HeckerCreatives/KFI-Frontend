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
  reportType: z.string().optional(),

  //past due
  clients: z.array(z.string()).optional(),
  centers: z.array(z.string()).optional(),
  loanReleaseDateFrom: z.string().optional(),
  loanReleaseDateTo: z.string().optional(),
  paymentDateFrom: z.string().optional(),
  paymentDateTo: z.string().optional(),
  reportFormat: z.string().optional().or(z.literal(""))
});


export type PrintExportFilterFormData = z.infer<typeof printExportFilterSchema>;