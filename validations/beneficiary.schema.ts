import z from 'zod';

export const beneficiarySchema = z
  .object({
    name: z.string().min(1, 'Beneficiary Name is required').optional().or(z.literal('')),
    relationship: z.string().min(1, 'Beneficiary Name is required').optional().or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    if (data.name && !data.relationship) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Relationship is required',
        path: [data.name ? 'relationship' : 'name'],
      });
    }

    if (!data.name && data.relationship) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Beneficiary is required',
        path: [data.name ? 'relationship' : 'name'],
      });
    }
  });

export type BeneficiaryFormData = z.infer<typeof beneficiarySchema>;
