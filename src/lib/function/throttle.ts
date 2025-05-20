/**
 * Creates a throttled function that only invokes the provided function at most once
 * per every specified wait milliseconds, regardless of how many times it's called.
 * 
 * @param func - The function to throttle
 * @param wait - The number of milliseconds to throttle invocations to
 * @returns A throttled function that limits invocation to once per wait period
 * 
 * @example
 * // Create a throttled version of a function
 * const handleScroll = throttle(() => {
 *   // Process the scroll event
 *   console.log('Processing scroll event');
 * }, 300);
 * 
 * // Call the throttled function
 * window.addEventListener('scroll', handleScroll);
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => ReturnType<T> | undefined) & {
  cancel: () => void;
} {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let lastResult: ReturnType<T>;
  let lastArgs: Parameters<T>;
  let lastThis: any;
  let lastCallTime: number = 0;

  /**
   * The throttled function
   */
  function throttled(this: any, ...args: Parameters<T>): ReturnType<T> | undefined {
    const now = Date.now();
    lastArgs = args;
    lastThis = this;
    
    // If this is the first call, or enough time has elapsed since the last call
    if (lastCallTime === 0 || now >= lastCallTime + wait) {
      lastCallTime = now;
      lastResult = func.apply(this, args);
      return lastResult;
    }
    
    // If we're within the throttle period but no timeout is set,
    // schedule the next execution at the end of the throttle period
    if (timeout === undefined) {
      const remaining = wait - (now - lastCallTime);
      timeout = setTimeout(() => {
        lastCallTime = Date.now();
        timeout = undefined;
        lastResult = func.apply(lastThis, lastArgs);
      }, remaining);
    }
    
    return lastResult;
  }

  /**
   * Cancels any pending throttled invocation
   */
  throttled.cancel = function(): void {
    if (timeout !== undefined) {
      clearTimeout(timeout);
      timeout = undefined;
    }
    lastCallTime = 0;
  };

  return throttled;
}
