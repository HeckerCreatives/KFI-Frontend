import z from 'zod';

export const officialReceiptSchema = z.object({
  cvNo: z.string().min(1, 'CV # is required').max(255, 'CV # must only consist of 255 characters'),
  center: z.string().min(1, 'Center Code is required').max(255, 'Center Code must only consist of 255 characters'),
  name: z.string().min(1, 'Name is required').max(255, 'Name must only consist of 255 characters'),
  refNumber: z.string().min(1, 'Reference Number is required').max(255, 'Reference Number must only consist of 255 characters'),
  remarks: z.string().min(1, 'Particular is required').max(255, 'Particular must only consist of 255 characters'),
  date: z.string().min(1, 'Date is required').max(255, 'Date must only consist of 255 characters'),
  acctMonth: z.string().min(1, 'Account Month is required').max(255, 'Account Month must only consist of 255 characters'),
  acctYear: z.string().min(1, 'Account Year is required').max(255, 'Account Year must only consist of 255 characters'),
  payee: z.string().min(1, 'User is required').max(255, 'User must only consist of 255 characters'),
  noOfWeeks: z.string().min(1, 'Number of weeks is required').max(255, 'Number of weeks must only consist of 255 characters'),
  typeOfLoan: z.string().min(1, 'Type of loan is required').max(255, 'Type of loan must only consist of 255 characters'),
  checkNo: z.string().min(1, 'Check number is required').max(255, 'Check number must only consist of 255 characters'),
  checkDate: z.string().min(1, 'Check date is required').max(255, 'Check date must only consist of 255 characters'),
  bankCode: z.string().min(1, 'Bank code is required').max(255, 'Bank code must only consist of 255 characters'),
  amount: z.string().min(1, 'Amount is required').max(255, 'Amount must only consist of 255 characters'),
  cycle: z.string().min(1, 'Cycle is required').max(255, 'Cycle must only consist of 255 characters'),
  interestRate: z.string().min(1, 'Interest rate is required').max(255, 'Interest rate must only consist of 255 characters'),
});

export type OfficialReceiptFormData = z.infer<typeof officialReceiptSchema>;
