import winston from 'winston';

import { Logger } from './logger';

interface IDeps {
  winston: winston.Logger;
}

export class WinstonLogger extends Logger {
  private readonly instance: winston.Logger;

  constructor({ winston }: IDeps) {
    super();

    this.instance = winston;
  }

  public info(...args: any[]) {
    this.instance.info(args);
  }

  public warn(...args: any[]) {
    this.instance.warn(args);
  }

  public error(...args: any[]) {
    this.instance.error(args);
  }

  public flush() {
    return new Promise<void>((resolve) => {
      this.instance.once('finish', () => resolve());
      this.instance.end();
    });
  }
}
