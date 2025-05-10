import z from 'zod';

export const businessTypeSchema = z.object({
  type: z.string().min(1, 'Business Type is required'),
});

export type BusinessTypeFormData = z.infer<typeof businessTypeSchema>;
