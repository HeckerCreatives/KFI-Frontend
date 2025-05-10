import z from 'zod';

export const loanSchema = z.object({
  code: z.string().min(1, 'Center Code is required'),
  description: z.string().min(1, 'Description is required'),
});

export type LoanFormData = z.infer<typeof loanSchema>;

export const loanSetUpCodeSchema = z.object({
  loanCode: z.string().min(1, 'Loan Code is required'),
  module: z.string().min(1, 'Module is required'),
  loanType: z.string().min(1, 'Loan type is required'),
  acctCode: z.string().min(1, 'Account Code is required'),
  sortOrder: z.string().min(1, 'Sort Order is required'),
});

export type LoanSetUpCodeFormData = z.infer<typeof loanSetUpCodeSchema>;
