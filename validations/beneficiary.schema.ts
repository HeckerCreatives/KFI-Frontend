import z from 'zod';

export const beneficiarySchema = z.object({
  name: z.string().min(1, 'Beneficiary Name is required'),
  relationship: z.string().min(1, 'Beneficiary Name is required'),
});

export type BeneficiaryFormData = z.infer<typeof beneficiarySchema>;
