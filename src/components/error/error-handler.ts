import { AppError } from '../error';
import { Logger } from '../logger';

interface IDeps {
  logger: Logger;
}

export class ErrorHandler {
  private readonly logger: Logger;

  constructor(deps: IDeps) {
    this.logger = deps.logger;
  }

  public handle = async (err: Error) => {
    if (!this.isTrusted(err)) {
      this.exitApp(err);
    }
  };

  public exitApp = async (err: Error) => {
    this.logger.error(err);
    await this.logger.flush();

    console.log(err.stack);

    process.exit(1);
  };

  public isTrusted(err: Error) {
    if (err instanceof AppError) {
      return err.operational;
    }

    return false;
  }
}
