import { wait } from './wait';

describe('wait function', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should resolve after the specified delay', async () => {
    const delay = 1000;
    const promise = wait(delay);
    
    jest.advanceTimersByTime(delay);
    
    await expect(promise).resolves.toBeUndefined();
  });

  test('should work with zero milliseconds', async () => {
    const promise = wait(0);
    
    jest.advanceTimersByTime(0);
    
    await expect(promise).resolves.toBeUndefined();
  });

  test('should handle negative values (treating them as 0)', async () => {
    const promise = wait(-100);
    
    jest.advanceTimersByTime(0);
    
    await expect(promise).resolves.toBeUndefined();
  });
});