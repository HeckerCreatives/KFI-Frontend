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
  reportFormat: z.string().optional().or(z.literal("")),

  //weekly collection
  center: z.string(z.string()).optional(),
  centerLabel: z.string(z.string()).optional(),
  loanReleaseDate: z.string(z.string()).optional(),
  loanReleaseDueDate: z.string(z.string()).optional(),
  weekNo: z.string(z.string()).optional(),
  format: z.string(z.string()).optional(),
  multi: z.boolean(z.string()).optional(),
  type: z.string(z.string()).optional(),
  balance: z.string(z.string()).optional(),
  

});


export type PrintExportFilterFormData = z.infer<typeof printExportFilterSchema>;