import { Router } from 'express';
import { validateDataByZod } from '../../middleware/validateDataByZod';
import { RentalValidations } from './rental.validation';
import { RentalControllers } from './rental.controller';

const router = Router();

router.post(
  '/',
  validateDataByZod(RentalValidations.rentalValidationSchema),
  RentalControllers.createRental,
);

export const RentalRoutes = { router };
