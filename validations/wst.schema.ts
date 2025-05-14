import z from 'zod';

export const weeklySavingTableSchema = z
  .object({
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
    weeklySavingsFund: z
      .string()
      .min(1, 'WSF is required')
      .refine(value => !isNaN(Number(value)), 'WSF must be a number')
      .refine(value => Number(value) >= 0, 'WSF must be positive'),
  })
  .refine(data => Number(data.rangeAmountTo) >= Number(data.rangeAmountFrom), { path: ['rangeAmountTo'], message: 'Range amount to must not be less than range amount from' });

export type WeeklySavingTableFormData = z.infer<typeof weeklySavingTableSchema>;
