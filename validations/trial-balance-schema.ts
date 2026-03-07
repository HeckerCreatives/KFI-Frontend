import z from 'zod';

export const tbchema = z.object({
   _id: z.string().optional(),
  id: z.string().optional(),
  action: z.string().optional(),
  synced: z.any().optional(),
  line: z.any().optional(),
  reportCode: z.string().min(1, 'Report code is required'),
  reportName: z.string().min(1, 'Report name is required'),
  title: z.string().optional(),
  subTitle: z.string().optional(),
});

export const entries = z.object({
  _id: z.string().optional(),
  id: z.string().optional(),
  line: z.any().optional(),
  _synced: z.boolean().optional(),
  action: z.string().optional(),
  synced: z.any().optional(),
  acctCode: z.string().min(1, 'Account code is required'),
  acctCodeName: z.string().optional(),
  acctCodeDescription: z.string().optional(),
  remarks: z.string().min(1, 'Remarks is required'),
 
});

export const tbentriesschema = z.object({
  title: z.string().min(1, 'Title is required'),
  subTitle: z.string().min(1, 'Subtitle is required'),
  entries: z.array(entries).min(1, 'Entries is required'),

  reportCode: z.string().optional(),
  reportName: z.string().optional(),
 
});

export const tbreport = z.object({
 dateFrom: z.string().nonempty( 'Date from is required'),
  dateTo: z.string().nonempty('Date to is required'),
  accountingYear: z.string().optional(),
  reportCode: z.string().optional(),
  includeBalance: z.boolean().optional(),
  summarizeBalance: z.boolean().optional(),
 message: z.string().optional(),
 displayZero: z.boolean().optional(),
  type:z.string().optional()
 
});

export type TBFormData = z.infer<typeof tbchema>;
export type TBEntriesFormData = z.infer<typeof tbentriesschema>;
export type TBReportForm = z.infer<typeof tbreport>;
