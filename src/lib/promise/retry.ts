/**
 * Options for configuring the retry behavior
 */
export interface RetryOptions {
  /** Maximum number of attempts (including the initial attempt) */
  attempts?: number;
  /** Delay between attempts in milliseconds */
  delay?: number;
  /** Factor by which to increase delay after each attempt */
  backoffFactor?: number;
  /** Function to determine if an error should trigger a retry */
  retryIf?: (error: unknown) => boolean;
  /** Optional callback executed before each retry attempt */
  onRetry?: (error: unknown, attempt: number) => void;
}

/**
 * Retries an async function with configurable attempts and exponential backoff
 * 
 * @param fn - The async function to retry
 * @param options - Configuration options for retry behavior
 * @returns A promise that resolves with the result of the function or rejects after all retries fail
 * @example
 * // Basic usage with default options (3 attempts)
 * const data = await retry(() => fetchData());
 * 
 * // With custom retry configuration
 * const result = await retry(
 *   () => riskyOperation(),
 *   { 
 *     attempts: 5, 
 *     delay: 1000, 
 *     backoffFactor: 2,
 *     retryIf: (err) => err instanceof NetworkError,
 *     onRetry: (err, attempt) => console.log(`Retry attempt ${attempt} after error: ${err}`)
 *   }
 * );
 */
export function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    attempts = 3,
    delay = 1000,
    backoffFactor = 2,
    retryIf = () => true,
    onRetry = () => {},
  } = options;

  let currentAttempt = 1;
  let currentDelay = delay;

  const execute = async (): Promise<T> => {
    try {
      return await fn();
    } catch (error) {
      if (currentAttempt >= attempts || !retryIf(error)) {
        throw error;
      }

      // Execute the retry callback
      onRetry(error, currentAttempt);

      // Wait before next attempt
      await new Promise(resolve => setTimeout(resolve, currentDelay));

      // Increase delay for next attempt using backoff factor
      currentDelay *= backoffFactor;
      currentAttempt++;

      // Recursive call for next attempt
      return execute();
    }
  };

  return execute();
}