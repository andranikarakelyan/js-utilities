/**
 * Subtracts elements of the second array from the first array.
 * 
 * @param arr1 - The array from which elements will be subtracted.
 * @param arr2 - The array containing elements to subtract from the first array.
 * @returns A new array containing elements from the first array that are not present in the second array.
 */
export function arraySubtract<T extends string | number>(arr1: T[], arr2: T[]): T[] {
  const set2 = new Set(arr2);
  return arr1.filter((item) => !set2.has(item));
}