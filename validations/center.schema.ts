import z from 'zod';

export const centerSchema = z.object({
  centerNo: z.string().min(1, 'Center Code is required'),
  description: z.string().min(1, 'Description is required').optional().or(z.literal('')),
  location: z.string().min(1, 'Location is required').optional().or(z.literal('')),
  centerChief: z.string().min(1, 'Center Chief is required').optional().or(z.literal('')),
  treasurer: z.string().min(1, 'Treasurer is required').optional().or(z.literal('')),
  acctOfficer: z.string().min(1, 'Account Officer is required'),
});

export type CenterFormData = z.infer<typeof centerSchema>;
