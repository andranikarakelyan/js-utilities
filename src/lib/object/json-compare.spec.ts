import { jsonCompare, JsonDifference, JsonDiffType } from './json-compare';

describe('jsonCompare', () => {
  describe('basic functionality', () => {
    it('should return empty array when comparing identical objects', () => {
      const base = { name: 'John', age: 30 };
      const comparison = { name: 'John', age: 30 };
      
      const result = jsonCompare(base, [comparison]);
      
      expect(result).toEqual([]);
    });

    it('should detect missing keys', () => {
      const base = { name: 'John', age: 30, city: 'NYC' };
      const comparison = { name: 'John' };
      
      const result = jsonCompare(base, [comparison]);
      
      expect(result).toHaveLength(2);
      expect(result).toContainEqual({
        objectIndex: 0,
        diffType: 'missing_key',
        keyPath: 'age',
        baseValueType: 'number'
      });
      expect(result).toContainEqual({
        objectIndex: 0,
        diffType: 'missing_key',
        keyPath: 'city',
        baseValueType: 'string'
      });
    });

    it('should detect extra keys', () => {
      const base = { name: 'John' };
      const comparison = { name: 'John', age: 30, email: 'john@example.com' };
      
      const result = jsonCompare(base, [comparison]);
      
      expect(result).toHaveLength(2);
      expect(result).toContainEqual({
        objectIndex: 0,
        diffType: 'extra_key',
        keyPath: 'age',
        comparedValueType: 'number'
      });
      expect(result).toContainEqual({
        objectIndex: 0,
        diffType: 'extra_key',
        keyPath: 'email',
        comparedValueType: 'string'
      });
    });

    it('should detect type mismatches', () => {
      const base = { age: 30, active: true, items: [] };
      const comparison = { age: '30', active: 'true', items: {} };
      
      const result = jsonCompare(base, [comparison]);
      
      expect(result).toHaveLength(3);
      expect(result).toContainEqual({
        objectIndex: 0,
        diffType: 'type_mismatch',
        keyPath: 'age',
        baseValueType: 'number',
        comparedValueType: 'string'
      });
      expect(result).toContainEqual({
        objectIndex: 0,
        diffType: 'type_mismatch',
        keyPath: 'active',
        baseValueType: 'boolean',
        comparedValueType: 'string'
      });
      expect(result).toContainEqual({
        objectIndex: 0,
        diffType: 'type_mismatch',
        keyPath: 'items',
        baseValueType: 'array',
        comparedValueType: 'object'
      });
    });
  });

  describe('nested objects', () => {
    it('should detect differences in nested objects', () => {
      const base = {
        user: {
          name: 'John',
          profile: {
            age: 30,
            address: {
              city: 'NYC',
              zip: '10001'
            }
          }
        }
      };
      const comparison = {
        user: {
          name: 'John',
          profile: {
            age: '30',
            address: {
              city: 'NYC'
            }
          }
        }
      };
      
      const result = jsonCompare(base, [comparison]);
      
      expect(result).toHaveLength(2);
      expect(result).toContainEqual({
        objectIndex: 0,
        diffType: 'type_mismatch',
        keyPath: 'user.profile.age',
        baseValueType: 'number',
        comparedValueType: 'string'
      });
      expect(result).toContainEqual({
        objectIndex: 0,
        diffType: 'missing_key',
        keyPath: 'user.profile.address.zip',
        baseValueType: 'string'
      });
    });

    it('should handle deeply nested structures', () => {
      const base = { a: { b: { c: { d: 'deep' } } } };
      const comparison = { a: { b: { c: { d: 123 } } } };
      
      const result = jsonCompare(base, [comparison]);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        objectIndex: 0,
        diffType: 'type_mismatch',
        keyPath: 'a.b.c.d',
        baseValueType: 'string',
        comparedValueType: 'number'
      });
    });
  });

  describe('multiple comparisons', () => {
    it('should handle multiple comparison objects', () => {
      const base = { name: 'John', age: 30 };
      const comparison1 = { name: 'John' }; // missing age
      const comparison2 = { name: 'John', age: '30' }; // age type mismatch
      const comparison3 = { name: 'John', age: 30, email: 'john@example.com' }; // extra email
      
      const result = jsonCompare(base, [comparison1, comparison2, comparison3]);
      
      expect(result).toHaveLength(3);
      expect(result).toContainEqual({
        objectIndex: 0,
        diffType: 'missing_key',
        keyPath: 'age',
        baseValueType: 'number'
      });
      expect(result).toContainEqual({
        objectIndex: 1,
        diffType: 'type_mismatch',
        keyPath: 'age',
        baseValueType: 'number',
        comparedValueType: 'string'
      });
      expect(result).toContainEqual({
        objectIndex: 2,
        diffType: 'extra_key',
        keyPath: 'email',
        comparedValueType: 'string'
      });
    });

    it('should correctly index multiple objects', () => {
      const base = { x: 1 };
      const comparisons = [
        { x: 1, a: 1 },
        { x: 1, b: 2 },
        { x: 1, c: 3 }
      ];
      
      const result = jsonCompare(base, comparisons);
      
      expect(result).toHaveLength(3);
      expect(result[0].objectIndex).toBe(0);
      expect(result[1].objectIndex).toBe(1);
      expect(result[2].objectIndex).toBe(2);
    });
  });

  describe('special values', () => {
    it('should handle null values', () => {
      const base = { value: null };
      const comparison = { value: 'not null' };
      
      const result = jsonCompare(base, [comparison]);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        objectIndex: 0,
        diffType: 'type_mismatch',
        keyPath: 'value',
        baseValueType: 'null',
        comparedValueType: 'string'
      });
    });

    it('should handle undefined values', () => {
      const base = { value: undefined };
      const comparison = { value: 'defined' };
      
      const result = jsonCompare(base, [comparison]);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        objectIndex: 0,
        diffType: 'type_mismatch',
        keyPath: 'value',
        baseValueType: 'undefined',
        comparedValueType: 'string'
      });
    });

    it('should distinguish arrays from objects', () => {
      const base = { items: [] };
      const comparison = { items: {} };
      
      const result = jsonCompare(base, [comparison]);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        objectIndex: 0,
        diffType: 'type_mismatch',
        keyPath: 'items',
        baseValueType: 'array',
        comparedValueType: 'object'
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty objects', () => {
      const base = {};
      const comparison = {};
      
      const result = jsonCompare(base, [comparison]);
      
      expect(result).toEqual([]);
    });

    it('should handle empty comparison array', () => {
      const base = { name: 'John' };
      
      const result = jsonCompare(base, []);
      
      expect(result).toEqual([]);
    });

    it('should handle non-object base', () => {
      const base = 'not an object';
      const comparison = { name: 'John' };
      
      const result = jsonCompare(base, [comparison]);
      
      expect(result).toEqual([]);
    });

    it('should handle non-object comparison', () => {
      const base = { name: 'John' };
      const comparison = 'not an object';
      
      const result = jsonCompare(base, [comparison]);
      
      expect(result).toEqual([]);
    });

    it('should handle null base', () => {
      const base = null;
      const comparison = { name: 'John' };
      
      const result = jsonCompare(base, [comparison]);
      
      expect(result).toEqual([]);
    });

    it('should handle null comparison', () => {
      const base = { name: 'John' };
      const comparison = null;
      
      const result = jsonCompare(base, [comparison]);
      
      expect(result).toEqual([]);
    });
  });

  describe('real-world scenarios', () => {
    it('should handle complex nested structures', () => {
      const base = {
        app: {
          name: 'My App',
          version: '1.0.0',
          features: {
            auth: {
              enabled: true,
              providers: ['google', 'facebook']
            },
            notifications: {
              email: true,
              push: false
            }
          },
          metadata: {
            created: '2023-01-01',
            updated: '2023-06-01'
          }
        }
      };

      const incomplete = {
        app: {
          name: 'My App',
          version: '1.0.0',
          features: {
            auth: {
              enabled: true
              // missing providers
            }
            // missing notifications
          }
          // missing metadata
        }
      };

      const result = jsonCompare(base, [incomplete]);
      
      expect(result).toHaveLength(3);
      expect(result).toContainEqual({
        objectIndex: 0,
        diffType: 'missing_key',
        keyPath: 'app.features.auth.providers',
        baseValueType: 'array'
      });
      expect(result).toContainEqual({
        objectIndex: 0,
        diffType: 'missing_key',
        keyPath: 'app.features.notifications',
        baseValueType: 'object'
      });
      expect(result).toContainEqual({
        objectIndex: 0,
        diffType: 'missing_key',
        keyPath: 'app.metadata',
        baseValueType: 'object'
      });
    });
  });
});
