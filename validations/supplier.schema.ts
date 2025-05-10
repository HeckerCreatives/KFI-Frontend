import z from 'zod';

export const supplierSchema = z.object({
  code: z.string().min(1, 'Center Code is required'),
  description: z.string().min(1, 'Description is required'),
});

export type SupplierFormData = z.infer<typeof supplierSchema>;
