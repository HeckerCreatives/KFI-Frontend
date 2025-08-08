import { z } from 'zod';

export const emergencyLoanEntrySchema = z.object({
  client: z.string().optional().or(z.literal('')),
  clientLabel: z.string().optional().or(z.literal('')),
  particular: z.string().optional().or(z.literal('')),
  acctCodeId: z.string().min(1, 'Account Code Id is required').max(255, 'Account Code Id must only consist of 255 characters'),
  acctCode: z.string().min(1, 'Account Code is required').max(255, 'Account Code must only consist of 255 characters'),
  description: z.string().optional().or(z.literal('')),
  debit: z
    .string()
    .min(1, 'Debit is required')
    .max(255, 'Debit must only consist of 255 characters')
    .refine(value => !isNaN(Number(value.replace(',', '').replace('.', ''))), 'Debit must be a number'),
  credit: z
    .string()
    .min(1, 'Credit is required')
    .max(255, 'Credit must only consist of 255 characters')
    .refine(value => !isNaN(Number(value.replace(',', '').replace('.', ''))), 'Credit must be a number'),
  root: z.string().optional().or(z.literal('')),
});

export const emergencyLoanSchema = z
  .object({
    code: z
      .string()
      .min(1, 'CV # is required')
      .regex(/^CV#[\d-]+$/i, { message: 'Must start with CV# followed by numbers or hyphens' }),
    centerLabel: z.string().min(1, 'Center code is required'),
    centerValue: z.string().min(1, 'Center code is required'),
    refNo: z.string().optional().or(z.literal('')),
    remarks: z.string().optional().or(z.literal('')),
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
    bankCode: z.string().min(1, 'Bank code is required').max(255, 'Bank code must only consist of 255 characters'),
    bankCodeLabel: z.string().min(1, 'Bank code is required').max(255, 'Bank code must only consist of 255 characters'),
    amount: z
      .string()
      .min(1, 'Amount is required')
      .max(255, 'Amount must only consist of 255 characters')
      .refine(value => !isNaN(Number(value.replace(',', '').replace('.', ''))), 'Amount must be a number'),
    entries: z.array(emergencyLoanEntrySchema).optional(),
    mode: z.string().refine(value => ['create', 'update'].includes(value), 'Mode is required'),
  })
  .superRefine((data, ctx) => {
    if (data.mode !== 'create') return;
    if (data.entries && data.entries.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please add atleast 1 entry',
        path: ['entries'],
      });
    }
  });

export type EmergencyLoanFormData = z.infer<typeof emergencyLoanSchema>;
export type EmergencyLoanEntryFormData = z.infer<typeof emergencyLoanEntrySchema>;
