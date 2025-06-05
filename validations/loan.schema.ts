import z from 'zod';

export const loanCodeSchema = z.object({
  module: z.string().min(1, 'Module is required'),
  loanType: z.string().min(1, 'Loan type is required'),
  acctCodeLabel: z.string().min(1, 'Account Code is required'),
  acctCode: z.string().min(1, 'Account Code is required'),
  sortOrder: z.string().min(1, 'Sort Order is required'),
});

export const updateCodeSchema = z.object({
  module: z.string().min(1, 'Module is required'),
  loanType: z.string().min(1, 'Loan type is required'),
  acctCodeLabel: z.string().min(1, 'Account Code is required'),
  acctCode: z.string().min(1, 'Account Code is required'),
  sortOrder: z.string().min(1, 'Sort Order is required'),
});

export const productSchema = z
  .object({
    code: z.string().min(1, 'Code is required'),
    loanCodes: z.array(loanCodeSchema),
  })
  .superRefine((data, ctx) => {
    if (data.loanCodes.length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please add a loan code',
        path: ['code'],
      });
    }
  });

export const updateProductSchema = z.object({
  code: z.string().min(1, 'Code is required'),
});

export type ProductLoanFormData = z.infer<typeof productSchema>;
export type UpdateProductLoanFormData = z.infer<typeof updateProductSchema>;

export type LoanCodeFormData = z.infer<typeof loanCodeSchema>;
