import { Router } from 'express';
import { authValidations } from './auth.validations';
import { validateDataByZod } from '../../middleware/validateDataByZod';
import { AuthController } from './auth.controller';
import { authVerify } from '../../middleware/authVerify';

const authRouter = Router();
const userRouter = Router();
authRouter.post(
  '/signup',
  validateDataByZod(authValidations.createUserValidationSchema),
  AuthController.createUser,
);

authRouter.post(
  '/login',
  validateDataByZod(authValidations.loginUserValidationSchema),
  AuthController.loginUser,
);

authRouter.post(
  '/generate-access-token',
  AuthController.generateNewAccessToken,
);

// user routes
userRouter.get('/me', AuthController.getProfile);

userRouter.put(
  '/me',
  validateDataByZod(authValidations.updateUserProfileValidationSchema),
  AuthController.updateUserProfile,
);

userRouter.get('/', authVerify(['admin']), AuthController.getAllUsers);

userRouter.delete('/:id', authVerify(['admin']), AuthController.deleteUser);

userRouter.put('/:id', authVerify(['admin']), AuthController.updateUserRole);

export const AuthRoutes = { authRouter, userRouter };
