import z from 'zod';

export const natureSchema = z.object({
  nature: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
});

export type NatureFormData = z.infer<typeof natureSchema>;
