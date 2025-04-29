// filepath: /home/andranik-a/Projects/js-utilities/src/lib/promise/retry.spec.ts
import { retry } from './retry';

describe('retry function', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should resolve if the function succeeds on first attempt', async () => {
    const mockFn = jest.fn().mockResolvedValue('success');
    
    const promise = retry(mockFn);
    
    // Resolve all promises
    jest.runAllTimers();
    await Promise.resolve();
    
    const result = await promise;
    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('should retry until success', async () => {
    const mockFn = jest.fn()
      .mockRejectedValueOnce(new Error('first failure'))
      .mockRejectedValueOnce(new Error('second failure'))
      .mockResolvedValueOnce('success');
    
    const promise = retry(mockFn, { attempts: 3, delay: 1000 });
    
    // First attempt fails
    await Promise.resolve();
    
    // Wait for the delay before second attempt
    jest.advanceTimersByTime(1000);
    await Promise.resolve();
    
    // Second attempt fails
    jest.advanceTimersByTime(2000); // Backoff factor of 2 applied
    await Promise.resolve();
    
    // Process all remaining timers
    jest.runAllTimers();
    await Promise.resolve();
    
    const result = await promise;
    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledTimes(3);
  });

  test('should fail after specified number of attempts', async () => {
    const testError = new Error('test error');
    const mockFn = jest.fn().mockRejectedValue(testError);
    
    const promise = retry(mockFn, { attempts: 3, delay: 500 });
    
    // First attempt
    await Promise.resolve();
    
    // Second attempt (after delay)
    jest.advanceTimersByTime(500);
    await Promise.resolve();
    
    // Third attempt (after increased delay)
    jest.advanceTimersByTime(1000); // 500 * 2
    await Promise.resolve();
    
    // Process all remaining timers
    jest.runAllTimers();
    
    await expect(promise).rejects.toThrow(testError);
    expect(mockFn).toHaveBeenCalledTimes(3);
  });

  test('should use retryIf to determine whether to retry', async () => {
    const retryableError = new Error('retryable');
    const nonRetryableError = new TypeError('non-retryable');
    
    const mockFn = jest.fn()
      .mockRejectedValueOnce(retryableError)
      .mockRejectedValueOnce(nonRetryableError);
    
    const retryIf = jest.fn(error => error instanceof Error && !(error instanceof TypeError));
    
    const promise = retry(mockFn, { 
      attempts: 3, 
      delay: 100,
      retryIf
    });
    
    // First attempt fails with retryable error
    await Promise.resolve();
    
    // Wait for delay
    jest.advanceTimersByTime(100);
    await Promise.resolve();
    
    // Second attempt fails with non-retryable error
    await Promise.resolve();
    
    // Process remaining timers
    jest.runAllTimers();
    
    await expect(promise).rejects.toThrow(nonRetryableError);
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(retryIf).toHaveBeenCalledTimes(2);
  });
});