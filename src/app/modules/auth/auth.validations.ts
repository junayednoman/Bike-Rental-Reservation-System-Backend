import { z } from 'zod';

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required!' }),
    email: z.string({ required_error: 'Email is required!' }),
    password: z.string({ required_error: 'Password is required!' }),
    phone: z.number({ required_error: 'Phone is required!' }),
    address: z.string().optional(),
    role: z.enum(['admin', 'user'], {
      required_error: 'User role is required!',
    }),
  }),
});

const loginUserValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required!' }),
    password: z.string({ required_error: 'Password is required!' }),
  }),
});

export const authValidations = {
  createUserValidationSchema,
  loginUserValidationSchema,
};
