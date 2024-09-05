import { z } from 'zod';

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required!' }),
    email: z.string({ required_error: 'Email is required!' }),
    password: z.string({ required_error: 'Password is required!' }),
    phone: z.string({ required_error: 'Phone is required!' }),
    address: z.string().optional(),
  }),
});

const loginUserValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required!' }),
    password: z.string({ required_error: 'Password is required!' }),
  }),
});

const updateUserProfileValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required!' }).optional(),
    phone: z.string({ required_error: 'Phone is required!' }).optional(),
    address: z.string().optional(),
  }),
});

export const authValidations = {
  createUserValidationSchema,
  loginUserValidationSchema,
  updateUserProfileValidationSchema,
};
