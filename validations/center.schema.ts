import z from 'zod';

export const centerSchema = z.object({
  centerNo: z.string().min(1, 'Center Code is required'),
  description: z.string().min(1, 'Description is required'),
  location: z.string().min(1, 'Location is required'),
  centerChief: z.string().min(1, 'Center Chief is required'),
  treasurer: z.string().min(1, 'Treasurer is required'),
  acctOfficer: z.string().min(1, 'Account Officer is required'),
});

export type CenterFormData = z.infer<typeof centerSchema>;
