import z from 'zod';

export const chartOfAccountSchema = z.object({
  groupAccount: z.string().min(1, 'Group of Account is required'),
  groupAccountLabel: z.string().min(1, 'Group of Account is required'),
});

export type ChartOfAccountFormData = z.infer<typeof chartOfAccountSchema>;
