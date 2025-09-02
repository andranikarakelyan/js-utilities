import { deepMerge } from './deep-merge';

describe('deepMerge', () => {
  describe('basic functionality', () => {
    it('should merge two simple objects', () => {
      const target = { a: 1, b: 2 };
      const source = { b: 3, c: 4 };
      const result = deepMerge(target, source);
      
      expect(result).toEqual({ a: 1, b: 3, c: 4 });
      expect(result).toBe(target); // Should modify target
    });

    it('should handle nested objects', () => {
      const target = { a: 1, b: { c: 2, d: 3 } };
      const source = { b: { d: 4, e: 5 }, f: 6 };
      const result = deepMerge(target, source);
      
      expect(result).toEqual({ 
        a: 1, 
        b: { c: 2, d: 4, e: 5 }, 
        f: 6 
      });
    });

    it('should handle deeply nested objects', () => {
      const target = { 
        user: { 
          profile: { name: 'John', age: 30 },
          settings: { theme: 'dark' }
        }
      };
      const source = { 
        user: { 
          profile: { age: 31, email: 'john@example.com' },
          settings: { notifications: true }
        }
      };
      const result = deepMerge(target, source);
      
      expect(result).toEqual({
        user: {
          profile: { name: 'John', age: 31, email: 'john@example.com' },
          settings: { theme: 'dark', notifications: true }
        }
      });
    });
  });

  describe('array handling', () => {
    it('should replace arrays, not merge them', () => {
      const target = { items: [1, 2, 3] };
      const source = { items: [4, 5] };
      const result = deepMerge(target, source);
      
      expect(result).toEqual({ items: [4, 5] });
    });

    it('should handle arrays in nested objects', () => {
      const target = { 
        data: { 
          numbers: [1, 2], 
          letters: ['a', 'b'] 
        } 
      };
      const source = { 
        data: { 
          numbers: [3, 4, 5], 
          symbols: ['!', '@'] 
        } 
      };
      const result = deepMerge(target, source);
      
      expect(result).toEqual({
        data: {
          numbers: [3, 4, 5],
          letters: ['a', 'b'],
          symbols: ['!', '@']
        }
      });
    });
  });

  describe('special values handling', () => {
    it('should handle null and undefined values', () => {
      const target = { a: 1, b: 2, c: 3 };
      const source = { b: null, c: undefined, d: 4 };
      const result = deepMerge(target, source);
      
      expect(result).toEqual({ a: 1, b: null, c: undefined, d: 4 });
    });

    it('should handle Date objects', () => {
      const date1 = new Date('2025-01-01');
      const date2 = new Date('2025-12-31');
      const target = { created: date1 };
      const source = { created: date2, updated: date1 };
      const result = deepMerge(target, source);
      
      expect(result.created).toBe(date2);
      expect((result as any).updated).toBe(date1);
    });

    it('should handle RegExp objects', () => {
      const regex1 = /test1/g;
      const regex2 = /test2/i;
      const target = { pattern: regex1 };
      const source = { pattern: regex2, validation: regex1 };
      const result = deepMerge(target, source);
      
      expect(result.pattern).toBe(regex2);
      expect((result as any).validation).toBe(regex1);
    });
  });

  describe('path-based merging', () => {
    it('should merge at simple path', () => {
      const target = { 
        user: { 
          profile: { name: 'John' },
          settings: { theme: 'dark' }
        } 
      };
      const source = { age: 30, email: 'john@example.com' };
      const result = deepMerge(target, source, 'user.profile');
      
      expect(result).toEqual({
        user: {
          profile: { name: 'John', age: 30, email: 'john@example.com' },
          settings: { theme: 'dark' }
        }
      });
    });

    it('should merge at nested path', () => {
      const target = { 
        app: { 
          config: { 
            database: { host: 'localhost' },
            cache: { enabled: true }
          } 
        } 
      };
      const source = { port: 5432, ssl: true };
      const result = deepMerge(target, source, 'app.config.database');
      
      expect(result).toEqual({
        app: {
          config: {
            database: { host: 'localhost', port: 5432, ssl: true },
            cache: { enabled: true }
          }
        }
      });
    });

    it('should create missing path objects', () => {
      const target = { user: {} };
      const source = { name: 'John', age: 30 };
      const result = deepMerge(target, source, 'user.profile.info');
      
      expect(result).toEqual({
        user: {
          profile: {
            info: { name: 'John', age: 30 }
          }
        }
      });
    });

    it('should handle array indices in paths', () => {
      const target = { 
        users: [
          { id: 1, profile: { name: 'John' } },
          { id: 2, profile: { name: 'Jane' } }
        ] 
      };
      const source = { age: 30, email: 'john@example.com' };
      const result = deepMerge(target, source, 'users.0.profile');
      
      expect(result).toEqual({
        users: [
          { id: 1, profile: { name: 'John', age: 30, email: 'john@example.com' } },
          { id: 2, profile: { name: 'Jane' } }
        ]
      });
    });

    it('should handle complex path with arrays and objects', () => {
      const target = { 
        user: { 
          profiles: [
            { id: 1, transactions: { count: 5 } }
          ] 
        } 
      };
      const source = { total: 100, recent: ['tx1', 'tx2'] };
      const result = deepMerge(target, source, 'user.profiles.0.transactions');
      
      expect(result).toEqual({
        user: {
          profiles: [
            { 
              id: 1, 
              transactions: { 
                count: 5, 
                total: 100, 
                recent: ['tx1', 'tx2'] 
              } 
            }
          ]
        }
      });
    });

    it('should handle array index as final path segment', () => {
      const target = { 
        items: [
          { name: 'item1' },
          { name: 'item2' }
        ]
      };
      const source = { price: 100, available: true };
      const result = deepMerge(target, source, 'items.1');
      
      expect(result).toEqual({
        items: [
          { name: 'item1' },
          { name: 'item2', price: 100, available: true }
        ]
      });
    });
  });

  describe('error handling', () => {
    it('should throw error for non-object target', () => {
      expect(() => deepMerge(null as any, {})).toThrow('Target must be an object');
      expect(() => deepMerge(undefined as any, {})).toThrow('Target must be an object');
      expect(() => deepMerge('string' as any, {})).toThrow('Target must be an object');
      expect(() => deepMerge(42 as any, {})).toThrow('Target must be an object');
    });

    it('should handle non-object source gracefully', () => {
      const target = { a: 1 };
      const result1 = deepMerge(target, null as any);
      const result2 = deepMerge(target, undefined as any);
      const result3 = deepMerge(target, 'string' as any);
      
      expect(result1).toEqual({ a: 1 });
      expect(result2).toEqual({ a: 1 });
      expect(result3).toEqual({ a: 1 });
    });

    it('should throw error for invalid array index in path', () => {
      const target = { items: [{ name: 'item1' }] };
      const source = { price: 100 };
      
      expect(() => deepMerge(target, source, 'items.5')).toThrow('Array index 5 is out of bounds');
    });

    it('should throw error when expecting array but finding object', () => {
      const target = { user: { profile: { name: 'John' } } };
      const source = { age: 30 };
      
      expect(() => deepMerge(target, source, 'user.profile.0')).toThrow('Expected array at path segment');
    });

    it('should throw error when expecting array at intermediate path', () => {
      const target = { user: { profile: 'string' } };
      const source = { age: 30 };
      
      expect(() => deepMerge(target, source, 'user.profile.0.info')).toThrow('Expected array at path segment');
    });
  });

  describe('edge cases', () => {
    it('should handle empty objects', () => {
      const target = {};
      const source = { a: 1, b: 2 };
      const result = deepMerge(target, source);
      
      expect(result).toEqual({ a: 1, b: 2 });
    });

    it('should handle empty source', () => {
      const target = { a: 1, b: 2 };
      const source = {};
      const result = deepMerge(target, source);
      
      expect(result).toEqual({ a: 1, b: 2 });
    });

    it('should handle single-level path', () => {
      const target = { user: { name: 'John' } };
      const source = { age: 30 };
      const result = deepMerge(target, source, 'user');
      
      expect(result).toEqual({
        user: { name: 'John', age: 30 }
      });
    });

    it('should handle empty path (should work like normal merge)', () => {
      const target = { a: 1 };
      const source = { b: 2 };
      const result = deepMerge(target, source, '');
      
      expect(result).toEqual({ a: 1, b: 2 });
    });
  });

  describe('immutability of source', () => {
    it('should not modify source object', () => {
      const target = { a: { b: 1 } };
      const source = { a: { c: 2 }, d: 3 };
      const originalSource = JSON.parse(JSON.stringify(source));
      
      deepMerge(target, source);
      
      expect(source).toEqual(originalSource);
    });

    it('should create new arrays from source', () => {
      const target = { items: [] };
      const sourceArray = [1, 2, 3];
      const source = { items: sourceArray };
      
      deepMerge(target, source);
      
      expect(target.items).toEqual([1, 2, 3]);
      expect(target.items).not.toBe(sourceArray); // Should be a copy
    });
  });
});
