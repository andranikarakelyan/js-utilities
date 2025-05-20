/**
 * Creates a debounced function that delays invoking the provided function until after
 * the specified wait time has elapsed since the last time it was invoked.
 * 
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 * @returns A debounced function that delays invoking the provided function
 * 
 * @example
 * // Create a debounced version of a function
 * const handleInput = debounce((value) => {
 *   // Process the input value
 *   console.log('Processing input:', value);
 * }, 300);
 * 
 * // Call the debounced function
 * inputElement.addEventListener('input', e => handleInput(e.target.value));
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => ReturnType<T> | undefined) & {
  cancel: () => void;
} {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let result: ReturnType<T>;
  
  /**
   * The debounced function
   */
  function debounced(this: any, ...args: Parameters<T>): ReturnType<T> | undefined {
    // If we're still in the delay period, just return the previous result
    if (timeout !== undefined) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = undefined;
      }, wait);
      
      return result;
    }
    
    // Execute the function and set the timeout
    result = func.apply(this, args);
    timeout = setTimeout(() => {
      timeout = undefined;
    }, wait);
    
    return result;
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
