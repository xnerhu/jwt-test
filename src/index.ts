import { RefreshTokenEntity } from './components/auth/refresh-token-entity';
import {
  ErrorHandler,
  handleNodeErrors,
  withErrorHandler,
} from './components/error';
import { WinstonFactory } from './components/logger';
import { WinstonLogger } from './components/logger/winston-logger';
import { createServer, createTypeormConnection } from './components/network';
import { UserEntity } from './components/user';

import { config } from './constants';

async function main() {
  const logger = new WinstonLogger({
    winston: WinstonFactory.create(config.paths.logs),
  });

  const errorHandler = new ErrorHandler({ logger });

  handleNodeErrors({ errorHandler });

  const dbConnection = await createTypeormConnection([
    UserEntity,
    RefreshTokenEntity,
  ]);

  const app = createServer({ errorHandler, dbConnection });

  app.listen(config.network.port, () => {
    console.log(`Server listens on port ${config.network.port}!`);
  });
}

main();
