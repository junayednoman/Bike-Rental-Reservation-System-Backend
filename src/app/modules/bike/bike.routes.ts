import { Router } from 'express';
import { validateDataByZod } from '../../middleware/validateDataByZod';
import { BikeValidation } from './bike.validation';
import { BikeControllers } from './bike.controller';
import { authVerify } from '../../middleware/authVerify';

const router = Router();
router.post(
  '/',
  authVerify(['admin']),
  validateDataByZod(BikeValidation.bikeValidationSchema),
  BikeControllers.createBike,
);

router.get('/', BikeControllers.getAllBikes);
router.get('/:bikeId', BikeControllers.getSingleBike);

router.put(
  '/:id',
  authVerify(['admin']),
  validateDataByZod(BikeValidation.updateBikeValidationSchema),
  BikeControllers.updateBike,
);
router.delete('/:id', authVerify(['admin']), BikeControllers.deleteBike);

export const BikeRoutes = { router };
