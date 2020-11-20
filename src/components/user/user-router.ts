import { Router } from 'express';
import { AuthService } from '../auth';

import { withAuthHandler } from '../auth/auth-middleware';
import { UserController } from './user-controller';

interface Deps {
  authService: AuthService;
  userController: UserController;
}

export const userRouter = ({ authService, userController }: Deps) => {
  const router = Router();

  router.get('/me', withAuthHandler({ authService }), userController.getMe);
  router.post('/login', userController.postLogin);
  router.post('/register', userController.postRegister);

  return router;
};
