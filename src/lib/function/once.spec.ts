import { once } from './once';

describe('once', () => {
  it('should call the original function only once', () => {
    const mockFn = jest.fn().mockReturnValue('result');
    const onceFn = once(mockFn);

    // Call the wrapped function multiple times
    const result1 = onceFn();
    const result2 = onceFn();
    const result3 = onceFn();

    // Original function should be called exactly once
    expect(mockFn).toHaveBeenCalledTimes(1);

    // All calls should return the same result
    expect(result1).toBe('result');
    expect(result2).toBe('result');
    expect(result3).toBe('result');
  });

  it('should preserve the function arguments', () => {
    const mockFn = jest.fn().mockImplementation((a, b) => a + b);
    const onceFn = once(mockFn);

    // First call with arguments
    const result1 = onceFn(1, 2);

    // Second call with different arguments (should be ignored)
    const result2 = onceFn(3, 4);

    // Original function should be called exactly once with the first set of arguments
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith(1, 2);

    // Both calls should return the result from the first invocation
    expect(result1).toBe(3);
    expect(result2).toBe(3);
  });

  it('should preserve the "this" context', () => {
    // Create an object with a method
    const obj = {
      value: 42,
      method: function(this: { value: number }, multiplier: number) {
        return this.value * multiplier;
      }
    };

    // Create a once-wrapped version of the method
    obj.method = once(obj.method);

    // Call the wrapped method
    const result1 = obj.method(2);
    const result2 = obj.method(3);

    // Both calls should return the result using the first multiplier
    expect(result1).toBe(84); // 42 * 2
    expect(result2).toBe(84); // should still be 42 * 2, not 42 * 3
  });
});
