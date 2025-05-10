import z from 'zod';

export const natureSchema = z.object({
  type: z.string().min(1, 'Business Type is required'),
});

export type NatureFormData = z.infer<typeof natureSchema>;
