import z from 'zod';

export const statusSchema = z.object({
  code: z.string().min(1, 'Center Code is required'),
  description: z.string().min(1, 'Description is required'),
});

export type StatusFormData = z.infer<typeof statusSchema>;
