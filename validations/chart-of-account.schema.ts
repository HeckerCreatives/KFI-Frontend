import z from 'zod';

export const chartOfAccountSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  description: z.string().min(1, 'Description is required'),
  classification: z.string().min(1, 'Classification is required'),
  nature: z.string().min(1, 'Nature of Account is required'),
  groupAccount: z.string().min(1, 'Group Account is required'),
  closingAccount: z.string().min(1, 'Closing Account is required'),
  fsCode: z.string().min(1, 'FS Code is required'),
  mainAcctNo: z.string().min(1, 'Main Account No. is required'),
  subAcctNo: z.string().min(1, 'Sub Account No. is required'),
  branchCode: z.string().min(1, 'Branch Code is required'),
  sequence: z.string().min(1, 'Sequence is required'),
  parent: z.string().min(1, 'Parent is required'),
  indention: z.string().min(1, 'Indention is required'),
  detailed: z.boolean(),
});

export type ChartOfAccountFormData = z.infer<typeof chartOfAccountSchema>;
