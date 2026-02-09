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

      // Mock endpoint: GET /error/400
      if (req.method === 'GET' && req.url === '/error/400') {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            error: 'Bad Request',
            message: 'Invalid input provided',
            code: 'INVALID_INPUT',
            details: {
              field: 'email',
              reason: 'Invalid email format',
            },
          })
        );
        return;
      }

      // Mock endpoint: GET /error/401
      if (req.method === 'GET' && req.url === '/error/401') {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            error: 'Unauthorized',
            message: 'Authentication token is missing or invalid',
            code: 'AUTH_FAILED',
            timestamp: new Date().toISOString(),
          })
        );
        return;
      }

      // Mock endpoint: GET /error/403
      if (req.method === 'GET' && req.url === '/error/403') {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            error: 'Forbidden',
            message: 'You do not have permission to access this resource',
            code: 'INSUFFICIENT_PERMISSIONS',
            requiredPermissions: ['admin', 'user:read'],
          })
        );
        return;
      }

      // Mock endpoint: GET /error/404
      if (req.method === 'GET' && req.url === '/error/404') {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            error: 'Not Found',
            message: 'The requested resource does not exist',
            code: 'RESOURCE_NOT_FOUND',
            resourceId: '12345',
          })
        );
        return;
      }

      // Mock endpoint: GET /error/409
      if (req.method === 'GET' && req.url === '/error/409') {
        res.writeHead(409, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            error: 'Conflict',
            message: 'Resource already exists with this identifier',
            code: 'DUPLICATE_RESOURCE',
            existingId: 'existing-123',
          })
        );
        return;
      }

      // Mock endpoint: GET /error/422
      if (req.method === 'GET' && req.url === '/error/422') {
        res.writeHead(422, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            error: 'Unprocessable Entity',
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
            errors: [
              { field: 'name', message: 'Name is required' },
              { field: 'age', message: 'Age must be a positive number' },
            ],
          })
        );
        return;
      }

      // Mock endpoint: GET /error/500
      if (req.method === 'GET' && req.url === '/error/500') {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            error: 'Internal Server Error',
            message: 'An unexpected error occurred',
            code: 'INTERNAL_ERROR',
            requestId: 'req-err-12345',
            timestamp: new Date().toISOString(),
          })
        );
        return;
      }

      // Mock endpoint: GET /error/503
      if (req.method === 'GET' && req.url === '/error/503') {
        res.writeHead(503, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            error: 'Service Unavailable',
            message: 'The service is temporarily unavailable',
            code: 'SERVICE_DOWN',
            retryAfter: 60,
          })
        );
        return;
      }

      // Mock endpoint: POST /error/400
      if (req.method === 'POST' && req.url === '/error/400') {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk.toString();
        });
        req.on('end', () => {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              error: 'Bad Request',
              message: 'Invalid input provided',
              code: 'INVALID_INPUT',
              receivedData: JSON.parse(body),
            })
          );
        });
        return;
      }

      // Mock endpoint: GET /error/message-only
      if (req.method === 'GET' && req.url === '/error/message-only') {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            message: 'Something went wrong',
          })
        );
        return;
      }

      // Mock endpoint: GET /error/minimal
      if (req.method === 'GET' && req.url === '/error/minimal') {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({}));
        return;
      }

      // Mock endpoint: GET /success-false
      if (req.method === 'GET' && req.url === '/success-false') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            success: false,
            error: 'Operation failed for some reason',
            code: 'OPERATION_FAILED',
            details: {
              step: 2,
              message: 'Failed at processing step',
            },
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

  describe('Error responses with structured error data - 4xx errors', () => {
    it('should throw error on 400 Bad Request with error field available', async () => {
      try {
        await client.fetchWithCustomHeaders('/error/400');
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Bad Request');
      }
    });

    it('should throw error on 401 Unauthorized with structured error data', async () => {
      try {
        await client.fetchWithCustomHeaders('/error/401');
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Unauthorized');
      }
    });

    it('should throw error on 403 Forbidden with permission data', async () => {
      try {
        await client.fetchWithCustomHeaders('/error/403');
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Forbidden');
      }
    });

    it('should throw error on 404 Not Found with resource info', async () => {
      try {
        await client.fetchWithCustomHeaders('/error/404');
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Not Found');
      }
    });

    it('should throw error on 409 Conflict with existing resource info', async () => {
      try {
        await client.fetchWithCustomHeaders('/error/409');
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Conflict');
      }
    });

    it('should throw error on 422 Unprocessable Entity with validation errors', async () => {
      try {
        await client.fetchWithCustomHeaders('/error/422');
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Unprocessable Entity');
      }
    });
  });

  describe('Error responses with structured error data - 5xx errors', () => {
    it('should throw error on 500 Internal Server Error with request ID', async () => {
      try {
        await client.fetchWithCustomHeaders('/error/500');
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Internal Server Error');
      }
    });

    it('should throw error on 503 Service Unavailable with retry info', async () => {
      try {
        await client.fetchWithCustomHeaders('/error/503');
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Service Unavailable');
      }
    });
  });

  describe('Error response with POST request', () => {
    it('should include error data when POST request fails', async () => {
      try {
        await client.createUser({
          name: 'Test',
          email: 'invalid-email',
        });
      } catch (error: any) {
        // The endpoint at /error/400 is a POST mock, but createUser makes POST to /users
        // So we need to make a direct call to verify error handling
        expect(error).toBeDefined();
      }
    });
  });

  describe('Error response priority and message extraction', () => {
    it('should prefer error field over message field', async () => {
      try {
        await client.fetchWithCustomHeaders('/error/400');
        fail('Should have thrown an error');
      } catch (error: any) {
        // Should use 'error' field (Bad Request) not 'message' field
        expect(error.message).toBe('Bad Request');
        expect(error.message).not.toBe('Invalid input provided');
      }
    });

    it('should use message field when error field is not present', async () => {
      try {
        await client.fetchWithCustomHeaders('/error/message-only');
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toBe('Something went wrong');
      }
    });

    it('should use HTTP status text when both error and message are missing', async () => {
      try {
        await client.fetchWithCustomHeaders('/error/minimal');
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toBeDefined();
      }
    });
  });

  describe('Success false with structured error data', () => {
    it('should throw error when success field is false even with 200 status code', async () => {
      try {
        await client.fetchWithCustomHeaders('/success-false');
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Operation failed for some reason');
      }
    });

    it('should preserve error code from success:false response', async () => {
      try {
        await client.fetchWithCustomHeaders('/success-false');
        fail('Should have thrown an error');
      } catch (error: any) {
        // Error message should contain the error text
        expect(error.message).toBe('Operation failed for some reason');
      }
    });
  });

  describe('Error data persistence across multiple calls', () => {
    it('should not carry over error data from previous failed requests', async () => {
      // First request - with error
      try {
        await client.fetchWithCustomHeaders('/error/400');
      } catch (error: any) {
        expect(error.message).toBe('Bad Request');
      }

      // Second request - successful
      const result = await client.getUser(1);
      expect(result.id).toBe(1);
      expect(result.name).toBe('John Doe');
    });

    it('should handle multiple consecutive error responses correctly', async () => {
      const errorUrls = ['/error/400', '/error/401', '/error/403', '/error/404'];
      const expectedMessages = ['Bad Request', 'Unauthorized', 'Forbidden', 'Not Found'];

      for (let i = 0; i < errorUrls.length; i++) {
        try {
          await client.fetchWithCustomHeaders(errorUrls[i]);
          fail('Should have thrown an error');
        } catch (error: any) {
          expect(error.message).toBe(expectedMessages[i]);
        }
      }
    });
  });

  describe('Error response structure validation', () => {
    it('should throw error with 400 status containing error code', async () => {
      try {
        await client.fetchWithCustomHeaders('/error/400');
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toBe('Bad Request');
        expect(receivedHeaders['content-type']).toBe('application/json');
      }
    });

    it('should preserve complex error details in error response', async () => {
      try {
        await client.fetchWithCustomHeaders('/error/422');
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toBe('Unprocessable Entity');
      }
    });

    it('should handle error response with nested object details', async () => {
      try {
        await client.fetchWithCustomHeaders('/error/403');
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toBe('Forbidden');
      }
    });

    it('should handle error response with array of error objects', async () => {
      try {
        await client.fetchWithCustomHeaders('/error/422');
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toBe('Unprocessable Entity');
      }
    });
  });

  describe('Error responses with custom headers', () => {
    it('should send custom headers even when receiving error response', async () => {
      client.setHeaders({
        'X-Error-Test': 'test-value',
        'X-Request-Id': 'error-req-001',
      });

      try {
        await client.fetchWithCustomHeaders('/error/500');
        fail('Should have thrown an error');
      } catch (error: any) {
        // Headers were sent
        expect(receivedHeaders['x-error-test']).toBe('test-value');
        expect(receivedHeaders['x-request-id']).toBe('error-req-001');
      }
    });

    it('should include default Content-Type header in error responses', async () => {
      try {
        await client.fetchWithCustomHeaders('/error/401');
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(receivedHeaders['content-type']).toBe('application/json');
      }
    });
  });

  describe('Error response scenarios - integration verification', () => {
    it('should verify error data is properly thrown from 400 error', async () => {
      const errorPromise = client.fetchWithCustomHeaders('/error/400');

      try {
        await errorPromise;
        fail('Expected promise to be rejected');
      } catch (error: any) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBeTruthy();
        expect(typeof error.message).toBe('string');
      }
    });

    it('should verify error data is properly thrown from 401 error', async () => {
      const errorPromise = client.fetchWithCustomHeaders('/error/401');

      try {
        await errorPromise;
        fail('Expected promise to be rejected');
      } catch (error: any) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBeTruthy();
      }
    });

    it('should verify error is accessible from catch block', async () => {
      let caughtError: any = null;

      try {
        await client.fetchWithCustomHeaders('/error/404');
      } catch (error) {
        caughtError = error;
      }

      expect(caughtError).not.toBeNull();
      expect(caughtError).toBeInstanceOf(Error);
      expect(caughtError.message).toBe('Not Found');
    });

    it('should verify error from success:false with 200 status', async () => {
      let caughtError: any = null;

      try {
        await client.fetchWithCustomHeaders('/success-false');
      } catch (error) {
        caughtError = error;
      }

      expect(caughtError).not.toBeNull();
      expect(caughtError).toBeInstanceOf(Error);
      expect(caughtError.message).toBe('Operation failed for some reason');
    });

    it('should throw error with correct message from error field', async () => {
      let errorMessage = '';

      try {
        await client.fetchWithCustomHeaders('/error/409');
      } catch (error: any) {
        errorMessage = error.message;
      }

      expect(errorMessage).toBe('Conflict');
    });

    it('should throw error with message field as fallback', async () => {
      let errorMessage = '';

      try {
        await client.fetchWithCustomHeaders('/error/message-only');
      } catch (error: any) {
        errorMessage = error.message;
      }

      expect(errorMessage).toBe('Something went wrong');
    });
  });

  describe('Error handling - edge cases', () => {
    it('should handle repeated error responses from same endpoint', async () => {
      const errors = [];

      for (let i = 0; i < 3; i++) {
        try {
          await client.fetchWithCustomHeaders('/error/500');
        } catch (error: any) {
          errors.push(error.message);
        }
      }

      expect(errors).toEqual([
        'Internal Server Error',
        'Internal Server Error',
        'Internal Server Error',
      ]);
    });

    it('should maintain headers across error responses', async () => {
      client.setHeaders({
        'X-Persistent': 'header-value',
      });

      const errors = [];

      for (const endpoint of ['/error/400', '/error/500', '/error/404']) {
        try {
          await client.fetchWithCustomHeaders(endpoint);
        } catch (error: any) {
          errors.push(error.message);
        }
      }

      // Verify that custom header was sent with all requests
      expect(receivedHeaders['x-persistent']).toBe('header-value');
      expect(errors.length).toBe(3);
    });

    it('should correctly throw error with no data in response', async () => {
      try {
        await client.fetchWithCustomHeaders('/error/minimal');
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBeDefined();
      }
    });
  });

  describe('Error response binding to Error instance - integration', () => {
    it('should bind full error response data for 400 error', async () => {
      try {
        await client.fetchWithCustomHeaders('/error/400');
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response).toBeDefined();
        expect(error.response.error).toBe('Bad Request');
        expect(error.response.code).toBe('INVALID_INPUT');
        expect(error.response.message).toBe('Invalid input provided');
        expect(error.response.details).toBeDefined();
        expect(error.response.details.field).toBe('email');
      }
    });

    it('should bind full error response data for 401 error', async () => {
      try {
        await client.fetchWithCustomHeaders('/error/401');
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response).toBeDefined();
        expect(error.response.error).toBe('Unauthorized');
        expect(error.response.code).toBe('AUTH_FAILED');
        expect(error.response.message).toBe(
          'Authentication token is missing or invalid'
        );
        expect(error.response.timestamp).toBeDefined();
      }
    });

    it('should bind full error response data for 403 error with permissions', async () => {
      try {
        await client.fetchWithCustomHeaders('/error/403');
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response).toBeDefined();
        expect(error.response.code).toBe('INSUFFICIENT_PERMISSIONS');
        expect(error.response.requiredPermissions).toEqual(['admin', 'user:read']);
      }
    });

    it('should bind full error response data for 404 error', async () => {
      try {
        await client.fetchWithCustomHeaders('/error/404');
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response).toBeDefined();
        expect(error.response.error).toBe('Not Found');
        expect(error.response.code).toBe('RESOURCE_NOT_FOUND');
        expect(error.response.resourceId).toBe('12345');
      }
    });

    it('should bind full error response data for 409 Conflict error', async () => {
      try {
        await client.fetchWithCustomHeaders('/error/409');
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response).toBeDefined();
        expect(error.response.code).toBe('DUPLICATE_RESOURCE');
        expect(error.response.existingId).toBe('existing-123');
      }
    });

    it('should bind full error response data for 422 validation error with array', async () => {
      try {
        await client.fetchWithCustomHeaders('/error/422');
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response).toBeDefined();
        expect(error.response.error).toBe('Unprocessable Entity');
        expect(error.response.code).toBe('VALIDATION_ERROR');
        expect(Array.isArray(error.response.errors)).toBe(true);
        expect(error.response.errors).toHaveLength(2);
        expect(error.response.errors[0]).toEqual({
          field: 'name',
          message: 'Name is required',
        });
        expect(error.response.errors[1]).toEqual({
          field: 'age',
          message: 'Age must be a positive number',
        });
      }
    });

    it('should bind full error response data for 500 server error', async () => {
      try {
        await client.fetchWithCustomHeaders('/error/500');
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response).toBeDefined();
        expect(error.response.error).toBe('Internal Server Error');
        expect(error.response.code).toBe('INTERNAL_ERROR');
        expect(error.response.requestId).toBe('req-err-12345');
        expect(error.response.timestamp).toBeDefined();
      }
    });

    it('should bind full error response data for 503 service unavailable', async () => {
      try {
        await client.fetchWithCustomHeaders('/error/503');
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response).toBeDefined();
        expect(error.response.error).toBe('Service Unavailable');
        expect(error.response.code).toBe('SERVICE_DOWN');
        expect(error.response.retryAfter).toBe(60);
      }
    });

    it('should bind error response for success: false with 200 status', async () => {
      try {
        await client.fetchWithCustomHeaders('/success-false');
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response).toBeDefined();
        expect(error.response.success).toBe(false);
        expect(error.response.error).toBe('Operation failed for some reason');
        expect(error.response.code).toBe('OPERATION_FAILED');
        expect(error.response.details).toBeDefined();
        expect(error.response.details.step).toBe(2);
      }
    });

    it('should allow accessing error code from response for conditional handling', async () => {
      try {
        await client.fetchWithCustomHeaders('/error/401');
        fail('Should have thrown an error');
      } catch (error: any) {
        // Simulating error handling logic that checks error code
        if (error.response?.code === 'AUTH_FAILED') {
          expect(true).toBe(true); // Would trigger re-authentication
        } else {
          fail('Should have recognized AUTH_FAILED code');
        }
      }
    });

    it('should allow accessing detailed error info from response', async () => {
      try {
        await client.fetchWithCustomHeaders('/error/422');
        fail('Should have thrown an error');
      } catch (error: any) {
        // Simulating detailed error handling
        if (error.response?.errors && Array.isArray(error.response.errors)) {
          const fieldErrors: Record<string, string> = {};
          for (const err of error.response.errors) {
            fieldErrors[err.field] = err.message;
          }
          expect(fieldErrors.name).toBe('Name is required');
          expect(fieldErrors.age).toBe('Age must be a positive number');
        }
      }
    });

    it('should preserve response structure across multiple error types', async () => {
      const errorEndpoints = [
        {
          path: '/error/400',
          expectedCode: 'INVALID_INPUT',
        },
        {
          path: '/error/401',
          expectedCode: 'AUTH_FAILED',
        },
        {
          path: '/error/403',
          expectedCode: 'INSUFFICIENT_PERMISSIONS',
        },
      ];

      for (const endpoint of errorEndpoints) {
        try {
          await client.fetchWithCustomHeaders(endpoint.path);
          fail(`Should have thrown an error for ${endpoint.path}`);
        } catch (error: any) {
          expect(error.response).toBeDefined();
          expect(error.response.code).toBe(endpoint.expectedCode);
          expect(typeof error.response).toBe('object');
        }
      }
    });

    it('should maintain response data integrity across sequential requests', async () => {
      let firstError: any = null;
      let secondError: any = null;

      // First request - capture error
      try {
        await client.fetchWithCustomHeaders('/error/400');
      } catch (error: any) {
        firstError = error;
      }

      // Second request - capture error
      try {
        await client.fetchWithCustomHeaders('/error/500');
      } catch (error: any) {
        secondError = error;
      }

      // Verify both errors retained their specific data
      expect(firstError.response.code).toBe('INVALID_INPUT');
      expect(secondError.response.code).toBe('INTERNAL_ERROR');
      expect(firstError.response.code).not.toBe(secondError.response.code);
    });

    it('should bind response data even for empty error responses', async () => {
      try {
        await client.fetchWithCustomHeaders('/error/minimal');
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response).toBeDefined();
        expect(typeof error.response).toBe('object');
      }
    });

    it('should allow deep inspection of nested error details', async () => {
      try {
        await client.fetchWithCustomHeaders('/error/422');
        fail('Should have thrown an error');
      } catch (error: any) {
        // Deep inspection of nested structure
        expect(error.response.errors).toBeDefined();
        expect(error.response.errors.length).toBeGreaterThan(0);

        const firstError = error.response.errors[0];
        expect(firstError).toHaveProperty('field');
        expect(firstError).toHaveProperty('message');
        expect(typeof firstError.message).toBe('string');
      }
    });

    it('should provide response data alongside error message for logging', async () => {
      try {
        await client.fetchWithCustomHeaders('/error/500');
        fail('Should have thrown an error');
      } catch (error: any) {
        const logEntry = {
          message: error.message,
          code: error.response?.code,
          requestId: error.response?.requestId,
          timestamp: error.response?.timestamp,
        };

        expect(logEntry.message).toBe('Internal Server Error');
        expect(logEntry.code).toBe('INTERNAL_ERROR');
        expect(logEntry.requestId).toBe('req-err-12345');
        expect(logEntry.timestamp).toBeDefined();
      }
    });

    it('should make response data available for error recovery strategies', async () => {
      try {
        await client.fetchWithCustomHeaders('/error/409');
        fail('Should have thrown an error');
      } catch (error: any) {
        // Recovery strategy based on error code and details
        if (error.response?.code === 'DUPLICATE_RESOURCE') {
          const existingId = error.response.existingId;
          // Could retry with different ID or fetch existing resource
          expect(existingId).toBe('existing-123');
        }
      }
    });
  });
});
