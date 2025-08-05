import { LRUCache } from './lru-cache';

describe('LRUCache', () => {
  describe('constructor', () => {
    it('should create cache with valid capacity', () => {
      const cache = new LRUCache<string, number>(5);
      expect(cache.getCapacity()).toBe(5);
      expect(cache.size()).toBe(0);
      expect(cache.isEmpty()).toBe(true);
    });

    it('should throw error for invalid capacity', () => {
      expect(() => new LRUCache(0)).toThrow('Capacity must be a positive integer');
      expect(() => new LRUCache(-1)).toThrow('Capacity must be a positive integer');
      expect(() => new LRUCache(1.5)).toThrow('Capacity must be a positive integer');
      expect(() => new LRUCache(NaN)).toThrow('Capacity must be a positive integer');
    });
  });

  describe('basic operations', () => {
    let cache: LRUCache<string, number>;

    beforeEach(() => {
      cache = new LRUCache<string, number>(3);
    });

    it('should put and get values', () => {
      cache.put('a', 1);
      cache.put('b', 2);
      
      expect(cache.get('a')).toBe(1);
      expect(cache.get('b')).toBe(2);
      expect(cache.get('c')).toBeUndefined();
    });

    it('should update existing values', () => {
      cache.put('a', 1);
      cache.put('a', 10);
      
      expect(cache.get('a')).toBe(10);
      expect(cache.size()).toBe(1);
    });

    it('should check if key exists', () => {
      cache.put('a', 1);
      
      expect(cache.has('a')).toBe(true);
      expect(cache.has('b')).toBe(false);
    });

    it('should delete keys', () => {
      cache.put('a', 1);
      cache.put('b', 2);
      
      expect(cache.delete('a')).toBe(true);
      expect(cache.delete('c')).toBe(false);
      expect(cache.has('a')).toBe(false);
      expect(cache.has('b')).toBe(true);
      expect(cache.size()).toBe(1);
    });

    it('should clear all entries', () => {
      cache.put('a', 1);
      cache.put('b', 2);
      cache.clear();
      
      expect(cache.size()).toBe(0);
      expect(cache.isEmpty()).toBe(true);
      expect(cache.has('a')).toBe(false);
      expect(cache.has('b')).toBe(false);
    });
  });

  describe('capacity and size tracking', () => {
    it('should track size correctly', () => {
      const cache = new LRUCache<string, number>(3);
      
      expect(cache.size()).toBe(0);
      expect(cache.isEmpty()).toBe(true);
      expect(cache.isFull()).toBe(false);
      
      cache.put('a', 1);
      expect(cache.size()).toBe(1);
      expect(cache.isEmpty()).toBe(false);
      expect(cache.isFull()).toBe(false);
      
      cache.put('b', 2);
      cache.put('c', 3);
      expect(cache.size()).toBe(3);
      expect(cache.isEmpty()).toBe(false);
      expect(cache.isFull()).toBe(true);
    });

    it('should maintain capacity limit', () => {
      const cache = new LRUCache<string, number>(2);
      
      cache.put('a', 1);
      cache.put('b', 2);
      cache.put('c', 3); // Should evict 'a'
      
      expect(cache.size()).toBe(2);
      expect(cache.has('a')).toBe(false);
      expect(cache.has('b')).toBe(true);
      expect(cache.has('c')).toBe(true);
    });
  });

  describe('LRU eviction behavior', () => {
    let cache: LRUCache<string, number>;

    beforeEach(() => {
      cache = new LRUCache<string, number>(3);
    });

    it('should evict least recently used item when capacity is exceeded', () => {
      cache.put('a', 1);
      cache.put('b', 2);
      cache.put('c', 3);
      cache.put('d', 4); // Should evict 'a'
      
      expect(cache.has('a')).toBe(false);
      expect(cache.has('b')).toBe(true);
      expect(cache.has('c')).toBe(true);
      expect(cache.has('d')).toBe(true);
      expect(cache.size()).toBe(3);
    });

    it('should update access order when getting values', () => {
      cache.put('a', 1);
      cache.put('b', 2);
      cache.put('c', 3);
      
      cache.get('a'); // 'a' becomes most recently used
      cache.put('d', 4); // Should evict 'b'
      
      expect(cache.has('a')).toBe(true);
      expect(cache.has('b')).toBe(false);
      expect(cache.has('c')).toBe(true);
      expect(cache.has('d')).toBe(true);
    });

    it('should update access order when updating values', () => {
      cache.put('a', 1);
      cache.put('b', 2);
      cache.put('c', 3);
      
      cache.put('a', 10); // 'a' becomes most recently used
      cache.put('d', 4); // Should evict 'b'
      
      expect(cache.has('a')).toBe(true);
      expect(cache.get('a')).toBe(10);
      expect(cache.has('b')).toBe(false);
      expect(cache.has('c')).toBe(true);
      expect(cache.has('d')).toBe(true);
    });

    it('should maintain correct order with mixed operations', () => {
      cache.put('a', 1); // Order: [a]
      cache.put('b', 2); // Order: [a, b]
      cache.put('c', 3); // Order: [a, b, c]
      cache.get('a');    // Order: [b, c, a]
      cache.get('b');    // Order: [c, a, b]
      cache.put('d', 4); // Order: [a, b, d] (evicts c)
      
      expect(cache.has('a')).toBe(true);
      expect(cache.has('b')).toBe(true);
      expect(cache.has('c')).toBe(false);
      expect(cache.has('d')).toBe(true);
    });
  });

  describe('iteration and enumeration', () => {
    let cache: LRUCache<string, number>;

    beforeEach(() => {
      cache = new LRUCache<string, number>(5);
      cache.put('a', 1);
      cache.put('b', 2);
      cache.put('c', 3);
      cache.get('a'); // Move 'a' to end
    });

    it('should iterate keys in LRU order', () => {
      const keys = Array.from(cache.keys());
      expect(keys).toEqual(['b', 'c', 'a']);
    });

    it('should iterate values in LRU order', () => {
      const values = Array.from(cache.values());
      expect(values).toEqual([2, 3, 1]);
    });

    it('should iterate entries in LRU order', () => {
      const entries = Array.from(cache.entries());
      expect(entries).toEqual([['b', 2], ['c', 3], ['a', 1]]);
    });

    it('should be iterable with for...of', () => {
      const entries: [string, number][] = [];
      for (const entry of cache) {
        entries.push(entry);
      }
      expect(entries).toEqual([['b', 2], ['c', 3], ['a', 1]]);
    });

    it('should support forEach', () => {
      const entries: [string, number][] = [];
      cache.forEach((value, key) => {
        entries.push([key, value]);
      });
      expect(entries).toEqual([['b', 2], ['c', 3], ['a', 1]]);
    });

    it('should convert to array', () => {
      const array = cache.toArray();
      expect(array).toEqual([['b', 2], ['c', 3], ['a', 1]]);
    });
  });

  describe('edge cases', () => {
    it('should work with capacity of 1', () => {
      const cache = new LRUCache<string, number>(1);
      
      cache.put('a', 1);
      expect(cache.get('a')).toBe(1);
      
      cache.put('b', 2);
      expect(cache.has('a')).toBe(false);
      expect(cache.get('b')).toBe(2);
      expect(cache.size()).toBe(1);
    });

    it('should handle operations on empty cache', () => {
      const cache = new LRUCache<string, number>(3);
      
      expect(cache.get('missing')).toBeUndefined();
      expect(cache.delete('missing')).toBe(false);
      expect(cache.has('missing')).toBe(false);
      expect(Array.from(cache.keys())).toEqual([]);
      expect(Array.from(cache.values())).toEqual([]);
      expect(cache.toArray()).toEqual([]);
    });

    it('should work with different key and value types', () => {
      const cache = new LRUCache<number, string>(2);
      
      cache.put(1, 'one');
      cache.put(2, 'two');
      
      expect(cache.get(1)).toBe('one');
      expect(cache.get(2)).toBe('two');
      
      cache.put(3, 'three');
      expect(cache.has(1)).toBe(false);
      expect(cache.get(2)).toBe('two');
      expect(cache.get(3)).toBe('three');
    });

    it('should work with object keys and values', () => {
      interface User {
        id: number;
        name: string;
      }
      
      const cache = new LRUCache<string, User>(2);
      const user1: User = { id: 1, name: 'Alice' };
      const user2: User = { id: 2, name: 'Bob' };
      
      cache.put('user1', user1);
      cache.put('user2', user2);
      
      expect(cache.get('user1')).toEqual(user1);
      expect(cache.get('user2')).toEqual(user2);
    });
  });

  describe('memory management', () => {
    it('should not grow beyond capacity', () => {
      const cache = new LRUCache<string, number>(100);
      
      // Add more items than capacity
      for (let i = 0; i < 150; i++) {
        cache.put(`key${i}`, i);
      }
      
      expect(cache.size()).toBe(100);
      expect(cache.isFull()).toBe(true);
      
      // Oldest items should be evicted
      expect(cache.has('key0')).toBe(false);
      expect(cache.has('key49')).toBe(false);
      expect(cache.has('key50')).toBe(true);
      expect(cache.has('key149')).toBe(true);
    });

    it('should maintain performance with frequent access pattern changes', () => {
      const cache = new LRUCache<string, number>(10);
      
      // Fill cache
      for (let i = 0; i < 10; i++) {
        cache.put(`key${i}`, i);
      }
      
      // Access pattern that changes frequently
      for (let round = 0; round < 100; round++) {
        const key = `key${round % 10}`;
        cache.get(key);
        cache.put(`new${round}`, round);
      }
      
      expect(cache.size()).toBe(10);
      expect(cache.isFull()).toBe(true);
    });
  });
});
