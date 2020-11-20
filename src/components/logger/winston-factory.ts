import { resolve } from 'path';
import * as winston from 'winston';

/* istanbul ignore next */
export class WinstonFactory {
  public static create(path: string): winston.Logger {
    return winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp({
          format: `DD.MM.YYYY hh:mm:ss`,
        }),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level} | ${info.message}`,
        ),
      ),
      transports: [
        new winston.transports.File({
          filename: resolve(path, 'info.log'),
          level: 'info',
        }),
        new winston.transports.File({
          filename: resolve(path, 'warns.log'),
          level: 'warn',
        }),
        new winston.transports.File({
          filename: resolve(path, 'errors.log'),
          level: 'error',
        }),
      ],
    });
  }
}
