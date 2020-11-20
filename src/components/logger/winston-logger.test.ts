import 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';

import { WinstonLogger } from './winston-logger';

describe('components/logger/winston-logger', () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  describe('info()', () => {
    it('should call winston.info', () => {
      const stub = sandbox.stub();
      const logger = new WinstonLogger({ winston: { info: stub } as any });

      logger.info();

      expect(stub.calledOnce).equals(true);
    });
  });

  describe('warn()', () => {
    it('should call winston.warn', () => {
      const stub = sandbox.stub();
      const logger = new WinstonLogger({ winston: { warn: stub } as any });

      logger.warn();

      expect(stub.calledOnce).equals(true);
    });
  });

  describe('error()', () => {
    it('should call winston.error', () => {
      const stub = sandbox.stub();
      const logger = new WinstonLogger({ winston: { error: stub } as any });

      logger.error();

      expect(stub.calledOnce).equals(true);
    });
  });

  describe('flush()', () => {
    it('should resolve when winston finishes', async () => {
      const mock = {
        once: sandbox.spy((event, cb) => cb()),
        end: sandbox.stub(),
      };

      const logger = new WinstonLogger({
        winston: mock as any,
      });

      await logger.flush();

      expect(mock.end.calledOnce).equals(true, `Winston isn't closed`);
      expect(mock.once.calledOnce && mock.once.args[0][0] === 'finish').equals(
        true,
        `Winston finish callback isn't resolved`,
      );
    });
  });
});
