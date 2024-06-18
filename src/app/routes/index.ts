import { Router } from 'express';

const router = Router();

const apiRoutes = [
  { path: '/students', route: studentRoute },
];

apiRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
