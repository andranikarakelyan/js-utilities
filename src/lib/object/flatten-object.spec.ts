import { flattenObject } from './flatten-object';

describe('flattenObject', () => {
  it('should flatten a simple nested object', () => {
    const input = {
      a: 1,
      b: {
        c: 2,
        d: 3
      }
    };

    const expected = {
      'a': 1,
      'b.c': 2,
      'b.d': 3
    };

    expect(flattenObject(input)).toEqual(expected);
  });

  it('should flatten deeply nested objects', () => {
    const input = {
      user: {
        profile: {
          name: 'John',
          age: 30,
          address: {
            street: '123 Main St',
            city: 'NYC',
            country: {
              code: 'US',
              name: 'United States'
            }
          }
        },
        settings: {
          theme: 'dark',
          notifications: {
            email: true,
            push: false
          }
        }
      },
      app: {
        version: '1.0.0'
      }
    };

    const expected = {
      'user.profile.name': 'John',
      'user.profile.age': 30,
      'user.profile.address.street': '123 Main St',
      'user.profile.address.city': 'NYC',
      'user.profile.address.country.code': 'US',
      'user.profile.address.country.name': 'United States',
      'user.settings.theme': 'dark',
      'user.settings.notifications.email': true,
      'user.settings.notifications.push': false,
      'app.version': '1.0.0'
    };

    expect(flattenObject(input)).toEqual(expected);
  });

  it('should handle arrays as primitive values', () => {
    const input = {
      items: [1, 2, 3],
      nested: {
        tags: ['tag1', 'tag2'],
        config: {
          options: ['a', 'b', 'c']
        }
      }
    };

    const expected = {
      'items': [1, 2, 3],
      'nested.tags': ['tag1', 'tag2'],
      'nested.config.options': ['a', 'b', 'c']
    };

    expect(flattenObject(input)).toEqual(expected);
  });

  it('should handle null and undefined values', () => {
    const input = {
      a: null,
      b: undefined,
      c: {
        d: null,
        e: undefined
      }
    };

    const expected = {
      'a': null,
      'b': undefined,
      'c.d': null,
      'c.e': undefined
    };

    expect(flattenObject(input)).toEqual(expected);
  });

  it('should handle Date objects as primitive values', () => {
    const date = new Date('2025-01-01');
    const input = {
      created: date,
      user: {
        lastLogin: date
      }
    };

    const expected = {
      'created': date,
      'user.lastLogin': date
    };

    expect(flattenObject(input)).toEqual(expected);
  });

  it('should handle RegExp objects as primitive values', () => {
    const regex = /test/g;
    const input = {
      pattern: regex,
      validation: {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      }
    };

    const expected = {
      'pattern': regex,
      'validation.email': /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    };

    expect(flattenObject(input)).toEqual(expected);
  });

  it('should handle empty objects', () => {
    const input = {};
    const expected = {};

    expect(flattenObject(input)).toEqual(expected);
  });

  it('should handle objects with empty nested objects', () => {
    const input = {
      a: 1,
      b: {},
      c: {
        d: {},
        e: 2
      }
    };

    const expected = {
      'a': 1,
      'c.e': 2
    };

    expect(flattenObject(input)).toEqual(expected);
  });

  it('should handle primitive values at root level', () => {
    const input = {
      string: 'hello',
      number: 42,
      boolean: true,
      nullValue: null,
      undefinedValue: undefined
    };

    const expected = {
      'string': 'hello',
      'number': 42,
      'boolean': true,
      'nullValue': null,
      'undefinedValue': undefined
    };

    expect(flattenObject(input)).toEqual(expected);
  });

  it('should handle mixed data types', () => {
    const input = {
      config: {
        database: {
          host: 'localhost',
          port: 5432,
          ssl: true,
          options: ['read', 'write'],
          credentials: null
        },
        cache: {
          enabled: false,
          ttl: 3600
        }
      },
      metadata: {
        version: '2.1.0',
        build: {
          timestamp: new Date('2025-01-01'),
          hash: 'abc123'
        }
      }
    };

    const result = flattenObject(input);

    expect(result['config.database.host']).toBe('localhost');
    expect(result['config.database.port']).toBe(5432);
    expect(result['config.database.ssl']).toBe(true);
    expect(result['config.database.options']).toEqual(['read', 'write']);
    expect(result['config.database.credentials']).toBe(null);
    expect(result['config.cache.enabled']).toBe(false);
    expect(result['config.cache.ttl']).toBe(3600);
    expect(result['metadata.version']).toBe('2.1.0');
    expect(result['metadata.build.timestamp']).toEqual(new Date('2025-01-01'));
    expect(result['metadata.build.hash']).toBe('abc123');
  });
});
