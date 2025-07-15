import { difference } from './difference';

describe('difference', () => {
  test('should return elements in first array but not in second', () => {
    const arr1 = [1, 2, 3, 4, 5];
    const arr2 = [3, 4];
    const result = difference(arr1, arr2);
    expect(result).toEqual([1, 2, 5]);
  });

  test('should work with string arrays', () => {
    const arr1 = ['red', 'blue', 'green', 'yellow'];
    const arr2 = ['blue', 'green'];
    const result = difference(arr1, arr2);
    expect(result).toEqual(['red', 'yellow']);
  });

  test('should maintain order from the first array', () => {
    const arr1 = [5, 1, 3, 2, 4];
    const arr2 = [2, 4];
    const result = difference(arr1, arr2);
    expect(result).toEqual([5, 1, 3]);
  });

  test('should return copy of first array when second array is empty', () => {
    const arr1 = [1, 2, 3];
    const arr2: number[] = [];
    const result = difference(arr1, arr2);
    expect(result).toEqual([1, 2, 3]);
    expect(result).not.toBe(arr1); // Should be a new array
  });

  test('should return empty array when first array is empty', () => {
    const arr1: number[] = [];
    const arr2 = [1, 2, 3];
    const result = difference(arr1, arr2);
    expect(result).toEqual([]);
  });

  test('should return empty array when both arrays are empty', () => {
    const arr1: number[] = [];
    const arr2: number[] = [];
    const result = difference(arr1, arr2);
    expect(result).toEqual([]);
  });

  test('should return empty array when all elements are excluded', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 3, 4, 5];
    const result = difference(arr1, arr2);
    expect(result).toEqual([]);
  });

  test('should handle duplicate elements correctly', () => {
    const arr1 = [1, 2, 2, 3, 3, 4];
    const arr2 = [2, 4];
    const result = difference(arr1, arr2);
    expect(result).toEqual([1, 3, 3]);
  });

  test('should work with object arrays (by reference)', () => {
    const obj1 = { id: 1 };
    const obj2 = { id: 2 };
    const obj3 = { id: 3 };
    
    const arr1 = [obj1, obj2, obj3];
    const arr2 = [obj2];
    const result = difference(arr1, arr2);
    
    expect(result).toEqual([obj1, obj3]);
    expect(result[0]).toBe(obj1); // Same reference
    expect(result[1]).toBe(obj3); // Same reference
  });

  test('should work with different object instances with same content', () => {
    const arr1 = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const arr2 = [{ id: 2 }];
    const result = difference(arr1, arr2);
    
    // Different object instances with same content are not equal
    expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
  });

  test('should work with boolean arrays', () => {
    const arr1 = [true, false, true, false];
    const arr2 = [false];
    const result = difference(arr1, arr2);
    expect(result).toEqual([true, true]);
  });

  test('should work with mixed type arrays', () => {
    const arr1 = [1, 'hello', true, null, undefined];
    const arr2 = ['hello', null];
    const result = difference(arr1, arr2);
    expect(result).toEqual([1, true, undefined]);
  });

  test('should return copy of first array when no elements match', () => {
    const arr1 = [1, 2, 3];
    const arr2 = [4, 5, 6];
    const result = difference(arr1, arr2);
    expect(result).toEqual([1, 2, 3]);
    expect(result).not.toBe(arr1); // Should be a new array
  });
});
