import { ErrorHandler } from './error-handler';

interface IDeps {
  errorHandler: ErrorHandler;
}

export const handleNodeErrors = ({ errorHandler }: IDeps) => {
  process.on('uncaughtException', errorHandler.handle);
  process.on('unhandledRejection', errorHandler.handle);
};
