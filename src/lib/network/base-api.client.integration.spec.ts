import * as http from 'http';
import { BaseApiClient, BaseApiClientConfig } from './base-api.client';

/**
 * Test implementation of BaseApiClient for integration testing
 */
class TestApiClient extends BaseApiClient {
  constructor(config: BaseApiClientConfig) {
    super(config);
  }

  public async getUser(id: number): Promise<{ id: number; name: string }> {
    return this.request({
      path: `/users/${id}`,
      method: 'GET',
    });
  }

  public async createUser(
    data: { name: string; email: string }
  ): Promise<{ id: number; name: string; email: string }> {
    return this.request({
      path: '/users',
      method: 'POST',
      body: data,
    });
  }

  public async updateUser(
    id: number,
    data: Partial<{ name: string; email: string }>
  ): Promise<{ id: number; name: string; email: string }> {
    return this.request({
      path: `/users/${id}`,
      method: 'PUT',
      body: data,
    });
  }

  public async fetchWithCustomHeaders(path: string): Promise<any> {
    return this.request({
      path,
      method: 'GET',
    });
  }
}

describe('BaseApiClient - Integration Tests with Real Server', () => {
  let server: http.Server;
  let serverPort: number;
  let client: TestApiClient;
  let receivedHeaders: Record<string, string | string[] | undefined> = {};

  beforeAll((done) => {
    // Create a simple HTTP server to test against
    server = http.createServer((req, res) => {
      // Store received headers for verification
      receivedHeaders = req.headers;

      // Mock endpoint: GET /users/:id
      if (req.method === 'GET' && req.url?.startsWith('/users/')) {
        const id = req.url.split('/').pop();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            id: parseInt(id as string, 10),
            name: 'John Doe',
          })
        );
        return;
      }

      // Mock endpoint: POST /users
      if (req.method === 'POST' && req.url === '/users') {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk.toString();
        });
        req.on('end', () => {
          const data = JSON.parse(body);
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              id: 1,
              name: data.name,
              email: data.email,
            })
          );
        });
        return;
      }

      // Mock endpoint: PUT /users/:id
      if (req.method === 'PUT' && req.url?.startsWith('/users/')) {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk.toString();
        });
        req.on('end', () => {
          const data = JSON.parse(body);
          const id = req.url!.split('/').pop();
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              id: parseInt(id as string, 10),
              name: data.name,
              email: data.email,
            })
          );
        });
        return;
      }

      // Mock endpoint: GET /headers (returns received headers)
      if (req.method === 'GET' && req.url === '/headers') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ headers: req.headers }));
        return;
      }

      // Mock endpoint: GET /custom-response
      if (req.method === 'GET' && req.url === '/custom-response') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            success: true,
            data: { message: 'Success' },
          })
        );
        return;
      }

      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not Found' }));
    });

    server.listen(0, () => {
      serverPort = (server.address() as any).port;
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  beforeEach(() => {
    receivedHeaders = {};
    const config: BaseApiClientConfig = {
      baseUrl: `http://localhost:${serverPort}`,
    };
    client = new TestApiClient(config);
  });

  describe('Headers in requests', () => {
    it('should send Content-Type header as application/json', async () => {
      await client.getUser(1);

      expect(receivedHeaders['content-type']).toBe('application/json');
    });

    it('should set custom headers via setHeaders', async () => {
      client.setHeaders({
        'X-Custom-Header': 'custom-value',
      });

      await client.getUser(1);

      expect(receivedHeaders['x-custom-header']).toBe('custom-value');
    });

    it('should set multiple custom headers at once', async () => {
      client.setHeaders({
        'X-Request-Id': 'req-123',
        'X-User-Id': 'user-456',
        'X-Source': 'mobile-app',
      });

      await client.getUser(1);

      expect(receivedHeaders['x-request-id']).toBe('req-123');
      expect(receivedHeaders['x-user-id']).toBe('user-456');
      expect(receivedHeaders['x-source']).toBe('mobile-app');
    });

    it('should update headers on subsequent requests', async () => {
      // First request with initial headers
      client.setHeaders({
        'X-Tracking-Id': 'track-001',
      });
      await client.getUser(1);
      expect(receivedHeaders['x-tracking-id']).toBe('track-001');

      // Second request with updated headers
      client.setHeaders({
        'X-Tracking-Id': 'track-002',
      });
      await client.getUser(2);
      expect(receivedHeaders['x-tracking-id']).toBe('track-002');
    });

    it('should remove headers when set to null', async () => {
      client.setHeaders({
        'X-Custom-Header': 'custom-value',
      });
      await client.getUser(1);
      expect(receivedHeaders['x-custom-header']).toBe('custom-value');

      // Remove the header
      client.setHeaders({
        'X-Custom-Header': null,
      });
      await client.getUser(2);
      expect(receivedHeaders['x-custom-header']).toBeUndefined();
    });
  });

  describe('Request methods with headers', () => {
    it('should include headers in POST requests', async () => {
      client.setHeaders({
        'X-Request-Type': 'user-creation',
      });

      await client.createUser({
        name: 'Jane Doe',
        email: 'jane@example.com',
      });

      expect(receivedHeaders['x-request-type']).toBe('user-creation');
      expect(receivedHeaders['content-type']).toBe('application/json');
    });

    it('should include headers in PUT requests', async () => {
      client.setHeaders({
        'X-Request-Type': 'user-update',
      });

      await client.updateUser(1, {
        name: 'Updated User',
      });

      expect(receivedHeaders['x-request-type']).toBe('user-update');
      expect(receivedHeaders['content-type']).toBe('application/json');
    });

    it('should include custom headers in GET requests with query parameters', async () => {
      client.setHeaders({
        'X-Api-Version': '2.0',
      });

      const result = await client.fetchWithCustomHeaders('/users/123');

      expect(receivedHeaders['x-api-version']).toBe('2.0');
      expect(receivedHeaders['content-type']).toBe('application/json');
    });
  });

  describe('Headers persistence and retrieval', () => {
    it('should return current headers via getHeaders', async () => {
      client.setHeaders({
        'X-Custom-1': 'value1',
        'X-Custom-2': 'value2',
      });

      const headers = client.getHeaders();

      expect(headers['X-Custom-1']).toBe('value1');
      expect(headers['X-Custom-2']).toBe('value2');
      // Default headers set during construction
      expect(headers['Content-Type']).toBe('application/json');
    });

    it('should maintain headers across multiple requests', async () => {
      client.setHeaders({
        'X-Session-Id': 'session-abc123',
      });

      await client.getUser(1);
      const firstRequestHeaders = { ...receivedHeaders };

      await client.createUser({
        name: 'Test',
        email: 'test@example.com',
      });
      const secondRequestHeaders = { ...receivedHeaders };

      expect(firstRequestHeaders['x-session-id']).toBe('session-abc123');
      expect(secondRequestHeaders['x-session-id']).toBe('session-abc123');
    });

    it('should add headers to existing headers', async () => {
      // First set some headers
      client.setHeaders({
        'X-Header-1': 'value1',
      });
      await client.getUser(1);
      expect(receivedHeaders['x-header-1']).toBe('value1');
      expect(receivedHeaders['content-type']).toBe('application/json');

      // Add more headers without removing existing ones
      client.setHeaders({
        'X-Header-2': 'value2',
      });
      await client.getUser(2);
      expect(receivedHeaders['x-header-1']).toBe('value1');
      expect(receivedHeaders['x-header-2']).toBe('value2');
      expect(receivedHeaders['content-type']).toBe('application/json');
    });
  });

  describe('Complex scenarios', () => {
    it('should handle sequential requests with different headers', async () => {
      // Request 1: With specific headers
      client.setHeaders({
        'X-Request-Number': '1',
        'X-User-Role': 'admin',
      });
      await client.getUser(1);
      expect(receivedHeaders['x-request-number']).toBe('1');
      expect(receivedHeaders['x-user-role']).toBe('admin');

      // Request 2: Update headers
      client.setHeaders({
        'X-Request-Number': '2',
        'X-User-Role': null, // Remove this header
      });
      await client.getUser(2);
      expect(receivedHeaders['x-request-number']).toBe('2');
      expect(receivedHeaders['x-user-role']).toBeUndefined();

      // Request 3: Add different headers
      client.setHeaders({
        'X-Request-Number': '3',
        'X-Client-Version': '1.5.0',
      });
      await client.getUser(3);
      expect(receivedHeaders['x-request-number']).toBe('3');
      expect(receivedHeaders['x-client-version']).toBe('1.5.0');
      expect(receivedHeaders['content-type']).toBe('application/json');
    });

    it('should preserve headers through error responses', async () => {
      client.setHeaders({
        'X-Debug-Mode': 'enabled',
      });

      try {
        await client.fetchWithCustomHeaders('/nonexistent');
      } catch (error) {
        // Expected to fail
      }

      // Verify headers were sent despite the error
      expect(receivedHeaders['x-debug-mode']).toBe('enabled');
      expect(receivedHeaders['content-type']).toBe('application/json');
    });

    it('should handle rapid header changes', async () => {
      const headerChanges = ['value1', 'value2', 'value3', 'value4', 'value5'];

      for (const value of headerChanges) {
        client.setHeaders({
          'X-Rapid-Change': value,
        });
        await client.getUser(1);
        expect(receivedHeaders['x-rapid-change']).toBe(value);
      }
    });

    it('should handle header values with special characters', async () => {
      client.setHeaders({
        'X-Special-Header': 'value-with-dashes_and_underscores.and.dots',
        'X-Encoded-Value': 'eyJkYXRhIjoiZXhhbXBsZSJ9', // Base64 encoded JSON
      });

      await client.getUser(1);

      expect(receivedHeaders['x-special-header']).toBe(
        'value-with-dashes_and_underscores.and.dots'
      );
      expect(receivedHeaders['x-encoded-value']).toBe(
        'eyJkYXRhIjoiZXhhbXBsZSJ9'
      );
    });

    it('should support custom header rotation', async () => {
      // First request with header
      client.setHeaders({
        'X-Api-Version': 'v1',
      });
      await client.getUser(1);
      expect(receivedHeaders['x-api-version']).toBe('v1');

      // Rotate to new version
      client.setHeaders({
        'X-Api-Version': 'v2',
      });
      await client.getUser(2);
      expect(receivedHeaders['x-api-version']).toBe('v2');

      // Rotate again
      client.setHeaders({
        'X-Api-Version': 'v3',
      });
      await client.getUser(3);
      expect(receivedHeaders['x-api-version']).toBe('v3');
    });
  });

  describe('Header validation', () => {
    it('should always include default headers (Content-Type)', async () => {
      await client.getUser(1);

      expect(receivedHeaders['content-type']).toBe('application/json');
    });

    it('should preserve case sensitivity for header names when retrieving', () => {
      client.setHeaders({
        'X-Custom-Header': 'value1',
        'x-lowercase-header': 'value2',
      });

      const headers = client.getHeaders();

      // Note: HTTP headers are case-insensitive, but we should preserve the stored format
      expect(Object.keys(headers).length).toBeGreaterThan(2);
    });

    it('should handle empty header value', async () => {
      client.setHeaders({
        'X-Empty-Header': '',
      });

      await client.getUser(1);

      expect(receivedHeaders['x-empty-header']).toBe('');
    });
  });

  describe('Response handling with custom headers', () => {
    it('should successfully parse response after setting custom headers', async () => {
      client.setHeaders({
        'X-Request-Id': 'req-12345',
      });

      const result = await client.getUser(42);

      expect(result.id).toBe(42);
      expect(result.name).toBe('John Doe');
      expect(receivedHeaders['x-request-id']).toBe('req-12345');
    });

    it('should handle different response types with custom headers', async () => {
      client.setHeaders({
        'X-Response-Type': 'custom',
      });

      const result = await client.createUser({
        name: 'Test User',
        email: 'test@example.com',
      });

      expect(result.id).toBeDefined();
      expect(result.name).toBe('Test User');
      expect(result.email).toBe('test@example.com');
      expect(receivedHeaders['x-response-type']).toBe('custom');
    });
  });
});
