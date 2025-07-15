import { intersection } from './intersection';

describe('intersection', () => {
  test('should return common elements between two number arrays', () => {
    const arr1 = [1, 2, 3, 4];
    const arr2 = [3, 4, 5, 6];
    const result = intersection(arr1, arr2);
    expect(result).toEqual([3, 4]);
  });

  test('should return common elements between two string arrays', () => {
    const arr1 = ['red', 'blue', 'green'];
    const arr2 = ['blue', 'yellow', 'green'];
    const result = intersection(arr1, arr2);
    expect(result).toEqual(['blue', 'green']);
  });

  test('should maintain order from the first array', () => {
    const arr1 = [1, 3, 2, 4];
    const arr2 = [4, 2, 3, 1];
    const result = intersection(arr1, arr2);
    expect(result).toEqual([1, 3, 2, 4]);
  });

  test('should return empty array when no common elements', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [4, 5, 6];
    const result = intersection(arr1, arr2);
    expect(result).toEqual([]);
  });

  test('should return empty array when first array is empty', () => {
    const arr1: number[] = [];
    const arr2 = [1, 2, 3];
    const result = intersection(arr1, arr2);
    expect(result).toEqual([]);
  });

  test('should return empty array when second array is empty', () => {
    const arr1 = [1, 2, 3];
    const arr2: number[] = [];
    const result = intersection(arr1, arr2);
    expect(result).toEqual([]);
  });

  test('should return empty array when both arrays are empty', () => {
    const arr1: number[] = [];
    const arr2: number[] = [];
    const result = intersection(arr1, arr2);
    expect(result).toEqual([]);
  });

  test('should handle duplicate elements correctly', () => {
    const arr1 = [1, 2, 2, 3, 3];
    const arr2 = [2, 3, 4];
    const result = intersection(arr1, arr2);
    expect(result).toEqual([2, 2, 3, 3]);
  });

  test('should work with object arrays (by reference)', () => {
    const obj1 = { id: 1 };
    const obj2 = { id: 2 };
    const obj3 = { id: 3 };
    
    const arr1 = [obj1, obj2];
    const arr2 = [obj1, obj3];
    const result = intersection(arr1, arr2);
    
    expect(result).toEqual([obj1]);
    expect(result[0]).toBe(obj1); // Same reference
  });

  test('should work with different object instances with same content', () => {
    const arr1 = [{ id: 1 }, { id: 2 }];
    const arr2 = [{ id: 1 }, { id: 3 }];
    const result = intersection(arr1, arr2);
    
    // Different object instances with same content are not equal
    expect(result).toEqual([]);
  });

  test('should work with boolean arrays', () => {
    const arr1 = [true, false, true];
    const arr2 = [false, false, true];
    const result = intersection(arr1, arr2);
    expect(result).toEqual([true, false, true]);
  });

  test('should work with mixed type arrays', () => {
    const arr1 = [1, 'hello', true, null];
    const arr2 = ['hello', true, 2, undefined];
    const result = intersection(arr1, arr2);
    expect(result).toEqual(['hello', true]);
  });
});
