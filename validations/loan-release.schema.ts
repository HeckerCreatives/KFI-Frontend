import z from 'zod';

export const entriesSchema = z.object({
  clientId: z.string().optional().or(z.literal('')),
  client: z.string().optional().or(z.literal('')),
  particular: z.string().optional().or(z.literal('')),
  acctCodeId: z.string().optional().or(z.literal('')),
  acctCode: z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  debit: z.string().optional().or(z.literal('')),
  credit: z.string().optional().or(z.literal('')),
  interest: z.string().optional().or(z.literal('')),
  cycle: z.string().optional().or(z.literal('')),
  checkNo: z.string().optional().or(z.literal('')),
  root: z.string().optional().or(z.literal('')),
  typeOfLoan: z.string().optional().or(z.literal('')),
});

export const loanReleaseSchema = z.object({
  cvNo: z
    .string()
    .min(1, 'CV # is required')
    .max(255, 'CV # must only consist of 255 characters')
    .refine(value => !isNaN(Number(value)), 'CV # must be a number'),
  center: z.string().min(1, 'Center Code is required').max(255, 'Center Code must only consist of 255 characters'),
  centerLabel: z.string().min(1, 'Center Code is required').max(255, 'Center Code must only consist of 255 characters'),
  name: z.string().min(1, 'Name is required').max(255, 'Name must only consist of 255 characters'),
  refNumber: z.string().min(1, 'Reference Number is required').max(255, 'Reference Number must only consist of 255 characters').optional().or(z.literal('')),
  remarks: z.string().min(1, 'Remarks is required').max(255, 'Remarks must only consist of 255 characters').optional().or(z.literal('')),
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
  noOfWeeks: z
    .string()
    .min(1, 'Number of weeks is required')
    .max(255, 'Number of weeks must only consist of 255 characters')
    .refine(value => !isNaN(Number(value)), 'Number of weeks must be a number'),
  typeOfLoan: z.string().min(1, 'Type of loan is required').max(255, 'Type of loan must only consist of 255 characters'),
  typeOfLoanLabel: z.string().min(1, 'Type of loan is required').max(255, 'Type of loan must only consist of 255 characters'),
  checkNo: z.string().min(1, 'Check number is required').max(255, 'Check number must only consist of 255 characters'),
  checkDate: z.string().min(1, 'Check date is required').max(255, 'Check date must only consist of 255 characters'),
  bankCode: z.string().min(1, 'Bank code is required').max(255, 'Bank code must only consist of 255 characters'),
  bankCodeLabel: z.string().min(1, 'Bank code is required').max(255, 'Bank code must only consist of 255 characters'),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .max(255, 'Amount must only consist of 255 characters')
    .refine(value => !isNaN(Number(value)), 'Amount must be a number'),
  cycle: z.string().min(1, 'Cycle is required').max(255, 'Cycle must only consist of 255 characters'),
  interestRate: z
    .string()
    .min(1, 'Interest rate is required')
    .max(255, 'Interest rate must only consist of 255 characters')
    .refine(value => !isNaN(Number(value)), 'Interest rate must be a number'),
  entries: z.array(entriesSchema).min(1, 'Pease add atleast 1 entry'),
  isEduc: z.boolean().optional().or(z.literal(false)),
});

export const updateLoanReleaseSchema = z.object({
  amount: z
    .string()
    .min(1, 'Amount is required')
    .max(255, 'Amount must only consist of 255 characters')
    .refine(value => !isNaN(Number(value)), 'Amount must be a number'),
  cycle: z.string().min(1, 'Cycle is required').max(255, 'Cycle must only consist of 255 characters'),
  interestRate: z
    .string()
    .min(1, 'Interest rate is required')
    .max(255, 'Interest rate must only consist of 255 characters')
    .refine(value => !isNaN(Number(value)), 'Interest rate must be a number'),
});

export type LoanReleaseFormData = z.infer<typeof loanReleaseSchema>;
export type UpdateLoanReleaseFormData = z.infer<typeof updateLoanReleaseSchema>;
export type EntryFormData = z.infer<typeof entriesSchema>;
