/**
 * Creates a debounced function that delays invoking the provided function until after
 * the specified wait time has elapsed since the last time it was invoked.
 * The debounced function will only execute once the wait period has passed without any new calls.
 * Each new invocation resets the timer.
 * 
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @returns A debounced function that delays invoking the provided function
 * 
 * @example
 * // Create a debounced version of a function
 * const handleInput = debounce((value) => {
 *   // This will only execute after the user has stopped typing for 300ms
 *   console.log('Processing input:', value);
 * }, 300);
 * 
 * // Call the debounced function
 * inputElement.addEventListener('input', e => handleInput(e.target.value));
 * 
 * // The debounced function can be cancelled to prevent pending execution
 * // handleInput.cancel();
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => ReturnType<T> | undefined) & {
  cancel: () => void;
} {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let result: ReturnType<T> | undefined;
  let lastThis: any;
  let lastArgs: Parameters<T> | undefined;
  
  /**
   * The debounced function that postpones execution until after the wait period
   * has elapsed since the last time it was invoked. Each call resets the timer.
   */
  function debounced(this: any, ...args: Parameters<T>): ReturnType<T> | undefined {
    // Store the context and arguments for the pending invocation
    lastThis = this;
    lastArgs = args;
    
    // Clear any existing timeout
    if (timeout !== undefined) {
      clearTimeout(timeout);
    }
    
    // Set a new timeout that will invoke the function after the wait period
    timeout = setTimeout(() => {
      result = func.apply(lastThis, lastArgs as Parameters<T>);
      timeout = undefined;
    }, wait);
    
    // In a trailing-edge debounce implementation, function execution is always deferred
    // No value is returned immediately as the function hasn't executed yet
    return undefined;
  }

  /**
   * Cancels any pending debounced invocation
   */
  debounced.cancel = function(): void {
    if (timeout !== undefined) {
      clearTimeout(timeout);
      timeout = undefined;
    }
  };

  return debounced;
}
