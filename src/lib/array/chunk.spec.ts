import { chunk } from './chunk';

describe('chunk', () => {
  describe('basic functionality', () => {
    it('should split array into chunks of specified size', () => {
      const result = chunk([1, 2, 3, 4, 5, 6], 2);
      expect(result).toEqual([[1, 2], [3, 4], [5, 6]]);
    });

    it('should handle arrays not evenly divisible by chunk size', () => {
      const result = chunk([1, 2, 3, 4, 5], 2);
      expect(result).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('should handle chunk size larger than array length', () => {
      const result = chunk([1, 2, 3], 5);
      expect(result).toEqual([[1, 2, 3]]);
    });

    it('should handle chunk size equal to array length', () => {
      const result = chunk([1, 2, 3], 3);
      expect(result).toEqual([[1, 2, 3]]);
    });

    it('should handle chunk size of 1', () => {
      const result = chunk([1, 2, 3], 1);
      expect(result).toEqual([[1], [2], [3]]);
    });
  });

  describe('different data types', () => {
    it('should work with strings', () => {
      const result = chunk(['a', 'b', 'c', 'd', 'e'], 3);
      expect(result).toEqual([['a', 'b', 'c'], ['d', 'e']]);
    });

    it('should work with objects', () => {
      const users = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
        { id: 4, name: 'Diana' }
      ];
      const result = chunk(users, 2);
      expect(result).toEqual([
        [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }],
        [{ id: 3, name: 'Charlie' }, { id: 4, name: 'Diana' }]
      ]);
    });

    it('should work with mixed types', () => {
      const mixed = [1, 'a', true, null, undefined];
      const result = chunk(mixed, 2);
      expect(result).toEqual([[1, 'a'], [true, null], [undefined]]);
    });

    it('should work with nested arrays', () => {
      const nested = [[1, 2], [3, 4], [5, 6], [7, 8]];
      const result = chunk(nested, 2);
      expect(result).toEqual([[[1, 2], [3, 4]], [[5, 6], [7, 8]]]);
    });
  });

  describe('edge cases', () => {
    it('should return empty array for empty input', () => {
      const result = chunk([], 2);
      expect(result).toEqual([]);
    });

    it('should handle null or undefined array', () => {
      expect(chunk(null as any, 2)).toEqual([]);
      expect(chunk(undefined as any, 2)).toEqual([]);
    });

    it('should handle single element array', () => {
      const result = chunk([42], 1);
      expect(result).toEqual([[42]]);
    });

    it('should handle single element array with larger chunk size', () => {
      const result = chunk([42], 5);
      expect(result).toEqual([[42]]);
    });
  });

  describe('error handling', () => {
    it('should throw error for non-integer chunk size', () => {
      expect(() => chunk([1, 2, 3], 2.5)).toThrow('Chunk size must be a positive integer');
      expect(() => chunk([1, 2, 3], NaN)).toThrow('Chunk size must be a positive integer');
      expect(() => chunk([1, 2, 3], Infinity)).toThrow('Chunk size must be a positive integer');
    });

    it('should throw error for zero chunk size', () => {
      expect(() => chunk([1, 2, 3], 0)).toThrow('Chunk size must be a positive integer');
    });

    it('should throw error for negative chunk size', () => {
      expect(() => chunk([1, 2, 3], -1)).toThrow('Chunk size must be a positive integer');
      expect(() => chunk([1, 2, 3], -10)).toThrow('Chunk size must be a positive integer');
    });
  });

  describe('immutability', () => {
    it('should not modify the original array', () => {
      const original = [1, 2, 3, 4, 5];
      const originalCopy = [...original];
      
      chunk(original, 2);
      
      expect(original).toEqual(originalCopy);
    });

    it('should create new chunk arrays', () => {
      const original = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
      const result = chunk(original, 2);
      
      // Modify one of the chunks
      result[0].push({ id: 5 } as any);
      
      // Original should be unchanged
      expect(original).toHaveLength(4);
      expect(original[0]).toEqual({ id: 1 });
    });
  });

  describe('performance considerations', () => {
    it('should handle large arrays efficiently', () => {
      const largeArray = Array.from({ length: 10000 }, (_, i) => i);
      const start = performance.now();
      
      const result = chunk(largeArray, 100);
      
      const end = performance.now();
      const executionTime = end - start;
      
      expect(result).toHaveLength(100);
      expect(result[0]).toHaveLength(100);
      expect(result[99]).toHaveLength(100);
      expect(executionTime).toBeLessThan(100); // Should complete in less than 100ms
    });
  });

  describe('type safety', () => {
    it('should preserve type information', () => {
      const numbers = [1, 2, 3, 4];
      const result = chunk(numbers, 2);
      
      // TypeScript should infer this as number[][]
      expect(typeof result[0][0]).toBe('number');
    });

    it('should work with union types', () => {
      const mixed: (string | number)[] = [1, 'a', 2, 'b'];
      const result = chunk(mixed, 2);
      
      expect(result).toEqual([[1, 'a'], [2, 'b']]);
    });
  });
});
