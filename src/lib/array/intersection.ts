/**
 * Returns a new array containing elements that are present in both input arrays.
 * Uses Set for efficient lookup, maintaining order from the first array.
 * 
 * @template T The type of elements in the arrays
 * @param arr1 The first array
 * @param arr2 The second array
 * @returns A new array containing elements present in both arrays
 * 
 * @example
 * ```ts
 * const arr1 = [1, 2, 3, 4];
 * const arr2 = [3, 4, 5, 6];
 * const result = intersection(arr1, arr2);
 * console.log(result); // [3, 4]
 * 
 * // With strings
 * const colors1 = ['red', 'blue', 'green'];
 * const colors2 = ['blue', 'yellow', 'green'];
 * const common = intersection(colors1, colors2);
 * console.log(common); // ['blue', 'green']
 * 
 * // With objects (by reference)
 * const obj1 = { id: 1 };
 * const obj2 = { id: 2 };
 * const objects1 = [obj1, obj2];
 * const objects2 = [obj1, { id: 3 }];
 * const commonObjects = intersection(objects1, objects2);
 * console.log(commonObjects); // [{ id: 1 }]
 * ```
 */
export function intersection<T>(arr1: T[], arr2: T[]): T[] {
  if (arr1.length === 0 || arr2.length === 0) {
    return [];
  }

  const set2 = new Set(arr2);
  const result: T[] = [];
  
  for (const item of arr1) {
    if (set2.has(item)) {
      result.push(item);
    }
  }
  
  return result;
}
