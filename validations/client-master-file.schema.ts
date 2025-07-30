import z from 'zod';

export const clientMasterFileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  telNo: z.string().optional().or(z.literal('')),
  mobileNo: z.string().min(1, 'Mobile No. is required'),
  birthdate: z.string().min(1, 'Birth Date is required'),
  birthplace: z.string().min(1, 'Birth Place is required'),
  age: z.string().min(1, 'Age is required'),
  sex: z.string().min(1, 'Sex is required'),
  spouse: z.string().min(1, 'Spouse is required').optional().or(z.literal('')),
  civilStatus: z.string().min(1, 'Civil Status is required'),
  parent: z.string().min(1, 'Parent is required').optional().or(z.literal('')),
  memberStatus: z.string().min(1, 'Member status is required'),
  groupNumber: z.string().min(1, 'Group No. is required'),
  groupNumberLabel: z.string().min(1, 'Group No. is required'),
  center: z.string().min(1, 'Center is required'),
  centerLabel: z.string().min(1, 'Center label is required'),
  acctOfficer: z.string().min(1, 'Account officer is required'),
  dateRelease: z.string().min(1, 'Date release is required'),
  business: z.string().min(1, 'Business is required'),
  businessLabel: z.string().min(1, 'Business label is required'),
  position: z.string().min(1, 'Position is required'),
  acctNumber: z.string().min(1, 'Account No. is required'),
  dateResigned: z.string().min(1, 'Date resigned is required').optional().or(z.literal('')),
  newStatus: z.string().min(1, 'New Status is required'),
  reason: z.string().min(1, 'Reason is required').optional().or(z.literal('')),
});

export type ClientMasterFileFormData = z.infer<typeof clientMasterFileSchema>;
