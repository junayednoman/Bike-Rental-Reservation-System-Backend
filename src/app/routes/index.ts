import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { BikeRoutes } from '../modules/bike/bike.routes';

const router = Router();

const apiRoutes = [
  { path: '/auth', route: AuthRoutes.authRouter },
  { path: '/users', route: AuthRoutes.userRouter },
  { path: '/bikes', route: BikeRoutes.router },
];

apiRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
