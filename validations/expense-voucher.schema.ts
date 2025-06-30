import z from 'zod';

export const expenseVoucherEntrySchema = z.object({
  particular: z.string().optional().or(z.literal('')),
  acctCodeId: z.string().min(1, 'Account Code Id is required').max(255, 'Account Code Id must only consist of 255 characters'),
  acctCode: z.string().min(1, 'Account Code is required').max(255, 'Account Code must only consist of 255 characters'),
  description: z.string().optional().or(z.literal('')),
  debit: z
    .string()
    .min(1, 'Debit is required')
    .max(255, 'Debit must only consist of 255 characters')
    .refine(value => !isNaN(Number(value)), 'Debit must be a number'),
  credit: z
    .string()
    .min(1, 'Credit is required')
    .max(255, 'Credit must only consist of 255 characters')
    .refine(value => !isNaN(Number(value)), 'Credit must be a number'),
  cvForRecompute: z.string().optional().or(z.literal('')),
  root: z.string().optional().or(z.literal('')),
});

export const expenseVoucherSchema = z.object({
  code: z.string().min(1, 'CV # is required').max(255, 'CV # must only consist of 255 characters'),
  supplier: z.string().min(1, 'Supplier is required').max(255, 'Supplier must only consist of 255 characters'),
  supplierId: z.string().min(1, 'Supplier is required').max(255, 'Supplier must only consist of 255 characters'),
  refNo: z.string().min(1, 'Reference Number is required').max(255, 'Reference Number must only consist of 255 characters').optional().or(z.literal('')),
  date: z.string().min(1, 'Date is required').max(255, 'Date must only consist of 255 characters'),
  acctMonth: z
    .string()
    .min(1, 'Account Month is required')
    .max(255, 'Account Month must only consist of 255 characters')
    .refine(value => !isNaN(Number(value)), 'Account Month must be a number')
    .refine(value => !isNaN(Number(value)) && Number(value) >= 1 && Number(value) <= 12, 'Account month must be only 1 to 12'),
  acctYear: z
    .string()
    .min(1, 'Account Year is required')
    .max(255, 'Account Year must only consist of 255 characters')
    .refine(value => !isNaN(Number(value)), 'Account Year must be a number'),
  checkNo: z.string().min(1, 'Check number is required').max(255, 'Check number must only consist of 255 characters'),
  checkDate: z.string().min(1, 'Check date is required').max(255, 'Check date must only consist of 255 characters'),
  bank: z.string().min(1, 'Bank code is required').max(255, 'Bank code must only consist of 255 characters'),
  bankLabel: z.string().min(1, 'Bank code is required').max(255, 'Bank code must only consist of 255 characters'),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .max(255, 'Amount must only consist of 255 characters')
    .refine(value => !isNaN(Number(value)), 'Amount must be a number'),
  remarks: z.string().min(1, 'Remarks is required').max(255, 'Remarks must only consist of 255 characters').optional().or(z.literal('')),
  entries: z.array(expenseVoucherEntrySchema).min(1, 'Please add atleast 1 entry'),
});

export const updateExpenseVoucherSchema = z.object({
  code: z.string().min(1, 'CV # is required').max(255, 'CV # must only consist of 255 characters'),
  supplier: z.string().min(1, 'Supplier is required').max(255, 'Supplier must only consist of 255 characters'),
  supplierId: z.string().min(1, 'Supplier is required').max(255, 'Supplier must only consist of 255 characters'),
  refNo: z.string().min(1, 'Reference Number is required').max(255, 'Reference Number must only consist of 255 characters').optional().or(z.literal('')),
  date: z.string().min(1, 'Date is required').max(255, 'Date must only consist of 255 characters'),
  acctMonth: z
    .string()
    .min(1, 'Account Month is required')
    .max(255, 'Account Month must only consist of 255 characters')
    .refine(value => !isNaN(Number(value)), 'Account Month must be a number')
    .refine(value => !isNaN(Number(value)) && Number(value) >= 1 && Number(value) <= 12, 'Account month must be only 1 to 12'),
  acctYear: z
    .string()
    .min(1, 'Account Year is required')
    .max(255, 'Account Year must only consist of 255 characters')
    .refine(value => !isNaN(Number(value)), 'Account Year must be a number'),
  checkNo: z.string().min(1, 'Check number is required').max(255, 'Check number must only consist of 255 characters'),
  checkDate: z.string().min(1, 'Check date is required').max(255, 'Check date must only consist of 255 characters'),
  bank: z.string().min(1, 'Bank code is required').max(255, 'Bank code must only consist of 255 characters'),
  bankLabel: z.string().min(1, 'Bank code is required').max(255, 'Bank code must only consist of 255 characters'),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .max(255, 'Amount must only consist of 255 characters')
    .refine(value => !isNaN(Number(value)), 'Amount must be a number'),
  remarks: z.string().min(1, 'Remarks is required').max(255, 'Remarks must only consist of 255 characters').optional().or(z.literal('')),
});

export type ExpenseVoucherFormData = z.infer<typeof expenseVoucherSchema>;
export type UpdateExpenseVoucherFormData = z.infer<typeof updateExpenseVoucherSchema>;
export type ExpenseVoucherEntryFormData = z.infer<typeof expenseVoucherEntrySchema>;
