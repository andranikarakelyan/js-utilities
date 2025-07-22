import { range, rangeIterable } from './range';

describe('range', () => {
  describe('single argument - range(stop)', () => {
    it('should generate sequence from 0 to stop (exclusive)', () => {
      const result = [...range(5)];
      expect(result).toEqual([0, 1, 2, 3, 4]);
    });

    it('should handle zero', () => {
      const result = [...range(0)];
      expect(result).toEqual([]);
    });

    it('should handle negative numbers', () => {
      const result = [...range(-3)];
      expect(result).toEqual([]);
    });

    it('should handle large numbers efficiently', () => {
      const gen = range(1000000);
      const first5: number[] = [];
      for (const value of gen) {
        first5.push(value);
        if (first5.length === 5) break;
      }
      expect(first5).toEqual([0, 1, 2, 3, 4]);
    });
  });

  describe('two arguments - range(start, stop)', () => {
    it('should generate sequence from start to stop (exclusive)', () => {
      const result = [...range(2, 8)];
      expect(result).toEqual([2, 3, 4, 5, 6, 7]);
    });

    it('should handle equal start and stop', () => {
      const result = [...range(5, 5)];
      expect(result).toEqual([]);
    });

    it('should handle start greater than stop', () => {
      const result = [...range(5, 0)];
      expect(result).toEqual([]);
    });

    it('should handle negative ranges', () => {
      const result = [...range(-5, -1)];
      expect(result).toEqual([-5, -4, -3, -2]);
    });

    it('should handle negative to positive', () => {
      const result = [...range(-2, 3)];
      expect(result).toEqual([-2, -1, 0, 1, 2]);
    });

    it('should handle positive to negative (empty)', () => {
      const result = [...range(3, -2)];
      expect(result).toEqual([]);
    });
  });

  describe('three arguments - range(start, stop, step)', () => {
    it('should generate sequence with positive step', () => {
      const result = [...range(0, 10, 2)];
      expect(result).toEqual([0, 2, 4, 6, 8]);
    });

    it('should generate sequence with negative step', () => {
      const result = [...range(10, 0, -2)];
      expect(result).toEqual([10, 8, 6, 4, 2]);
    });

    it('should handle step of 1', () => {
      const result = [...range(3, 7, 1)];
      expect(result).toEqual([3, 4, 5, 6]);
    });

    it('should handle step of -1', () => {
      const result = [...range(7, 3, -1)];
      expect(result).toEqual([7, 6, 5, 4]);
    });

    it('should handle large positive step', () => {
      const result = [...range(0, 20, 5)];
      expect(result).toEqual([0, 5, 10, 15]);
    });

    it('should handle large negative step', () => {
      const result = [...range(20, 0, -5)];
      expect(result).toEqual([20, 15, 10, 5]);
    });

    it('should handle decimal step', () => {
      const result = [...range(0, 3, 0.5)];
      expect(result).toEqual([0, 0.5, 1, 1.5, 2, 2.5]);
    });

    it('should handle negative decimal step', () => {
      const result = [...range(3, 0, -0.5)];
      expect(result).toEqual([3, 2.5, 2, 1.5, 1, 0.5]);
    });

    it('should return empty range when step direction conflicts', () => {
      // When start > stop but step is positive, return empty range (like Python)
      expect([...range(10, 0, 1)]).toEqual([]);
      // When start < stop but step is negative, return empty range (like Python)
      expect([...range(0, 10, -1)]).toEqual([]);
    });
  });

  describe('error cases', () => {
    it('should throw error when step is 0', () => {
      expect(() => [...range(0, 10, 0)]).toThrow('Step cannot be zero');
    });
  });

  describe('iterator behavior', () => {
    it('should be iterable', () => {
      const gen = range(3);
      expect(typeof gen[Symbol.iterator]).toBe('function');
    });

    it('should work with for...of loop', () => {
      const values: number[] = [];
      for (const value of range(3)) {
        values.push(value);
      }
      expect(values).toEqual([0, 1, 2]);
    });

    it('should work with Array.from', () => {
      const result = Array.from(range(3));
      expect(result).toEqual([0, 1, 2]);
    });

    it('should be lazy (not compute all values at once)', () => {
      const gen = range(1000000);
      const iterator = gen[Symbol.iterator]();
      
      expect(iterator.next().value).toBe(0);
      expect(iterator.next().value).toBe(1);
      expect(iterator.next().value).toBe(2);
      // Should not have computed all million values
    });

    it('should be consumable only once', () => {
      const gen = range(3);
      const result1 = [...gen];
      const result2 = [...gen];
      
      expect(result1).toEqual([0, 1, 2]);
      expect(result2).toEqual([]); // Generator is exhausted
    });
  });

  describe('memory efficiency', () => {
    it('should handle very large ranges without memory issues', () => {
      const gen = range(0, 1000000, 100000);
      const values: number[] = [];
      for (const value of gen) {
        values.push(value);
      }
      expect(values).toEqual([0, 100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 900000]);
    });

    it('should not create intermediate arrays', () => {
      // This test ensures we\'re using generators, not creating arrays
      let count = 0;
      for (const _ of range(10)) {
        count++;
        if (count === 3) break;
      }
      expect(count).toBe(3);
    });
  });
});

describe('rangeIterable', () => {
  it('should create reusable iterable', () => {
    const r = rangeIterable(0, 3);
    const result1 = [...r];
    const result2 = [...r];
    
    expect(result1).toEqual([0, 1, 2]);
    expect(result2).toEqual([0, 1, 2]);
  });

  it('should work with all range signatures', () => {
    expect([...rangeIterable(3)]).toEqual([0, 1, 2]);
    expect([...rangeIterable(1, 4)]).toEqual([1, 2, 3]);
    expect([...rangeIterable(0, 6, 2)]).toEqual([0, 2, 4]);
  });

  it('should be iterable multiple times', () => {
    const r = rangeIterable(0, 3);
    
    let count1 = 0;
    for (const _ of r) count1++;
    
    let count2 = 0;
    for (const _ of r) count2++;
    
    expect(count1).toBe(3);
    expect(count2).toBe(3);
  });

  it('should work with destructuring', () => {
    const r = rangeIterable(0, 5);
    const [first, second, ...rest] = r;
    
    expect(first).toBe(0);
    expect(second).toBe(1);
    expect(rest).toEqual([2, 3, 4]);
  });
});
