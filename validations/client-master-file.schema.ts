import z from 'zod';
import { beneficiarySchema } from './beneficiary.schema';
import { childrenSchema } from './children.schema';

const MAX_FILE_SIZE = 5 * 1024 * 1024 
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

export const clientMasterFileSchema = z.object({
clientImage: z
  .union([
    z
      .instanceof(File)
      .refine((file) => file.size <= MAX_FILE_SIZE, "Max file size is 5MB.")
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Only .jpg, .jpeg, .png and .webp files are accepted."
      ),
    z.string().or(z.literal('')),
  ])
  .optional(),


  name: z.string().min(1, 'Name is required')
  .max(20, "Name must not exceed 20 characters"),
  address: z.string().min(1, 'Address is required')
  .max(100, "Address must not exceed 100 characters"),
  city: z.string().min(1, 'City is required')
  .max(25, "City must not exceed 25 characters"),
  zipCode: z.string().min(1, 'Zip code is required')
  .max(6, "Zipcode must not exceed 6 characters"),
  telNo: z.string().optional().or(z.literal('')),
  mobileNo: z.string().min(1, 'Mobile No. is required')
  .max(11, "Mobile no must not exceed 11 numbers"),
  birthdate: z.string().min(1, 'Birth Date is required'),
  birthplace: z.string().min(1, 'Birth Place is required')
  .max(250, "Birtplace must not exceed 250 numbers"),
  age: z.string().min(1, 'Age is required')
  .max(3, "Age must not exceed 3 numbers"),
  sex: z.string().min(1, 'Sex is required'),
  spouse: z.string().min(1, 'Spouse is required').optional().or(z.literal('')),
  civilStatus: z.string().min(1, 'Civil Status is required'),
  parent: z.string().min(1, 'Parent is required').optional().or(z.literal('')),
  memberStatus: z.string().min(1, 'Member status is required'),
  memberStatusLabel: z.string().min(1, 'Member status is required'),
  center: z.string().min(1, 'Center is required'),
  centerLabel: z.string().min(1, 'Center label is required'),
  acctOfficer: z.string().min(1, 'Account officer is required'),
  dateRelease: z.string().min(1, 'Date release is required'),
  business: z.string().min(1, 'Business is required'),
  businessLabel: z.string().min(1, 'Business label is required'),
  position: z.string().min(1, 'Position is required'),
  acctNumber: z.string().min(1, 'Account No. is required'),
  dateResigned: z.string().min(1, 'Date resigned is required').optional().or(z.literal('')),
  reason: z.string().min(1, 'Reason is required').optional().or(z.literal('')),
  beneficiary: z.array(beneficiarySchema).optional(),
  bankAccountNo: z.string().min(1, 'Bank account no is required'),
  children: z.array(childrenSchema).optional(),
});

export type ClientMasterFileFormData = z.infer<typeof clientMasterFileSchema>;
