import z from 'zod';

export const fschema = z.object({
  reportCode: z.string().min(1, 'Report code is required'),
  reportName: z.string().min(1, 'Report name is required'),
  type: z.string().min(1, 'Type is required'),
  primaryYear: z.string().min(1, 'Primary year is required'),
  primaryMonth: z.string().min(1, 'Primary month is required'),
  secondaryYear: z.string().optional(),
  secondaryMonth: z.string().optional(),
});

export const entries = z.object({
  _id: z.string().optional(),
  financialStatement: z.string().optional(),
  line: z.string().optional(),
  acctCode: z.string().min(1, 'Account code is required'),
  acctCodeName: z.string().optional(),
  acctCodeDescription: z.string().optional(),
  remarks: z.string().min(1, 'Remarks is required'),
  amountType: z.string().min(1, 'Amount type is required'),
 
});

export const fsentriesschema = z.object({
  title: z.string().min(1, 'Title is required'),
  subTitle: z.string().min(1, 'Subtitle is required'),
  entries: z.array(entries).min(1, 'Entries is required'),

  reportCode: z.string().optional(),
  reportName: z.string().optional(),
  type: z.string().optional(),
  primaryYear: z.string().optional(),
  primaryMonth: z.string().optional(),
  secondaryYear: z.string().optional(),
  secondaryMonth: z.string().optional(),
 
});

export type FSFormData = z.infer<typeof fschema>;
export type FSEntriesFormData = z.infer<typeof fsentriesschema>;
