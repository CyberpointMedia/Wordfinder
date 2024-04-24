// test/wrapAsync.test.js

const wrapAsync = require('../../middleware/wrapAsync');

describe('wrapAsync', () => {
  it('should catch errors', async () => {
    const mockReq = {};
    const mockRes = {};
    const mockNext = jest.fn();

    const fn = wrapAsync(async () => {
      throw new Error('Test error');
    });

    await fn(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should not call next if there is no error', async () => {
    const mockReq = {};
    const mockRes = {};
    const mockNext = jest.fn();

    const fn = wrapAsync(async () => {});

    await fn(mockReq, mockRes, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
  });
});