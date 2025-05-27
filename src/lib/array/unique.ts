/**
 * Returns a new array with duplicate values removed.
 * 
 * @template T The type of elements in the array
 * @template K The type of the key used for uniqueness comparison
 * @param array The input array to remove duplicates from
 * @param getKey Optional function to determine uniqueness key for each item
 * @returns A new array with only unique values
 * 
 * @example
 * // Simple usage with primitive values
 * unique([1, 2, 2, 3, 1, 4]); // [1, 2, 3, 4]
 * unique(['a', 'b', 'a', 'c']); // ['a', 'b', 'c']
 * 
 * // With objects using a key selector
 * const users = [
 *   { id: 1, name: 'Alice' },
 *   { id: 2, name: 'Bob' },
 *   { id: 1, name: 'Alice (duplicate)' }
 * ];
 * unique(users, user => user.id); // [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
 */
export function unique<T, K = T>(array: T[], getKey?: (item: T) => K): T[] {
  if (!array || array.length === 0) {
    return [];
  }

  // If no key selector provided, use the items themselves as keys
  const keyFn = getKey || ((item: T) => item as unknown as K);
  
  // Use a Map to track seen keys and their corresponding items
  const seen = new Map<unknown, T>();
  
  for (const item of array) {
    const key = keyFn(item);
    // Only store the first occurrence of each unique key
    if (!seen.has(key)) {
      seen.set(key, item);
    }
  }
  
  // Return the values (unique items) from the map
  return Array.from(seen.values());
}
