import { deepClone } from './deep-clone';

describe('deepClone', () => {
  it('should handle primitive values', () => {
    expect(deepClone(42)).toBe(42);
    expect(deepClone('hello')).toBe('hello');
    expect(deepClone(true)).toBe(true);
    expect(deepClone(null)).toBe(null);
    expect(deepClone(undefined)).toBe(undefined);
  });

  it('should clone objects deeply', () => {
    const original = {
      a: 1,
      b: {
        c: 2,
        d: {
          e: 3
        }
      }
    };

    const clone = deepClone(original);

    // Verify structure is the same
    expect(clone).toEqual(original);

    // Verify it's a deep clone
    clone.b.d.e = 4;
    expect(original.b.d.e).toBe(3);
    expect(clone.b.d.e).toBe(4);
  });

  it('should clone arrays deeply', () => {
    const original: any = [1, [2, { a: 3 }], 4];
    const clone = deepClone(original);

    // Verify structure is the same
    expect(clone).toEqual(original);

    // Verify it's a deep clone
    clone[1][1].a = 5;
    expect(original[1][1].a).toBe(3);
    expect(clone[1][1].a).toBe(5);
  });

  it('should handle circular references', () => {
    const original: any = { a: 1 };
    original.self = original;
    original.arr = [original];

    const clone = deepClone(original);

    // Verify structure
    expect(clone.a).toBe(1);
    expect(clone.self).toBe(clone);
    expect(clone.arr[0]).toBe(clone);

    // Verify it's a separate instance
    clone.a = 2;
    expect(original.a).toBe(1);
  });

  it('should clone dates correctly', () => {
    const date = new Date();
    const clone = deepClone(date);

    expect(clone).toEqual(date);
    expect(clone).not.toBe(date);
    expect(clone.getTime()).toBe(date.getTime());
  });

  it('should clone regular expressions correctly', () => {
    const regex = /test/gi;
    const clone = deepClone(regex);

    expect(clone).toEqual(regex);
    expect(clone).not.toBe(regex);
    expect(clone.source).toBe(regex.source);
    expect(clone.flags).toBe(regex.flags);
  });

  it('should clone Set objects correctly', () => {
    const original = new Set([1, { a: 2 }]);
    const clone = deepClone(original);

    expect(clone).toEqual(original);
    expect(clone).not.toBe(original);

    const originalObj = Array.from(original)[1];
    const clonedObj = Array.from(clone)[1];
    expect(clonedObj).toEqual(originalObj);
    expect(clonedObj).not.toBe(originalObj);
  });

  it('should clone Map objects correctly', () => {
    const key = { k: 1 };
    const value = { v: 2 };
    const original = new Map([[key, value]]);
    const clone = deepClone(original);

    expect(clone.size).toBe(original.size);
    
    const [[clonedKey, clonedValue]] = clone.entries();
    expect(clonedKey).toEqual(key);
    expect(clonedKey).not.toBe(key);
    expect(clonedValue).toEqual(value);
    expect(clonedValue).not.toBe(value);
  });
});
