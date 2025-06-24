/**
 * Result type for safe async operations
 */
export type SafeAsyncResult<T> = 
  | { success: true; data: T; error: null }
  | { success: false; data: null; error: Error };

/**
 * Wraps an async function to handle errors gracefully without throwing exceptions.
 * Returns a standardized result object instead of throwing errors.
 *
 * @param asyncFn - The async function to wrap safely
 * @returns A promise that resolves to a result object containing either data or error
 * @example
 * // Basic usage with API call
 * const result = await safeAsync(() => fetchUserData(userId));
 * if (result.success) {
 *   console.log('User data:', result.data);
 * } else {
 *   console.error('Failed to fetch user:', result.error.message);
 * }
 * 
 * // With async function that might throw
 * const fileResult = await safeAsync(() => fs.readFile('config.json', 'utf8'));
 * if (fileResult.success) {
 *   const config = JSON.parse(fileResult.data);
 * } else {
 *   console.error('File read failed:', fileResult.error);
 * }
 */
export async function safeAsync<T>(
  asyncFn: () => Promise<T>
): Promise<SafeAsyncResult<T>> {
  try {
    const data = await asyncFn();
    return { success: true, data, error: null };
  } catch (error) {
    return { 
      success: false, 
      data: null,
      error: error instanceof Error ? error : new Error(String(error))
    };
  }
}
