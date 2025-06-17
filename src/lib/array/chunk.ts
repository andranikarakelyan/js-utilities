/**
 * Splits an array into chunks of a specified size.
 * The last chunk may contain fewer elements if the array length is not evenly divisible by the chunk size.
 * 
 * @template T The type of elements in the array
 * @param array The input array to split into chunks
 * @param size The size of each chunk (must be a positive integer)
 * @returns A new array containing subarrays (chunks) of the specified size
 * 
 * @throws {Error} When size is not a positive integer
 * 
 * @example
 * // Basic usage with numbers
 * chunk([1, 2, 3, 4, 5, 6], 2); // [[1, 2], [3, 4], [5, 6]]
 * chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
 * 
 * @example
 * // With strings
 * chunk(['a', 'b', 'c', 'd', 'e'], 3); // [['a', 'b', 'c'], ['d', 'e']]
 * 
 * @example
 * // With objects
 * const users = [
 *   { id: 1, name: 'Alice' },
 *   { id: 2, name: 'Bob' },
 *   { id: 3, name: 'Charlie' },
 *   { id: 4, name: 'Diana' }
 * ];
 * chunk(users, 2);
 * // [
 * //   [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }],
 * //   [{ id: 3, name: 'Charlie' }, { id: 4, name: 'Diana' }]
 * // ]
 * 
 * @example
 * // Edge cases
 * chunk([], 2); // []
 * chunk([1, 2, 3], 5); // [[1, 2, 3]]
 * chunk([1], 1); // [[1]]
 */
export function chunk<T>(array: T[], size: number): T[][] {
  // Validate inputs
  if (!array || array.length === 0) {
    return [];
  }
  
  if (!Number.isInteger(size) || size <= 0) {
    throw new Error('Chunk size must be a positive integer');
  }
  
  const result: T[][] = [];
  
  // Split array into chunks using a simple loop approach
  for (let i = 0; i < array.length; i += size) {
    // Extract chunk from current index to current index + size
    const chunk = array.slice(i, i + size);
    result.push(chunk);
  }
  
  return result;
}
