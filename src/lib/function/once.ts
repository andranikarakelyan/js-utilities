/**
 * Creates a function that ensures the original function is only ever called once,
 * regardless of how many times the returned function is called.
 * Subsequent calls to the wrapped function return the result of the first invocation.
 *
 * @template T - The function type
 * @param fn - The function to wrap
 * @returns A wrapper function that ensures fn is only called once
 *
 * @example
 * ```typescript
 * const expensiveCalculation = once((a: number, b: number) => {
 *   console.log('Calculating...');
 *   return a + b;
 * });
 *
 * // First call, executes the original function
 * expensiveCalculation(1, 2); // Logs: 'Calculating...' and returns 3
 *
 * // Subsequent calls, returns cached result without executing the original function again
 * expensiveCalculation(1, 2); // Returns 3 without logging
 * ```
 */
export function once<T extends (...args: any[]) => any>(fn: T): T {
  let called = false;
  let result: ReturnType<T>;

  // @ts-expect-error - TypeScript doesn't understand the type preservation here
  return function(this: any, ...args: Parameters<T>): ReturnType<T> {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}
