import z from 'zod';

export const banSchema = z.object({
  status: z.string().min(1, 'Status is required'),
});

export type BanFormData = z.infer<typeof banSchema>;
