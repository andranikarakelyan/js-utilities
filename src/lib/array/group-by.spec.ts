import { groupBy } from './group-by';

describe('groupBy', () => {
  it('should return an empty Map when given an empty array', () => {
    const result = groupBy([], x => x);
    expect(result.size).toBe(0);
    expect(result instanceof Map).toBe(true);
  });

  it('should handle null or undefined input', () => {
    expect(groupBy(null as any, x => x).size).toBe(0);
    expect(groupBy(undefined as any, x => x).size).toBe(0);
  });

  it('should group numbers by even/odd', () => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
    const result = groupBy(numbers, n => n % 2 === 0 ? 'even' : 'odd');
    
    expect(result.size).toBe(2);
    expect(result.get('odd')).toEqual([1, 3, 5, 7]);
    expect(result.get('even')).toEqual([2, 4, 6, 8]);
  });

  it('should group strings by length', () => {
    const words = ['a', 'bb', 'ccc', 'dd', 'e', 'fff'];
    const result = groupBy(words, word => word.length);
    
    expect(result.size).toBe(3);
    expect(result.get(1)).toEqual(['a', 'e']);
    expect(result.get(2)).toEqual(['bb', 'dd']);
    expect(result.get(3)).toEqual(['ccc', 'fff']);
  });

  it('should group objects by property', () => {
    const users = [
      { name: 'Alice', department: 'Engineering' },
      { name: 'Bob', department: 'Marketing' },
      { name: 'Charlie', department: 'Engineering' },
      { name: 'Diana', department: 'Sales' },
      { name: 'Eve', department: 'Marketing' }
    ];

    const result = groupBy(users, user => user.department);
    
    expect(result.size).toBe(3);
    expect(result.get('Engineering')).toEqual([
      { name: 'Alice', department: 'Engineering' },
      { name: 'Charlie', department: 'Engineering' }
    ]);
    expect(result.get('Marketing')).toEqual([
      { name: 'Bob', department: 'Marketing' },
      { name: 'Eve', department: 'Marketing' }
    ]);
    expect(result.get('Sales')).toEqual([
      { name: 'Diana', department: 'Sales' }
    ]);
  });

  it('should group by complex key selector', () => {
    const products = [
      { name: 'Laptop', category: 'Electronics', price: 1000 },
      { name: 'Phone', category: 'Electronics', price: 500 },
      { name: 'Desk', category: 'Furniture', price: 200 },
      { name: 'Chair', category: 'Furniture', price: 150 },
      { name: 'Tablet', category: 'Electronics', price: 300 }
    ];

    // Group by price range
    const result = groupBy(products, product => {
      if (product.price < 200) return 'cheap';
      if (product.price < 600) return 'medium';
      return 'expensive';
    });
    
    expect(result.size).toBe(3);
    expect(result.get('cheap')).toEqual([
      { name: 'Chair', category: 'Furniture', price: 150 }
    ]);
    expect(result.get('medium')).toEqual([
      { name: 'Phone', category: 'Electronics', price: 500 },
      { name: 'Desk', category: 'Furniture', price: 200 },
      { name: 'Tablet', category: 'Electronics', price: 300 }
    ]);
    expect(result.get('expensive')).toEqual([
      { name: 'Laptop', category: 'Electronics', price: 1000 }
    ]);
  });

  it('should group by composite keys', () => {
    const data = [
      { type: 'A', status: 'active' },
      { type: 'B', status: 'active' },
      { type: 'A', status: 'inactive' },
      { type: 'A', status: 'active' },
      { type: 'B', status: 'inactive' }
    ];

    const result = groupBy(data, item => `${item.type}-${item.status}`);
    
    expect(result.size).toBe(4);
    expect(result.get('A-active')).toEqual([
      { type: 'A', status: 'active' },
      { type: 'A', status: 'active' }
    ]);
    expect(result.get('B-active')).toEqual([
      { type: 'B', status: 'active' }
    ]);
    expect(result.get('A-inactive')).toEqual([
      { type: 'A', status: 'inactive' }
    ]);
    expect(result.get('B-inactive')).toEqual([
      { type: 'B', status: 'inactive' }
    ]);
  });

  it('should handle single element array', () => {
    const result = groupBy([42], x => x);
    
    expect(result.size).toBe(1);
    expect(result.get(42)).toEqual([42]);
  });

  it('should handle all elements having the same key', () => {
    const numbers = [1, 2, 3, 4, 5];
    const result = groupBy(numbers, () => 'same');
    
    expect(result.size).toBe(1);
    expect(result.get('same')).toEqual([1, 2, 3, 4, 5]);
  });

  it('should handle different types as keys', () => {
    const mixed = [
      { id: 1, flag: true },
      { id: 2, flag: false },
      { id: 3, flag: true },
      { id: 4, flag: false }
    ];

    const result = groupBy(mixed, item => item.flag);
    
    expect(result.size).toBe(2);
    expect(result.get(true)).toEqual([
      { id: 1, flag: true },
      { id: 3, flag: true }
    ]);
    expect(result.get(false)).toEqual([
      { id: 2, flag: false },
      { id: 4, flag: false }
    ]);
  });

  it('should preserve order within groups', () => {
    const items = ['apple', 'banana', 'apricot', 'blueberry', 'avocado'];
    const result = groupBy(items, item => item[0]); // Group by first letter
    
    expect(result.get('a')).toEqual(['apple', 'apricot', 'avocado']);
    expect(result.get('b')).toEqual(['banana', 'blueberry']);
  });
});
