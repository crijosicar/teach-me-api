import { CheckIdMiddleware } from './check-id.middleware';

describe('CheckIdMiddleware', () => {
  it('should be defined', () => {
    expect(new CheckIdMiddleware()).toBeDefined();
  });
});
