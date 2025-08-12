import { unflattenObject } from './unflatten-object';

describe('unflattenObject', () => {
  it('should unflatten a simple flat object', () => {
    const input = {
      'a': 1,
      'b.c': 2,
      'b.d': 3
    };

    const expected = {
      a: 1,
      b: {
        c: 2,
        d: 3
      }
    };

    expect(unflattenObject(input)).toEqual(expected);
  });

  it('should unflatten deeply nested objects', () => {
    const input = {
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

    const expected = {
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

    expect(unflattenObject(input)).toEqual(expected);
  });

  it('should handle arrays as primitive values', () => {
    const input = {
      'items': [1, 2, 3],
      'nested.tags': ['tag1', 'tag2'],
      'nested.config.options': ['a', 'b', 'c']
    };

    const expected = {
      items: [1, 2, 3],
      nested: {
        tags: ['tag1', 'tag2'],
        config: {
          options: ['a', 'b', 'c']
        }
      }
    };

    expect(unflattenObject(input)).toEqual(expected);
  });

  it('should handle null and undefined values', () => {
    const input = {
      'a': null,
      'b': undefined,
      'c.d': null,
      'c.e': undefined
    };

    const expected = {
      a: null,
      b: undefined,
      c: {
        d: null,
        e: undefined
      }
    };

    expect(unflattenObject(input)).toEqual(expected);
  });

  it('should handle Date objects as primitive values', () => {
    const date = new Date('2025-01-01');
    const input = {
      'created': date,
      'user.lastLogin': date
    };

    const expected = {
      created: date,
      user: {
        lastLogin: date
      }
    };

    expect(unflattenObject(input)).toEqual(expected);
  });

  it('should handle RegExp objects as primitive values', () => {
    const regex = /test/g;
    const input = {
      'pattern': regex,
      'validation.email': /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    };

    const expected = {
      pattern: regex,
      validation: {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      }
    };

    expect(unflattenObject(input)).toEqual(expected);
  });

  it('should handle empty objects', () => {
    const input = {};
    const expected = {};

    expect(unflattenObject(input)).toEqual(expected);
  });

  it('should handle single-level keys', () => {
    const input = {
      string: 'hello',
      number: 42,
      boolean: true,
      nullValue: null,
      undefinedValue: undefined
    };

    const expected = {
      string: 'hello',
      number: 42,
      boolean: true,
      nullValue: null,
      undefinedValue: undefined
    };

    expect(unflattenObject(input)).toEqual(expected);
  });

  it('should handle mixed data types', () => {
    const input = {
      'config.database.host': 'localhost',
      'config.database.port': 5432,
      'config.database.ssl': true,
      'config.database.options': ['read', 'write'],
      'config.database.credentials': null,
      'config.cache.enabled': false,
      'config.cache.ttl': 3600,
      'metadata.version': '2.1.0',
      'metadata.build.timestamp': new Date('2025-01-01'),
      'metadata.build.hash': 'abc123'
    };

    const result = unflattenObject(input);

    expect(result).toEqual({
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
    });
  });

  it('should handle overlapping keys correctly', () => {
    const input = {
      'a.b.c': 1,
      'a.b.d': 2,
      'a.e': 3
    };

    const expected = {
      a: {
        b: {
          c: 1,
          d: 2
        },
        e: 3
      }
    };

    expect(unflattenObject(input)).toEqual(expected);
  });

  it('should handle keys with single character paths', () => {
    const input = {
      'a': 1,
      'b': {
        c: 2
      }
    };

    const expected = {
      a: 1,
      b: {
        c: 2
      }
    };

    expect(unflattenObject(input)).toEqual(expected);
  });

  it('should be the inverse of flattenObject', () => {
    const originalObject = {
      user: {
        profile: {
          name: 'John',
          age: 30,
          preferences: {
            theme: 'dark',
            language: 'en'
          }
        },
        account: {
          type: 'premium',
          created: new Date('2025-01-01'),
          settings: {
            notifications: true,
            marketing: false
          }
        }
      },
      app: {
        version: '1.0.0',
        features: ['feature1', 'feature2']
      }
    };

    // Import flattenObject for this test
    const { flattenObject } = require('./flatten-object');
    
    const flattened = flattenObject(originalObject);
    const unflattened = unflattenObject(flattened);

    expect(unflattened).toEqual(originalObject);
  });
});
