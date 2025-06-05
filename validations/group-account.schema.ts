import z from 'zod';

export const groupAccountSchema = z.object({
  code: z.string().min(1, 'Chart of account is required'),
});

export type GroupAccountFormData = z.infer<typeof groupAccountSchema>;
