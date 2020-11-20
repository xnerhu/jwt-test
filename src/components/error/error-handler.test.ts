import 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';

import * as logger from '../logger';
import { ErrorHandler } from './error-handler';
import { AppError } from './app-error';

describe('components/error/error-handler', () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  describe('handle()', () => {
    it('should log error and exit process', async () => {
      const exitStub = sandbox.stub(process, 'exit');

      class LoggerMock extends logger.Logger {
        public info() {}
        public warn() {}
        public error(...args: any[]) {}
        public flush(): Promise<void> {
          return null;
        }
      }

      const instance = sandbox.createStubInstance(LoggerMock, {
        error: sandbox.stub(),
        flush: sandbox.stub(),
      });

      const errHandler = new ErrorHandler({ logger: instance });

      const err = new Error();

      await errHandler.handle(err);

      expect(instance.error.calledWith(err)).equals(
        true,
        'Error is not logged',
      );
      expect(instance.flush.calledOnce).equals(true, 'Logger is not flushed');
      expect(exitStub.calledOnce).equals(true, `Process didin\'t exited`);
    });
  });

  describe('isTrusted()', () => {
    it('should return true if error is operational', async () => {
      const errHandler = new ErrorHandler({ logger: null });

      expect(errHandler.isTrusted(new AppError(null, null, true))).equals(true);
    });

    it('should return false if error is not operational', async () => {
      const errHandler = new ErrorHandler({ logger: null });

      expect(errHandler.isTrusted(new Error())).equals(false);
    });
  });
});
