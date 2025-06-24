import { safeAsync } from './safe-async';

describe('safeAsync', () => {
  it('should return success result when async function resolves', async () => {
    const asyncFn = async () => 'test data';
    
    const result = await safeAsync(asyncFn);
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('test data');
      expect(result.error).toBeNull();
    }
  });

  it('should return error result when async function rejects', async () => {
    const errorMessage = 'Something went wrong';
    const asyncFn = async () => {
      throw new Error(errorMessage);
    };
    
    const result = await safeAsync(asyncFn);
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.data).toBeNull();
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe(errorMessage);
    }
  });

  it('should handle non-Error thrown values', async () => {
    const asyncFn = async () => {
      throw 'string error';
    };
    
    const result = await safeAsync(asyncFn);
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.data).toBeNull();
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe('string error');
    }
  });

  it('should handle async functions with different return types', async () => {
    const numberFn = async () => 42;
    const objectFn = async () => ({ key: 'value' });
    const arrayFn = async () => [1, 2, 3];
    
    const numberResult = await safeAsync(numberFn);
    const objectResult = await safeAsync(objectFn);
    const arrayResult = await safeAsync(arrayFn);
    
    expect(numberResult.success).toBe(true);
    expect(objectResult.success).toBe(true);
    expect(arrayResult.success).toBe(true);
    
    if (numberResult.success) expect(numberResult.data).toBe(42);
    if (objectResult.success) expect(objectResult.data).toEqual({ key: 'value' });
    if (arrayResult.success) expect(arrayResult.data).toEqual([1, 2, 3]);
  });

  it('should handle async functions that return null or undefined', async () => {
    const nullFn = async () => null;
    const undefinedFn = async () => undefined;
    
    const nullResult = await safeAsync(nullFn);
    const undefinedResult = await safeAsync(undefinedFn);
    
    expect(nullResult.success).toBe(true);
    expect(undefinedResult.success).toBe(true);
    
    if (nullResult.success) expect(nullResult.data).toBeNull();
    if (undefinedResult.success) expect(undefinedResult.data).toBeUndefined();
  });

  it('should handle promises that resolve after delay', async () => {
    const delayedFn = async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
      return 'delayed result';
    };
    
    const result = await safeAsync(delayedFn);
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe('delayed result');
    }
  });

  it('should preserve original error types', async () => {
    class CustomError extends Error {
      constructor(message: string, public code: number) {
        super(message);
        this.name = 'CustomError';
      }
    }
    
    const asyncFn = async () => {
      throw new CustomError('Custom error message', 500);
    };
    
    const result = await safeAsync(asyncFn);
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(CustomError);
      expect(result.error.message).toBe('Custom error message');
      expect((result.error as CustomError).code).toBe(500);
    }
  });

  it('should handle TypeError and other built-in errors', async () => {
    const asyncFn = async () => {
      const obj: any = null;
      return obj.property; // This will throw TypeError
    };
    
    const result = await safeAsync(asyncFn);
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(TypeError);
    }
  });
});
