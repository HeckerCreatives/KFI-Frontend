import z from 'zod';

export const soaSchema = z.object({
  loanReleaseId: z.string().min(1, 'Loan release is required'),
  loanReleaseLabel: z.string().min(1,'Loan release is required'),
  clientId: z.string().optional(),
  type: z.string().optional(),
});

export type SoaFormData = z.infer<typeof soaSchema>;
