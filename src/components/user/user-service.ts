import { Connection, Repository } from 'typeorm';

import { Token, User, UserLogin } from '../../interfaces';
import { AuthService } from '../auth';
import { AppError } from '../error';
import { UserEntity } from './user-entity';

interface Deps {
  db: Connection;
}

export interface UserLoginRes {
  accessToken: string;
  refreshToken: string;
}

export class UserService {
  private readonly userRepo: Repository<UserEntity>;

  constructor(private readonly deps: Deps) {
    this.userRepo = this.deps.db.getRepository(UserEntity);
  }

  public findUser(id: number) {
    return this.userRepo.findOne({
      where: { id },
    });
  }

  public async register(data: User) {
    const res = await this.userRepo.findOne({
      where: { address: data.address },
    });

    if (res != null) {
      throw new AppError(`User with this address already exists!`, 409);
    }

    return this.userRepo.insert(data);
  }
}
