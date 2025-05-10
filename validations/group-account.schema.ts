import z from 'zod';

export const groupAccountSchema = z.object({
  code: z.string().min(1, 'Business Type is required'),
});

export type GroupAccountFormData = z.infer<typeof groupAccountSchema>;
