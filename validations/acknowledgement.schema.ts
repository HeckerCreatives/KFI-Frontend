import { z } from 'zod';

export const acknowledgementEntrySchema = z.object({
  loanReleaseEntryId: z.string().optional().or(z.literal('')),
  cvNo: z.string().optional().or(z.literal('')),
  dueDate: z.string().optional().or(z.literal('')),
  noOfWeeks: z.string().optional().or(z.literal('')),
  name: z.string().optional().or(z.literal('')),
  client: z.string().optional().or(z.literal('')),
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

export const acknowledgementSchema = z
  .object({
    // code: z
    //   .string()
    //   .min(1, 'OR # is required')
    //   .regex(/^OR#[\d-]+$/i, { message: 'Must start with OR# followed by numbers or hyphens' }),
      code: z
      .string()
      .min(1, 'OR # is required'),
    center: z.string().min(1, 'Center is required'),
    user: z.string().min(1, 'User is required'),

    centerLabel: z.string().min(1, 'Center is required'),
    centerName: z.string().optional().or(z.literal('')),
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
    acctOfficer: z.string().min(1, 'Account Officer is required').max(255, 'Bank code must only consist of 255 characters'),
    // checkNo: z.string().min(1, 'Check number is required').max(255, 'Check number must only consist of 255 characters'),
    checkNo: z.string().optional(),
    checkDate: z.string().min(1, 'Check date is required').max(255, 'Check date must only consist of 255 characters'),
    bankCode: z.string().min(1, 'Bank code is required').max(255, 'Bank code must only consist of 255 characters'),
    bankCodeLabel: z.string().min(1, 'Bank code is required').max(255, 'Bank code must only consist of 255 characters'),
    type: z
      .string()
      .min(1, 'Type is required')
      .refine(value => ['cash', 'direct deposit', 'check'].includes(value), 'Type is required'),
    amount: z
      .string()
      .min(1, 'Amount is required')
      .max(255, 'Amount must only consist of 255 characters')
      .refine(value => !isNaN(Number(value.replace(',', '').replace('.', ''))), 'Amount must be a number'),
    cashCollection: z
      .string()
      .min(1, 'Amount is required')
      .max(255, 'Amount must only consist of 255 characters')
      .refine(value => !isNaN(Number(value.replace(',', '').replace('.', ''))), 'Amount must be a number')
      .optional()
      .or(z.literal('')),
    entries: z.array(acknowledgementEntrySchema).optional(),
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

export type AcknowledgementFormData = z.infer<typeof acknowledgementSchema>;
export type AcknowledgementEntryFormData = z.infer<typeof acknowledgementEntrySchema>;
