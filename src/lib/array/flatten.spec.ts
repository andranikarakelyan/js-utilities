import { flatten } from './flatten';

describe('flatten', () => {
  describe('basic functionality', () => {
    it('should flatten one level deep by default', () => {
      const nested = [1, [2, 3], [4, [5, 6]]];
      const result = flatten(nested);
      expect(result).toEqual([1, 2, 3, 4, [5, 6]]);
    });

    it('should handle empty arrays', () => {
      const empty: any[] = [];
      const result = flatten(empty);
      expect(result).toEqual([]);
    });

    it('should handle arrays with no nested elements', () => {
      const flat = [1, 2, 3, 4, 5];
      const result = flatten(flat);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should not modify the original array', () => {
      const original = [1, [2, 3], [4, 5]];
      const originalCopy = JSON.parse(JSON.stringify(original));
      flatten(original);
      expect(original).toEqual(originalCopy);
    });
  });

  describe('depth parameter', () => {
    it('should flatten to specified depth', () => {
      const deepNested = [1, [2, [3, [4, 5]]]];
      
      expect(flatten(deepNested, 1)).toEqual([1, 2, [3, [4, 5]]]);
      expect(flatten(deepNested, 2)).toEqual([1, 2, 3, [4, 5]]);
      expect(flatten(deepNested, 3)).toEqual([1, 2, 3, 4, 5]);
    });

    it('should flatten completely with Infinity depth', () => {
      const deepNested = [1, [2, [3, [4, [5, [6, 7]]]]]];
      const result = flatten(deepNested, Infinity);
      expect(result).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });

    it('should handle depth of 0 (no flattening)', () => {
      const nested = [1, [2, 3], [4, [5, 6]]];
      const result = flatten(nested, 0);
      expect(result).toEqual([1, [2, 3], [4, [5, 6]]]);
    });

    it('should handle large depth values correctly', () => {
      const nested = [1, [2, [3]]];
      const result = flatten(nested, 100);
      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe('data types', () => {
    it('should handle arrays of strings', () => {
      const nested = ['a', ['b', 'c'], ['d', ['e', 'f']]];
      const result = flatten(nested);
      expect(result).toEqual(['a', 'b', 'c', 'd', ['e', 'f']]);
    });

    it('should handle arrays of objects', () => {
      const nested = [
        { id: 1 },
        [{ id: 2 }, { id: 3 }],
        [{ id: 4 }, [{ id: 5 }]]
      ];
      const result = flatten(nested);
      expect(result).toEqual([
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        [{ id: 5 }]
      ]);
    });

    it('should handle mixed data types', () => {
      const nested = [1, ['string', true], [null, [undefined, { key: 'value' }]]];
      const result = flatten(nested);
      expect(result).toEqual([1, 'string', true, null, [undefined, { key: 'value' }]]);
    });

    it('should handle arrays with null and undefined values', () => {
      const nested = [1, [null, undefined], [2, [3, null]]];
      const result = flatten(nested);
      expect(result).toEqual([1, null, undefined, 2, [3, null]]);
    });
  });

  describe('edge cases', () => {
    it('should handle arrays containing empty arrays', () => {
      const nested = [1, [], [2, []], [3, [4, []]]];
      const result = flatten(nested);
      expect(result).toEqual([1, 2, [], 3, [4, []]]);
    });

    it('should handle empty arrays with depth 2', () => {
      const nested = [1, [], [2, []], [3, [4, []]]];
      const result = flatten(nested, 2);
      expect(result).toEqual([1, 2, 3, 4, []]);
    });

    it('should handle deeply nested empty arrays', () => {
      const nested = [[[[[]]]]];
      const result = flatten(nested, Infinity);
      expect(result).toEqual([]);
    });

    it('should handle single-element arrays', () => {
      const nested = [[1]];
      const result = flatten(nested);
      expect(result).toEqual([1]);
    });

    it('should handle arrays with only nested arrays', () => {
      const nested = [[1, 2], [3, 4], [5, [6, 7]]];
      const result = flatten(nested);
      expect(result).toEqual([1, 2, 3, 4, 5, [6, 7]]);
    });
  });

  describe('performance and large arrays', () => {
    it('should handle large arrays efficiently', () => {
      const large = Array.from({ length: 1000 }, (_, i) => [i, i + 1]);
      const result = flatten(large);
      expect(result).toHaveLength(2000);
      expect(result[0]).toBe(0);
      expect(result[1]).toBe(1);
      expect(result[1998]).toBe(999);
      expect(result[1999]).toBe(1000);
    });
  });

  describe('error handling', () => {
    it('should throw error for non-array input', () => {
      expect(() => flatten(null as any)).toThrow('First argument must be an array');
      expect(() => flatten(undefined as any)).toThrow('First argument must be an array');
      expect(() => flatten('string' as any)).toThrow('First argument must be an array');
      expect(() => flatten(123 as any)).toThrow('First argument must be an array');
      expect(() => flatten({} as any)).toThrow('First argument must be an array');
    });

    it('should throw error for invalid depth values', () => {
      const array = [1, [2, 3]];
      expect(() => flatten(array, -1)).toThrow('Depth must be a non-negative number');
      expect(() => flatten(array, 'invalid' as any)).toThrow('Depth must be a non-negative number');
      expect(() => flatten(array, null as any)).toThrow('Depth must be a non-negative number');
    });

    it('should use default depth when undefined is passed', () => {
      const array = [1, [2, 3]];
      const result = flatten(array, undefined as any);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should accept valid depth values', () => {
      const array = [1, [2, 3]];
      expect(() => flatten(array, 0)).not.toThrow();
      expect(() => flatten(array, 1)).not.toThrow();
      expect(() => flatten(array, Infinity)).not.toThrow();
    });
  });

  describe('type safety', () => {
    it('should maintain type information where possible', () => {
      const numbers: (number | number[])[] = [1, [2, 3], 4];
      const result = flatten(numbers);
      // TypeScript should infer this as number[]
      expect(typeof result[0]).toBe('number');
      expect(typeof result[1]).toBe('number');
      expect(typeof result[2]).toBe('number');
      expect(typeof result[3]).toBe('number');
    });
  });

  describe('equivalence', () => {
    it('should be equivalent to applying flatten twice', () => {
      const nested = [1, [], [2, []], [3, [4, []]]];
      const onceResult = flatten(nested, 1);
      const twiceResult = flatten(onceResult, 1);
      const depth2Result = flatten(nested, 2);
      expect(depth2Result).toEqual(twiceResult);
    });
  });
});
