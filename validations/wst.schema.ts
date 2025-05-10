import z from 'zod';

export const weeklySavingTableSchema = z.object({
  rangeAmountFrom: z
    .string()
    .min(1, 'Range amount from is required')
    .refine(value => !isNaN(Number(value)), 'Range amount from must be a number')
    .refine(value => Number(value) >= 0, 'Range amount from must be positive'),
  rangeAmountTo: z
    .string()
    .min(1, 'Range amount to is required')
    .refine(value => !isNaN(Number(value)), 'Range amount to must be a number')
    .refine(value => Number(value) >= 0, 'Range amount to must be positive'),
  wsf: z
    .string()
    .min(1, 'WSF is required')
    .refine(value => !isNaN(Number(value)), 'WSF must be a number')
    .refine(value => Number(value) >= 0, 'WSF must be positive'),
});

export type WeeklySavingTableFormData = z.infer<typeof weeklySavingTableSchema>;
