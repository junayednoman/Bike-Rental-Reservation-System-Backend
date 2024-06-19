import { Router } from 'express';
import { UserControllers } from './auth.controller';
import { authValidations } from './auth.validations';
import { validateDataByZod } from '../../middleware/validateDataByZod';

const authRouter = Router();
const userRouter = Router();
authRouter.post(
  '/signup',
  validateDataByZod(authValidations.createUserValidationSchema),
  UserControllers.createUser,
);

authRouter.post(
  '/login',
  validateDataByZod(authValidations.loginUserValidationSchema),
  UserControllers.loginUser,
);

authRouter.post(
  '/generate-access-token',
  UserControllers.generateNewAccessToken,
);

// user routes
userRouter.get('/me', UserControllers.getProfile);

export const AuthRoutes = { authRouter, userRouter };
