import { AuthService } from './components/auth';
import { RefreshTokenEntity } from './components/auth/refresh-token-entity';
import { ErrorHandler, handleNodeErrors } from './components/error';
import { WinstonFactory } from './components/logger';
import { WinstonLogger } from './components/logger/winston-logger';
import { createServer, createTypeormConnection } from './components/network';
import { UserController, UserEntity } from './components/user';
import { UserService } from './components/user/user-service';

import { config } from './constants';

async function main() {
  const logger = new WinstonLogger({
    winston: WinstonFactory.create(config.paths.logs),
  });

  const errorHandler = new ErrorHandler({ logger });

  handleNodeErrors({ errorHandler });

  const db = await createTypeormConnection([UserEntity, RefreshTokenEntity]);

  const authService = new AuthService({ db });
  const userService = new UserService({ db });
  const userController = new UserController({ authService, userService });

  const app = createServer({ errorHandler, db, userController, authService });

  app.listen(config.network.port, () => {
    console.log(`Server listens on port ${config.network.port}!`);
  });
}

main();
