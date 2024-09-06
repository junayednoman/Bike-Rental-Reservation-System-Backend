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
router.post(
  '/payment-success/:transactionId',
  RentalControllers.advancePaymentSuccess,
);
router.post(
  '/payment-fail/:transactionId',
  RentalControllers.advancePaymentFail,
);

export const RentalRoutes = { router };
