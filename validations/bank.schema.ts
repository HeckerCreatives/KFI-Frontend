import z from 'zod';

export const bankSchema = z.object({
  code: z.string().min(1, 'Center Code is required'),
  description: z.string().min(1, 'Description is required'),
});

export type BankFormData = z.infer<typeof bankSchema>;
