import { NextFunction, Request, Response } from 'express';
import { config } from '../../constants';

import { User, UserLogin } from '../../interfaces';
import { AuthService } from '../auth';
import { AppError } from '../error';
import { UserLoginRes, UserService } from './user-service';
import {
  validateLoginUserData,
  validateRegisterUserData,
} from './user-validator';

interface Deps {
  authService: AuthService;
  userService: UserService;
}

export class UserController {
  constructor(private readonly deps: Deps) {}

  public getMe = (req: Request, res: Response, next: NextFunction) => {
    this.deps.userService
      .findUser(res.locals.userId)
      .then((r) => res.json(r))
      .catch(() => next());
  };

  public postLogin = (req: Request, res: Response, next: NextFunction) => {
    const data: UserLogin = req.body;

    const { errors } = validateLoginUserData({
      id: parseInt((data?.id as unknown) as string),
    });

    if (errors.length) {
      throw new AppError(errors, 400);
    }

    this.deps.authService
      .login(data.id)
      .catch((e) => next(e))
      .then((tokens: UserLoginRes) => {
        res.cookie('access-token', tokens.accessToken, {
          expires: new Date(
            Date.now() + config.auth.accessToken.expirationTime,
          ),
        });

        res.json(tokens);
      });
  };

  public postRegister = (req: Request, res: Response, next: NextFunction) => {
    const data: User = req.body;

    const { errors } = validateRegisterUserData(data);

    if (errors.length) {
      throw new AppError(errors, 400);
    }

    this.deps.userService
      .register(data)
      .catch((e) => next(e))
      .then((r) => res.json(r));
  };
}
