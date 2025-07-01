/**
 * Flattens an array to a specified depth, converting nested arrays into a single-level array.
 * 
 * @template T - The type of elements in the array
 * @param array - The array to flatten
 * @param depth - The depth level specifying how deep a nested array structure should be flattened (default: 1)
 * @returns A new flattened array
 * 
 * @example
 * // Flatten one level deep (default)
 * const nested = [1, [2, 3], [4, [5, 6]]];
 * const result = flatten(nested);
 * console.log(result); // [1, 2, 3, 4, [5, 6]]
 * 
 * @example
 * // Flatten completely (infinite depth)
 * const deepNested = [1, [2, [3, [4, 5]]]];
 * const result = flatten(deepNested, Infinity);
 * console.log(result); // [1, 2, 3, 4, 5]
 * 
 * @example
 * // Flatten to specific depth
 * const mixed = [1, [2, [3, [4, 5]]]];
 * const result = flatten(mixed, 2);
 * console.log(result); // [1, 2, 3, [4, 5]]
 * 
 * @example
 * // With objects and mixed types
 * const data = [
 *   { id: 1 },
 *   [{ id: 2 }, { id: 3 }],
 *   [{ id: 4 }, [{ id: 5 }]]
 * ];
 * const result = flatten(data);
 * console.log(result); // [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, [{ id: 5 }]]
 */
export function flatten<T>(array: readonly (T | readonly any[])[], depth: number = 1): T[] {
  // Input validation
  if (!Array.isArray(array)) {
    throw new Error('First argument must be an array');
  }
  
  if (typeof depth !== 'number' || depth < 0) {
    throw new Error('Depth must be a non-negative number');
  }
  
  // Handle edge cases
  if (array.length === 0) {
    return [];
  }
  
  if (depth === 0) {
    return array.slice() as T[];
  }
  
  const result: T[] = [];
  
  for (const item of array) {
    if (Array.isArray(item) && depth > 0) {
      // Recursively flatten if item is an array and we haven't reached max depth
      const flattened = flatten(item as readonly (T | readonly any[])[], depth - 1);
      result.push(...flattened);
    } else {
      // Add item as-is if it's not an array or we've reached max depth
      result.push(item as T);
    }
  }
  
  return result;
}
