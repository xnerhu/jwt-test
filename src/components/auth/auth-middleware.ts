import { NextFunction, Request, Response } from 'express';

import { AuthService } from './auth-service';

interface IDeps {
  authService: AuthService;
}

export const withAuthHandler = ({ authService }: IDeps) => (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const accessToken = req.cookies['access-token'];

  authService
    .verify(accessToken)
    .then((r) => {
      res.locals.userId = r.data.userId;
      next();
    })
    .catch((err) => next(err));
};
