import { unique } from './unique';

describe('unique', () => {
  it('should return an empty array when given an empty array', () => {
    expect(unique([])).toEqual([]);
  });

  it('should handle null or undefined input', () => {
    expect(unique(null as any)).toEqual([]);
    expect(unique(undefined as any)).toEqual([]);
  });

  it('should remove duplicate primitive values', () => {
    expect(unique([1, 2, 2, 3, 1, 4])).toEqual([1, 2, 3, 4]);
    expect(unique(['a', 'b', 'a', 'c', 'b'])).toEqual(['a', 'b', 'c']);
    expect(unique([true, false, true])).toEqual([true, false]);
  });

  it('should keep object references intact', () => {
    const obj1 = { id: 1 };
    const obj2 = { id: 2 };
    const obj3 = { id: 1 }; // Different reference but same id

    const array = [obj1, obj2, obj1, obj3];
    const result = unique(array);
    
    // Without custom key function, only references are compared
    expect(result).toEqual([obj1, obj2, obj3]);
    expect(result.length).toBe(3);
  });

  it('should use custom key selector to determine uniqueness', () => {
    const users = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' },
      { id: 1, name: 'Alice (duplicate)' },
      { id: 2, name: 'Bob (duplicate)' }
    ];

    const result = unique(users, user => user.id);
    
    expect(result).toEqual([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' }
    ]);
    expect(result.length).toBe(3);
  });

  it('should work with complex key selectors', () => {
    const items = [
      { category: 'A', subId: 1 },
      { category: 'B', subId: 1 },
      { category: 'A', subId: 2 },
      { category: 'A', subId: 1 }, // Duplicate
      { category: 'B', subId: 1 }  // Duplicate
    ];

    const result = unique(items, item => `${item.category}-${item.subId}`);
    
    expect(result).toEqual([
      { category: 'A', subId: 1 },
      { category: 'B', subId: 1 },
      { category: 'A', subId: 2 }
    ]);
    expect(result.length).toBe(3);
  });
});
