import { z } from 'zod';

const rentalValidationSchema = z.object({
  body: z.object({
    rentalData: z.object({
      userId: z.string().optional(),
      bikeId: z.string({ required_error: 'bikeId is required!' }),
      startTime: z.string({ required_error: 'start time is required!' }),
      returnTime: z.string().optional(),
      totalCost: z.string().optional(),
      isReturned: z.string().optional(),
    }),
  }),
});

export const RentalValidations = { rentalValidationSchema };
