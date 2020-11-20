import 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';

import { ErrorHandler } from './error-handler';
import { withErrorHandler } from './error-handler-middleware';
import { AppError } from './app-error';

describe('components/error/error-handler-middleware', () => {
  const sandbox = sinon.createSandbox();
  const mock: any = {
    req: {},
    res: { status: () => mock.res, json: () => mock.res },
    next: () => {},
  };

  afterEach(() => {
    sandbox.restore();
  });

  describe('withErrorHandler()', () => {
    it('should call exit app if error is not operational', () => {
      const errHandler = new ErrorHandler({ logger: null });
      const handleStub = sandbox.stub(errHandler, 'exitApp');

      const middleware = withErrorHandler({ errorHandler: errHandler });
      const err = new Error();

      middleware(err, mock.req, mock.res, mock.next);

      expect(handleStub.calledOnceWith(err)).equals(true);
    });

    it('should respond with internal error and status code 500 if error is not operational', () => {
      const errHandler = new ErrorHandler({ logger: null });
      sandbox.stub(errHandler, 'handle');
      const sendStub = sandbox.stub(mock.res, 'json');

      const middleware = withErrorHandler({ errorHandler: errHandler });
      const err = new Error();

      middleware(err, mock.req, mock.res, mock.next);

      expect(sendStub.args[0][0]).deep.equals({
        success: false,
        error: 'Internal error',
        errorCode: 500,
      });
    });

    it('should not call exit app if error is operational', () => {
      const errHandler = new ErrorHandler({ logger: null });
      const handleStub = sandbox.stub(errHandler, 'exitApp');

      const middleware = withErrorHandler({ errorHandler: errHandler });
      const err = new AppError(null, null, true);

      middleware(err, mock.req, mock.res, mock.next);

      expect(handleStub.calledOnceWith(err)).equals(false);
    });

    it(`should respond with error message and it's status code if error is operational`, () => {
      const errHandler = new ErrorHandler({ logger: null });
      sandbox.stub(errHandler, 'handle');
      const sendStub = sandbox.stub(mock.res, 'json');

      const middleware = withErrorHandler({ errorHandler: errHandler });
      const err = new AppError('message', 400, true);

      middleware(err, mock.req, mock.res, mock.next);

      expect(sendStub.args[0][0]).deep.equals({
        success: false,
        error: err.message,
        errorCode: err.statusCode,
      });
    });
  });
});
