import { Connection, Repository } from 'typeorm';
import { sign, verify } from 'jsonwebtoken';
import { hash, compare } from 'bcryptjs';

import { config } from '../../constants';
import { Token, TokenType } from '../../interfaces';
import { AppError } from '../error';
import { RefreshTokenEntity } from './refresh-token-entity';
import { UserEntity } from '../user';

interface Deps {
  db: Connection;
}

export class AuthService {
  private readonly userRepo: Repository<UserEntity>;

  private readonly refreshTokenRepo: Repository<RefreshTokenEntity>;

  constructor(private readonly deps: Deps) {
    this.userRepo = this.deps.db.getRepository(UserEntity);
    this.refreshTokenRepo = this.deps.db.getRepository(RefreshTokenEntity);
  }

  public async login(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new AppError(`User with that id does not exists!`, 404);
    }

    const accessToken = this.createAccessToken(userId);
    const refreshToken = this.createRefreshToken(userId);

    await this.addRefreshToken(refreshToken);

    return { accessToken, refreshToken };
  }

  public verify(accessToken: string) {
    return this.decodeToken(accessToken, config.auth.accessToken.secret);
  }

  private createToken(
    userId: number,
    type: TokenType,
    secret: string,
    expiresIn: number,
  ) {
    const token: Token = { type, data: { userId } };

    return sign(token, secret, { expiresIn });
  }

  public createAccessToken(userId: number) {
    return this.createToken(
      userId,
      'ACCESS_TOKEN',
      config.auth.accessToken.secret,
      config.auth.accessToken.expirationTime,
    );
  }

  public createRefreshToken(userId: number) {
    return this.createToken(
      userId,
      'REFRESH_TOKEN',
      config.auth.refreshToken.secret,
      config.auth.refreshToken.expirationTime,
    );
  }

  public decodeToken(token: string, secret: string): Promise<Token> {
    return new Promise((resolve, reject) => {
      if (!token) {
        return reject(new AppError('Unauthorized token', 401));
      }

      verify(token, secret, (err: Error, token: Token) => {
        if (err) reject(new AppError('Forbidden', 403));
        else resolve(token);
      });
    });
  }

  public hashString(value: string) {
    return new Promise<string>((resolve, reject) => {
      hash(value, 10, (err: Error, encrypted: string) => {
        if (err) reject(err);
        else resolve(encrypted);
      });
    });
  }

  public compareHashed(value: string, hashedValue: string) {
    return new Promise<boolean>((resolve, reject) => {
      compare(value, hashedValue, (err: Error, same: boolean) => {
        if (err) reject(err);
        else resolve(same);
      });
    });
  }

  public addRefreshToken(token: string) {
    return this.refreshTokenRepo.insert({ data: token });
  }

  public refreshTokenExists(token: string) {
    return this.refreshTokenRepo
      .findOne({ where: { data: token } })
      .then((r) => r != null);
  }

  public deleteToken(token: string) {
    return this.refreshTokenRepo.delete({ data: token }).then((r) => r != null);
  }
}
