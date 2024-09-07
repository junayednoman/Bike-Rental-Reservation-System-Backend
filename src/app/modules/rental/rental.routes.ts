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
  '/advance-payment-success/:transactionId',
  RentalControllers.advancePaymentSuccess,
);
router.post(
  '/advance-payment-fail/:transactionId',
  RentalControllers.advancePaymentFail,
);
router.get('/:id', RentalControllers.getSingleRental);
router.post('/:id', RentalControllers.makePayment);

router.post(
  '/payment-success/:rentalId/:transactionId',
  RentalControllers.paymentSuccess,
);
router.post('/payment-fail/:transactionId', RentalControllers.paymentFail);

export const RentalRoutes = { router };
