
/**
 * Splits an array into chunks based on a specified separator.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to be split.
 * @param separator - A value or a function used to determine where to split the array.
 *   - If a value is provided, the array will be split at every occurrence of this value.
 *   - If a function is provided, the array will be split at every element for which the function returns `true`.
 * @returns An array of chunks, where each chunk is an array of elements from the original array.
 *
 * @example
 * // Using a value as the separator:
 * const result1 = arraySplit([1, 2, 3, 0, 4, 5, 0, 6], 0);
 * // result1: [[1, 2, 3], [4, 5], [6]]
 *
 * @example
 * // Using a function as the separator:
 * const result2 = arraySplit([1, 2, 3, 4, 5, 6], (item) => item % 2 === 0);
 * // result2: [[1], [3], [5]]
 */
export function arraySplit<T>(
    array: T[],
    separator: T | ((item: T) => boolean),
  ): T[][] {
    const result: T[][] = [];
    let currentChunk: T[] = [];
    const separatorFunction =
      typeof separator === 'function' ? separator as (item: T) => boolean : (item: T) => item === separator;
  
    for (const item of array) {
      if (separatorFunction(item)) {
        if (currentChunk.length) {
          result.push(currentChunk);
          currentChunk = [];
        }
        continue;
      }
      currentChunk.push(item);
    }
  
    if (currentChunk.length) {
      result.push(currentChunk);
    }
  
    return result;
  }