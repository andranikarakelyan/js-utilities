/**
 * Returns a new array containing elements that are in the first array but not in the second array.
 * Uses Set for efficient lookup, maintaining order from the first array.
 * 
 * @template T The type of elements in the arrays
 * @param arr1 The array to subtract from
 * @param arr2 The array containing elements to exclude
 * @returns A new array containing elements from arr1 that are not in arr2
 * 
 * @example
 * ```ts
 * const arr1 = [1, 2, 3, 4, 5];
 * const arr2 = [3, 4];
 * const result = difference(arr1, arr2);
 * console.log(result); // [1, 2, 5]
 * 
 * // With strings
 * const colors1 = ['red', 'blue', 'green', 'yellow'];
 * const colors2 = ['blue', 'green'];
 * const remaining = difference(colors1, colors2);
 * console.log(remaining); // ['red', 'yellow']
 * 
 * // With objects (by reference)
 * const obj1 = { id: 1 };
 * const obj2 = { id: 2 };
 * const obj3 = { id: 3 };
 * const objects1 = [obj1, obj2, obj3];
 * const objects2 = [obj2];
 * const filtered = difference(objects1, objects2);
 * console.log(filtered); // [{ id: 1 }, { id: 3 }]
 * ```
 */
export function difference<T>(arr1: T[], arr2: T[]): T[] {
  if (arr1.length === 0) {
    return [];
  }
  
  if (arr2.length === 0) {
    return [...arr1];
  }

  const set2 = new Set(arr2);
  const result: T[] = [];
  
  for (const item of arr1) {
    if (!set2.has(item)) {
      result.push(item);
    }
  }
  
  return result;
}
