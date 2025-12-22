import { z } from "zod";

export const glSchema = z.object({
  dateFrom: z.string().nonempty( 'Date from is required'),
  dateTo: z.string().nonempty('Date to is required'),
  codeFrom: z.string().nonempty('Code from is required'),
  codeTo: z.string().nonempty('Code to is required'),
  withBeginningBalance: z.boolean(),
  acctCodeId: z.string().optional(),
    acctCode: z.string().optional(),
    type: z.string().optional()

});


export type GLFormData = z.infer<typeof glSchema>;
