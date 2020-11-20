import express from 'express';
import helmet from 'helmet';
import cookies from 'cookie-parser';
import { Connection } from 'typeorm';

import { AuthService } from '../auth';

import { ErrorHandler, withErrorHandler } from '../error';
import { UserController, userRouter } from '../user';
import { UserService } from '../user/user-service';

interface IDeps {
  errorHandler: ErrorHandler;
  db: Connection;
  userController: UserController;
  authService: AuthService;
}

export const createServer = ({
  errorHandler,
  db,
  userController,
  authService,
}: IDeps) => {
  const app = express();

  const handler = withErrorHandler({ errorHandler });

  app.use(cookies());
  app.use(helmet());
  app.use(express.urlencoded({ extended: true }));
  app.use(userRouter({ userController, authService }));
  app.use(handler);

  return app;
};
