import { CheckIdMiddleware } from './checkId.middleware';

describe('CheckIdMiddleware', () => {
  it('should be defined', () => {
    expect(new CheckIdMiddleware()).toBeDefined();
  });
});
