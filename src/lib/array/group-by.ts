/**
 * Groups array elements by a key selector function.
 * Returns a Map where keys are the result of the key selector function
 * and values are arrays of elements that share the same key.
 * 
 * @template T The type of elements in the array
 * @template K The type of the key used for grouping
 * @param array The input array to group
 * @param keySelector Function that returns the key for each element
 * @returns A Map where keys are group keys and values are arrays of grouped elements
 * 
 * @example
 * // Group numbers by even/odd
 * const numbers = [1, 2, 3, 4, 5, 6];
 * const grouped = groupBy(numbers, n => n % 2 === 0 ? 'even' : 'odd');
 * // Map { 'odd' => [1, 3, 5], 'even' => [2, 4, 6] }
 * 
 * @example
 * // Group objects by property
 * const users = [
 *   { name: 'Alice', department: 'Engineering' },
 *   { name: 'Bob', department: 'Marketing' },
 *   { name: 'Charlie', department: 'Engineering' }
 * ];
 * const byDepartment = groupBy(users, user => user.department);
 * // Map { 
 * //   'Engineering' => [{ name: 'Alice', department: 'Engineering' }, { name: 'Charlie', department: 'Engineering' }],
 * //   'Marketing' => [{ name: 'Bob', department: 'Marketing' }]
 * // }
 * 
 * @example
 * // Group by multiple criteria using composite keys
 * const products = [
 *   { name: 'Laptop', category: 'Electronics', inStock: true },
 *   { name: 'Phone', category: 'Electronics', inStock: false },
 *   { name: 'Desk', category: 'Furniture', inStock: true }
 * ];
 * const byStatus = groupBy(products, p => `${p.category}-${p.inStock}`);
 * // Groups by category and stock status combined
 */
export function groupBy<T, K>(
  array: T[],
  keySelector: (item: T) => K
): Map<K, T[]> {
  if (!array || array.length === 0) {
    return new Map<K, T[]>();
  }

  const groups = new Map<K, T[]>();

  for (const item of array) {
    const key = keySelector(item);
    
    // Get existing group or create new one
    const existingGroup = groups.get(key);
    if (existingGroup) {
      existingGroup.push(item);
    } else {
      groups.set(key, [item]);
    }
  }

  return groups;
}
