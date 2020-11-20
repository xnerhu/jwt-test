import { resolve } from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const {
  NETWORK_PORT,
  PATH_LOGS,
  TYPEORM_TYPE,
  TYPEORM_HOST,
  TYPEORM_USERNAME,
  TYPEORM_PASSWORD,
  TYPEORM_DATABASE,
  TYPEORM_PORT,
  TYPEORM_SYNCHRONIZE,
  TYPEORM_LOGGING,
  AUTH_REFRESH_TOKEN_SECRET,
  AUTH_REFRESH_TOKEN_EXPIRATION_TIME,
  AUTH_ACCESS_TOKEN_SECRET,
  AUTH_ACCESS_TOKEN_EXPIRATION_TIME,
} = process.env;

export const config = {
  network: {
    port: parseInt(NETWORK_PORT),
  },
  paths: {
    logs: resolve(PATH_LOGS),
  },
  typeorm: {
    type: TYPEORM_TYPE as any,
    host: TYPEORM_HOST,
    port: parseInt(TYPEORM_PORT),
    username: TYPEORM_USERNAME,
    password: TYPEORM_PASSWORD,
    database: TYPEORM_DATABASE,
    synchronize: !!TYPEORM_SYNCHRONIZE,
    logging: !!TYPEORM_LOGGING,
  },
  auth: {
    accessToken: {
      secret: AUTH_ACCESS_TOKEN_SECRET,
      expirationTime: parseInt(AUTH_ACCESS_TOKEN_EXPIRATION_TIME),
    },
    refreshToken: {
      secret: AUTH_REFRESH_TOKEN_SECRET,
      expirationTime: parseInt(AUTH_REFRESH_TOKEN_EXPIRATION_TIME),
    },
  },
};
