import { Router } from 'express';
import { validateDataByZod } from '../../middleware/validateDataByZod';
import { RentalValidations } from './rental.validation';
import { RentalControllers } from './rental.controller';
import { authVerify } from '../../middleware/authVerify';

const router = Router();

router.post(
  '/',
  validateDataByZod(RentalValidations.rentalValidationSchema),
  RentalControllers.createRental,
);

router.put('/:id/return', authVerify(['admin']), RentalControllers.returnBike);
router.get('/', RentalControllers.getAllRentals);

export const RentalRoutes = { router };
