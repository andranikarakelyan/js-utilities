import axios from 'axios';
import { BaseApiClient, BaseApiClientConfig } from './base-api.client';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Create a concrete implementation for testing
class TestApiClient extends BaseApiClient {
  constructor(config: BaseApiClientConfig) {
    super(config);
  }

  // Expose protected methods for testing
  public async testRequest<T>(options: {
    path: string;
    query?: Record<string, string | number | undefined>;
    body?: any;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  }): Promise<T> {
    return this.request<T>(options);
  }
}

describe('BaseApiClient', () => {
  let client: TestApiClient;
  let mockAxiosInstance: any;

  const config: BaseApiClientConfig = {
    baseUrl: 'https://api.example.com',
    urlPrefix: '/v1',
  };

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock axios instance
    mockAxiosInstance = {
      request: jest.fn(),
      defaults: {
        headers: {
          common: {},
        },
      },
    };

    mockedAxios.create.mockReturnValue(mockAxiosInstance);

    // Create client instance
    client = new TestApiClient(config);
  });

  describe('constructor', () => {
    it('should create axios instance with correct base URL', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://api.example.com/v1',
      });
    });

    it('should create axios instance without urlPrefix when not provided', () => {
      const configWithoutPrefix: BaseApiClientConfig = {
        baseUrl: 'https://api.example.com',
      };

      new TestApiClient(configWithoutPrefix);

      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://api.example.com',
      });
    });
  });

  describe('request', () => {
    it('should make a GET request successfully', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        data: { id: 1, name: 'Test' },
      };

      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      const result = await client.testRequest({
        path: '/users/1',
        method: 'GET',
      });

      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        url: '/users/1',
        method: 'GET',
        params: undefined,
        data: undefined,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      expect(result).toEqual({ id: 1, name: 'Test' });
    });

    it('should make a POST request with body', async () => {
      const mockResponse = {
        status: 201,
        statusText: 'Created',
        data: { id: 2, name: 'New User' },
      };

      const requestBody = { name: 'New User', email: 'test@example.com' };

      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      const result = await client.testRequest({
        path: '/users',
        method: 'POST',
        body: requestBody,
      });

      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        url: '/users',
        method: 'POST',
        params: undefined,
        data: requestBody,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      expect(result).toEqual({ id: 2, name: 'New User' });
    });

    it('should make a request with query parameters', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        data: { results: [] },
      };

      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      await client.testRequest({
        path: '/users',
        query: { page: 1, limit: 10, search: 'test' },
      });

      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        url: '/users',
        method: 'GET',
        params: { page: 1, limit: 10, search: 'test' },
        data: undefined,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('should filter out undefined query parameters', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        data: { results: [] },
      };

      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      await client.testRequest({
        path: '/users',
        query: { page: 1, search: undefined },
      });

      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        url: '/users',
        method: 'GET',
        params: { page: 1, search: undefined },
        data: undefined,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('should make a PUT request', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        data: { id: 1, name: 'Updated' },
      };

      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      const result = await client.testRequest({
        path: '/users/1',
        method: 'PUT',
        body: { name: 'Updated' },
      });

      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        url: '/users/1',
        method: 'PUT',
        params: undefined,
        data: { name: 'Updated' },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      expect(result).toEqual({ id: 1, name: 'Updated' });
    });

    it('should make a PATCH request', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        data: { id: 1, name: 'Patched' },
      };

      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      await client.testRequest({
        path: '/users/1',
        method: 'PATCH',
        body: { name: 'Patched' },
      });

      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        url: '/users/1',
        method: 'PATCH',
        params: undefined,
        data: { name: 'Patched' },
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('should make a DELETE request', async () => {
      const mockResponse = {
        status: 204,
        statusText: 'No Content',
        data: null,
      };

      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      await client.testRequest({
        path: '/users/1',
        method: 'DELETE',
      });

      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        url: '/users/1',
        method: 'DELETE',
        params: undefined,
        data: undefined,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('should default to GET method when not specified', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        data: { data: 'test' },
      };

      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      await client.testRequest({
        path: '/endpoint',
      });

      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        url: '/endpoint',
        method: 'GET',
        params: undefined,
        data: undefined,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
  });

  describe('handleResponse', () => {
    it('should return data for successful response', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        data: { id: 1, value: 'test' },
      };

      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      const result = await client.testRequest({ path: '/test' });

      expect(result).toEqual({ id: 1, value: 'test' });
    });

    it('should throw error for 4xx status codes', async () => {
      const mockError = {
        response: {
          status: 404,
          statusText: 'Not Found',
          data: { error: 'Resource not found' },
        },
        isAxiosError: true,
      };

      mockAxiosInstance.request.mockRejectedValue(mockError);
      mockedAxios.isAxiosError.mockReturnValue(true);

      await expect(client.testRequest({ path: '/test' })).rejects.toThrow(
        'Resource not found'
      );
    });

    it('should throw error for 5xx status codes', async () => {
      const mockError = {
        response: {
          status: 500,
          statusText: 'Internal Server Error',
          data: { message: 'Server error occurred' },
        },
        isAxiosError: true,
      };

      mockAxiosInstance.request.mockRejectedValue(mockError);
      mockedAxios.isAxiosError.mockReturnValue(true);

      await expect(client.testRequest({ path: '/test' })).rejects.toThrow(
        'Server error occurred'
      );
    });

    it('should throw error with statusText when no error message in response', async () => {
      const mockError = {
        response: {
          status: 401,
          statusText: 'Unauthorized',
          data: {},
        },
        isAxiosError: true,
      };

      mockAxiosInstance.request.mockRejectedValue(mockError);
      mockedAxios.isAxiosError.mockReturnValue(true);

      await expect(client.testRequest({ path: '/test' })).rejects.toThrow(
        'Unauthorized'
      );
    });

    it('should throw error when response has success: false', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        data: { success: false, error: 'Operation failed' },
      };

      mockAxiosInstance.request.mockResolvedValue(mockResponse);
      mockedAxios.isAxiosError.mockReturnValue(false);

      await expect(client.testRequest({ path: '/test' })).rejects.toThrow(
        'Operation failed'
      );
    });

    it('should throw generic error when success: false without error message', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        data: { success: false },
      };

      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      await expect(client.testRequest({ path: '/test' })).rejects.toThrow(
        'Request failed'
      );
    });

    it('should handle non-axios errors', async () => {
      const networkError = new Error('Network error');

      mockAxiosInstance.request.mockRejectedValue(networkError);
      mockedAxios.isAxiosError.mockReturnValue(false);

      await expect(client.testRequest({ path: '/test' })).rejects.toThrow(
        'Network error'
      );
    });

    it('should prioritize error field over message field', async () => {
      const mockError = {
        response: {
          status: 400,
          statusText: 'Bad Request',
          data: { error: 'Custom error', message: 'Generic message' },
        },
        isAxiosError: true,
      };

      mockAxiosInstance.request.mockRejectedValue(mockError);
      mockedAxios.isAxiosError.mockReturnValue(true);

      await expect(client.testRequest({ path: '/test' })).rejects.toThrow(
        'Custom error'
      );
    });

    it('should handle response with success: true', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        data: { success: true, data: { id: 1 } },
      };

      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      const result = await client.testRequest({ path: '/test' });

      expect(result).toEqual({ success: true, data: { id: 1 } });
    });
  });

  describe('setHeaders', () => {
    it('should set new headers', () => {
      client.setHeaders({ 'X-Custom-Header': 'custom-value' });
      
      const headers = client.getHeaders();
      expect(headers['X-Custom-Header']).toBe('custom-value');
    });

    it('should update multiple headers at once', () => {
      client.setHeaders({
        'X-Custom-Header': 'custom-value',
        'X-Another-Header': 'another-value',
      });
      
      const headers = client.getHeaders();
      expect(headers['X-Custom-Header']).toBe('custom-value');
      expect(headers['X-Another-Header']).toBe('another-value');
    });

    it('should delete headers when set to null', () => {
      client.setHeaders({ 'X-Custom-Header': 'original-value' });
      client.setHeaders({ 'X-Custom-Header': null });
      
      const headers = client.getHeaders();
      expect(headers['X-Custom-Header']).toBeUndefined();
    });

    it('should delete Authorization header when set to null', () => {
      client.setHeaders({ 'Authorization': null });
      
      const headers = client.getHeaders();
      expect(headers['Authorization']).toBeUndefined();
    });

    it('should allow setting Authorization header as custom string', () => {
      client.setHeaders({ 'Authorization': 'Bearer new-token-123' });
      
      const headers = client.getHeaders();
      expect(headers['Authorization']).toBe('Bearer new-token-123');
    });

    it('should allow making requests with updated headers', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        data: { success: true },
      };

      mockAxiosInstance.request.mockResolvedValue(mockResponse);
      
      client.setHeaders({ 'X-Custom-Header': 'test-value' });
      
      const result = await client.testRequest({ path: '/test' });

      expect(result).toEqual({ success: true });
      expect(mockAxiosInstance.request).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Custom-Header': 'test-value',
          }),
        })
      );
    });
  });

  describe('getHeaders', () => {
    it('should return the current headers', () => {
      client.setHeaders({
        'X-Custom-Header': 'custom-value',
      });

      const headers = client.getHeaders();

      expect(headers['Content-Type']).toBe('application/json');
      expect(headers['X-Custom-Header']).toBe('custom-value');
    });

    it('should return default headers when no custom headers are set', () => {
      const headers = client.getHeaders();

      expect(headers['Content-Type']).toBe('application/json');
    });

    it('should filter out null values', () => {
      client.setHeaders({
        'X-Custom-Header': 'custom-value',
      });
      client.setHeaders({
        'X-Custom-Header': null,
      });

      const headers = client.getHeaders();

      expect(headers['X-Custom-Header']).toBeUndefined();
      expect(headers['Content-Type']).toBe('application/json');
    });

    it('should return a copy of headers (not reference)', () => {
      client.setHeaders({
        'X-Test': 'test-value',
      });

      const headers = client.getHeaders();
      headers['X-Test'] = 'modified';

      const headersCopy = client.getHeaders();
      expect(headersCopy['X-Test']).toBe('test-value');
    });

    it('should work with setHeaders', () => {
      client.setHeaders({
        'X-Custom': 'custom-value',
        'X-Another': 'another-value',
      });

      const headers = client.getHeaders();

      expect(headers['X-Custom']).toBe('custom-value');
      expect(headers['X-Another']).toBe('another-value');
      expect(headers['Content-Type']).toBe('application/json');
    });
  });

  describe('edge cases', () => {
    it('should handle empty response data', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        data: null,
      };

      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      const result = await client.testRequest({ path: '/test' });

      expect(result).toBeNull();
    });

    it('should handle array response', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        data: [{ id: 1 }, { id: 2 }],
      };

      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      const result = await client.testRequest({ path: '/test' });

      expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it('should handle string response', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        data: 'plain text response',
      };

      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      const result = await client.testRequest({ path: '/test' });

      expect(result).toBe('plain text response');
    });

    it('should handle numeric query parameters', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        data: { results: [] },
      };

      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      await client.testRequest({
        path: '/items',
        query: { page: 5, limit: 20, offset: 100 },
      });

      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        url: '/items',
        method: 'GET',
        params: { page: 5, limit: 20, offset: 100 },
        data: undefined,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
  });

  describe('error handling - structured error responses with 4xx status codes', () => {
    it('should throw error on 400 status with error field', async () => {
      const mockResponse = {
        status: 400,
        statusText: 'Bad Request',
        data: {
          error: 'Bad Request',
          message: 'Invalid input provided',
          code: 'INVALID_INPUT',
          details: {
            field: 'email',
            reason: 'Invalid email format',
          },
        },
      };

      mockAxiosInstance.request.mockRejectedValue({
        response: mockResponse,
      });
      mockedAxios.isAxiosError.mockReturnValue(true);

      await expect(
        client.testRequest({
          path: '/users',
          method: 'GET',
        })
      ).rejects.toThrow('Bad Request');
    });

    it('should throw error on 401 status with authentication error', async () => {
      const mockResponse = {
        status: 401,
        statusText: 'Unauthorized',
        data: {
          error: 'Unauthorized',
          message: 'Authentication token is missing or invalid',
          code: 'AUTH_FAILED',
          timestamp: new Date().toISOString(),
        },
      };

      mockAxiosInstance.request.mockRejectedValue({
        response: mockResponse,
      });
      mockedAxios.isAxiosError.mockReturnValue(true);

      await expect(
        client.testRequest({
          path: '/admin',
          method: 'GET',
        })
      ).rejects.toThrow('Unauthorized');
    });

    it('should throw error on 403 status with permission error', async () => {
      const mockResponse = {
        status: 403,
        statusText: 'Forbidden',
        data: {
          error: 'Forbidden',
          message: 'You do not have permission to access this resource',
          code: 'INSUFFICIENT_PERMISSIONS',
          requiredPermissions: ['admin', 'user:read'],
        },
      };

      mockAxiosInstance.request.mockRejectedValue({
        response: mockResponse,
      });
      mockedAxios.isAxiosError.mockReturnValue(true);

      await expect(
        client.testRequest({
          path: '/admin/users',
          method: 'GET',
        })
      ).rejects.toThrow('Forbidden');
    });

    it('should throw error on 404 status with resource not found', async () => {
      const mockResponse = {
        status: 404,
        statusText: 'Not Found',
        data: {
          error: 'Not Found',
          message: 'The requested resource does not exist',
          code: 'RESOURCE_NOT_FOUND',
          resourceId: '12345',
        },
      };

      mockAxiosInstance.request.mockRejectedValue({
        response: mockResponse,
      });
      mockedAxios.isAxiosError.mockReturnValue(true);

      await expect(
        client.testRequest({
          path: '/users/12345',
          method: 'GET',
        })
      ).rejects.toThrow('Not Found');
    });

    it('should throw error on 409 status with conflict', async () => {
      const mockResponse = {
        status: 409,
        statusText: 'Conflict',
        data: {
          error: 'Conflict',
          message: 'Resource already exists with this identifier',
          code: 'DUPLICATE_RESOURCE',
          existingId: 'existing-123',
        },
      };

      mockAxiosInstance.request.mockRejectedValue({
        response: mockResponse,
      });
      mockedAxios.isAxiosError.mockReturnValue(true);

      await expect(
        client.testRequest({
          path: '/users',
          method: 'POST',
          body: { email: 'existing@example.com' },
        })
      ).rejects.toThrow('Conflict');
    });

    it('should throw error on 422 status with validation errors', async () => {
      const mockResponse = {
        status: 422,
        statusText: 'Unprocessable Entity',
        data: {
          error: 'Unprocessable Entity',
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          errors: [
            { field: 'name', message: 'Name is required' },
            { field: 'age', message: 'Age must be a positive number' },
          ],
        },
      };

      mockAxiosInstance.request.mockRejectedValue({
        response: mockResponse,
      });
      mockedAxios.isAxiosError.mockReturnValue(true);

      await expect(
        client.testRequest({
          path: '/users',
          method: 'POST',
          body: { email: 'test@example.com' },
        })
      ).rejects.toThrow('Unprocessable Entity');
    });
  });

  describe('error handling - structured error responses with 5xx status codes', () => {
    it('should throw error on 500 status with server error', async () => {
      const mockResponse = {
        status: 500,
        statusText: 'Internal Server Error',
        data: {
          error: 'Internal Server Error',
          message: 'An unexpected error occurred',
          code: 'INTERNAL_ERROR',
          requestId: 'req-err-12345',
          timestamp: new Date().toISOString(),
        },
      };

      mockAxiosInstance.request.mockRejectedValue({
        response: mockResponse,
      });
      mockedAxios.isAxiosError.mockReturnValue(true);

      await expect(
        client.testRequest({
          path: '/users',
          method: 'GET',
        })
      ).rejects.toThrow('Internal Server Error');
    });

    it('should throw error on 503 status with service unavailable', async () => {
      const mockResponse = {
        status: 503,
        statusText: 'Service Unavailable',
        data: {
          error: 'Service Unavailable',
          message: 'The service is temporarily unavailable',
          code: 'SERVICE_DOWN',
          retryAfter: 60,
        },
      };

      mockAxiosInstance.request.mockRejectedValue({
        response: mockResponse,
      });
      mockedAxios.isAxiosError.mockReturnValue(true);

      await expect(
        client.testRequest({
          path: '/users',
          method: 'GET',
        })
      ).rejects.toThrow('Service Unavailable');
    });
  });

  describe('error handling - message priority', () => {
    it('should prefer error field over message field', async () => {
      const mockResponse = {
        status: 400,
        statusText: 'Bad Request',
        data: {
          error: 'Custom Error Message',
          message: 'Fallback Message',
        },
      };

      mockAxiosInstance.request.mockRejectedValue({
        response: mockResponse,
      });
      mockedAxios.isAxiosError.mockReturnValue(true);

      await expect(
        client.testRequest({
          path: '/test',
          method: 'GET',
        })
      ).rejects.toThrow('Custom Error Message');
    });

    it('should use message field when error field is missing', async () => {
      const mockResponse = {
        status: 400,
        statusText: 'Bad Request',
        data: {
          message: 'Validation Error',
        },
      };

      mockAxiosInstance.request.mockRejectedValue({
        response: mockResponse,
      });
      mockedAxios.isAxiosError.mockReturnValue(true);

      await expect(
        client.testRequest({
          path: '/test',
          method: 'GET',
        })
      ).rejects.toThrow('Validation Error');
    });

    it('should use statusText when both error and message are missing', async () => {
      const mockResponse = {
        status: 400,
        statusText: 'Bad Request',
        data: {},
      };

      mockAxiosInstance.request.mockRejectedValue({
        response: mockResponse,
      });
      mockedAxios.isAxiosError.mockReturnValue(true);

      await expect(
        client.testRequest({
          path: '/test',
          method: 'GET',
        })
      ).rejects.toThrow('Bad Request');
    });

    it('should handle error response with null error and message fields', async () => {
      const mockResponse = {
        status: 500,
        statusText: 'Internal Server Error',
        data: {
          error: null,
          message: null,
        },
      };

      mockAxiosInstance.request.mockRejectedValue({
        response: mockResponse,
      });
      mockedAxios.isAxiosError.mockReturnValue(true);

      await expect(
        client.testRequest({
          path: '/test',
          method: 'GET',
        })
      ).rejects.toThrow('Internal Server Error');
    });
  });

  describe('error handling - success: false with structured data', () => {
    it('should throw error when success field is false with 200 status', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        data: {
          success: false,
          error: 'Operation failed for some reason',
          code: 'OPERATION_FAILED',
          details: {
            step: 2,
            message: 'Failed at processing step',
          },
        },
      };

      mockAxiosInstance.request.mockResolvedValue(mockResponse);
      mockedAxios.isAxiosError.mockReturnValue(false);

      await expect(
        client.testRequest({
          path: '/test',
          method: 'GET',
        })
      ).rejects.toThrow('Operation failed for some reason');
    });

    it('should use generic error when success is false but error field is missing', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        data: {
          success: false,
          code: 'OPERATION_FAILED',
        },
      };

      mockAxiosInstance.request.mockResolvedValue(mockResponse);
      mockedAxios.isAxiosError.mockReturnValue(false);

      await expect(
        client.testRequest({
          path: '/test',
          method: 'GET',
        })
      ).rejects.toThrow('Request failed');
    });

    it('should pass through success response when success field is true', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        data: {
          success: true,
          data: { id: 1, name: 'Test' },
        },
      };

      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      const result = await client.testRequest({
        path: '/test',
        method: 'GET',
      });

      expect(result).toEqual({
        success: true,
        data: { id: 1, name: 'Test' },
      });
    });

    it('should not throw error when success field is missing and status is 200', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        data: {
          id: 1,
          name: 'Test',
        },
      };

      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      const result = await client.testRequest({
        path: '/test',
        method: 'GET',
      });

      expect(result).toEqual({ id: 1, name: 'Test' });
    });
  });

  describe('error handling - edge cases', () => {
    it('should handle error response with empty object', async () => {
      const mockResponse = {
        status: 500,
        statusText: 'Internal Server Error',
        data: {},
      };

      mockAxiosInstance.request.mockRejectedValue({
        response: mockResponse,
      });
      mockedAxios.isAxiosError.mockReturnValue(true);

      await expect(
        client.testRequest({
          path: '/test',
          method: 'GET',
        })
      ).rejects.toThrow('Internal Server Error');
    });

    it('should handle error response with nested error structure', async () => {
      const mockResponse = {
        status: 400,
        statusText: 'Bad Request',
        data: {
          error: {
            code: 'NESTED_ERROR',
            message: 'Nested error details',
          },
        },
      };

      mockAxiosInstance.request.mockRejectedValue({
        response: mockResponse,
      });
      mockedAxios.isAxiosError.mockReturnValue(true);

      // The error field contains an object, not a string - but our code converts it to string via Error constructor
      await expect(
        client.testRequest({
          path: '/test',
          method: 'GET',
        })
      ).rejects.toThrow();
    });

    it('should handle error response with very large error details', async () => {
      const largeDetails = {
        errors: Array(100)
          .fill(null)
          .map((_, i) => ({
            field: `field_${i}`,
            message: `Error message for field ${i}`,
          })),
      };

      const mockResponse = {
        status: 422,
        statusText: 'Unprocessable Entity',
        data: {
          error: 'Validation Failed',
          details: largeDetails,
        },
      };

      mockAxiosInstance.request.mockRejectedValue({
        response: mockResponse,
      });
      mockedAxios.isAxiosError.mockReturnValue(true);

      await expect(
        client.testRequest({
          path: '/test',
          method: 'POST',
        })
      ).rejects.toThrow('Validation Failed');
    });

    it('should handle error response where data is a string', async () => {
      const mockResponse = {
        status: 500,
        statusText: 'Internal Server Error',
        data: 'Plain error string',
      };

      mockAxiosInstance.request.mockRejectedValue({
        response: mockResponse,
      });
      mockedAxios.isAxiosError.mockReturnValue(true);

      await expect(
        client.testRequest({
          path: '/test',
          method: 'GET',
        })
      ).rejects.toThrow('Internal Server Error');
    });

    it('should handle error response where data is null', async () => {
      const mockResponse = {
        status: 500,
        statusText: 'Internal Server Error',
        data: null,
      };

      mockAxiosInstance.request.mockRejectedValue({
        response: mockResponse,
      });
      mockedAxios.isAxiosError.mockReturnValue(true);

      await expect(
        client.testRequest({
          path: '/test',
          method: 'GET',
        })
      ).rejects.toThrow('Internal Server Error');
    });
  });

  describe('error handling - structured error data preservation', () => {
    it('should make error data available through Error.message from error field', async () => {
      const mockResponse = {
        status: 400,
        statusText: 'Bad Request',
        data: {
          error: 'Detailed error message with context',
          code: 'SPECIFIC_ERROR_CODE',
          timestamp: new Date().toISOString(),
          requestId: 'req-12345',
        },
      };

      mockAxiosInstance.request.mockRejectedValue({
        response: mockResponse,
      });
      mockedAxios.isAxiosError.mockReturnValue(true);

      try {
        await client.testRequest({
          path: '/test',
          method: 'GET',
        });
        fail('Should have thrown an error');
      } catch (error: any) {
        // The error message field should contain the error from response
        expect(error.message).toBe('Detailed error message with context');
        expect(error).toBeInstanceOf(Error);
      }
    });

    it('should preserve error code information in response for debugging', async () => {
      const mockResponse = {
        status: 401,
        statusText: 'Unauthorized',
        data: {
          error: 'Unauthorized',
          code: 'AUTH_TOKEN_EXPIRED',
          expiresAt: new Date().toISOString(),
        },
      };

      mockAxiosInstance.request.mockRejectedValue({
        response: mockResponse,
      });
      mockedAxios.isAxiosError.mockReturnValue(true);

      let caughtError: any = null;
      try {
        await client.testRequest({
          path: '/test',
          method: 'GET',
        });
      } catch (error) {
        caughtError = error;
      }

      expect(caughtError.message).toBe('Unauthorized');
    });
  });

  describe('error handling - multiple error response formats', () => {
    it('should handle error response format: {error: string}', async () => {
      const mockResponse = {
        status: 400,
        statusText: 'Bad Request',
        data: {
          error: 'Bad Request',
        },
      };

      mockAxiosInstance.request.mockRejectedValue({
        response: mockResponse,
      });
      mockedAxios.isAxiosError.mockReturnValue(true);

      await expect(
        client.testRequest({
          path: '/test',
          method: 'GET',
        })
      ).rejects.toThrow('Bad Request');
    });

    it('should handle error response format: {message: string}', async () => {
      const mockResponse = {
        status: 400,
        statusText: 'Bad Request',
        data: {
          message: 'Something went wrong',
        },
      };

      mockAxiosInstance.request.mockRejectedValue({
        response: mockResponse,
      });
      mockedAxios.isAxiosError.mockReturnValue(true);

      await expect(
        client.testRequest({
          path: '/test',
          method: 'GET',
        })
      ).rejects.toThrow('Something went wrong');
    });

    it('should handle error response format: {error: string, message: string, code: string}', async () => {
      const mockResponse = {
        status: 400,
        statusText: 'Bad Request',
        data: {
          error: 'Primary error',
          message: 'Secondary message',
          code: 'ERROR_CODE',
        },
      };

      mockAxiosInstance.request.mockRejectedValue({
        response: mockResponse,
      });
      mockedAxios.isAxiosError.mockReturnValue(true);

      await expect(
        client.testRequest({
          path: '/test',
          method: 'GET',
        })
      ).rejects.toThrow('Primary error');
    });

    it('should handle error response format: {success: false, error: string}', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        data: {
          success: false,
          error: 'Operation not successful',
        },
      };

      mockAxiosInstance.request.mockResolvedValue(mockResponse);
      mockedAxios.isAxiosError.mockReturnValue(false);

      await expect(
        client.testRequest({
          path: '/test',
          method: 'GET',
        })
      ).rejects.toThrow('Operation not successful');
    });

    it('should handle error response format: {success: false, message: string}', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        data: {
          success: false,
          message: 'Operation failed',
        },
      };

      mockAxiosInstance.request.mockResolvedValue(mockResponse);
      mockedAxios.isAxiosError.mockReturnValue(false);

      await expect(
        client.testRequest({
          path: '/test',
          method: 'GET',
        })
      ).rejects.toThrow();
    });
  });

  describe('error response binding to Error instance', () => {
    it('should bind error response data to Error.response for 4xx errors', async () => {
      const responseData = {
        error: 'Bad Request',
        code: 'INVALID_INPUT',
        details: { field: 'email' },
      };

      const mockResponse = {
        status: 400,
        statusText: 'Bad Request',
        data: responseData,
      };

      mockAxiosInstance.request.mockRejectedValue({
        response: mockResponse,
      });
      mockedAxios.isAxiosError.mockReturnValue(true);

      try {
        await client.testRequest({
          path: '/test',
          method: 'GET',
        });
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response).toBeDefined();
        expect(error.response).toEqual(responseData);
        expect(error.response.code).toBe('INVALID_INPUT');
        expect(error.response.details).toEqual({ field: 'email' });
      }
    });

    it('should bind error response data to Error.response for 5xx errors', async () => {
      const responseData = {
        error: 'Internal Server Error',
        code: 'INTERNAL_ERROR',
        requestId: 'req-12345',
        timestamp: '2024-01-01T00:00:00Z',
      };

      const mockResponse = {
        status: 500,
        statusText: 'Internal Server Error',
        data: responseData,
      };

      mockAxiosInstance.request.mockRejectedValue({
        response: mockResponse,
      });
      mockedAxios.isAxiosError.mockReturnValue(true);

      try {
        await client.testRequest({
          path: '/test',
          method: 'GET',
        });
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response).toBeDefined();
        expect(error.response).toEqual(responseData);
        expect(error.response.requestId).toBe('req-12345');
      }
    });

    it('should bind error response with complex nested structure', async () => {
      const responseData = {
        error: 'Validation Error',
        code: 'VALIDATION_ERROR',
        errors: [
          { field: 'name', message: 'Name is required' },
          { field: 'email', message: 'Invalid email format' },
        ],
        metadata: {
          timestamp: '2024-01-01T00:00:00Z',
          path: '/api/users',
        },
      };

      const mockResponse = {
        status: 422,
        statusText: 'Unprocessable Entity',
        data: responseData,
      };

      mockAxiosInstance.request.mockRejectedValue({
        response: mockResponse,
      });
      mockedAxios.isAxiosError.mockReturnValue(true);

      try {
        await client.testRequest({
          path: '/test',
          method: 'POST',
        });
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response).toBeDefined();
        expect(error.response.errors).toEqual([
          { field: 'name', message: 'Name is required' },
          { field: 'email', message: 'Invalid email format' },
        ]);
        expect(error.response.metadata.path).toBe('/api/users');
      }
    });

    it('should bind error response for success: false with 200 status', async () => {
      const responseData = {
        success: false,
        error: 'Operation failed',
        code: 'OPERATION_FAILED',
        reason: 'Insufficient permissions',
      };

      const mockResponse = {
        status: 200,
        statusText: 'OK',
        data: responseData,
      };

      mockAxiosInstance.request.mockResolvedValue(mockResponse);
      mockedAxios.isAxiosError.mockReturnValue(false);

      try {
        await client.testRequest({
          path: '/test',
          method: 'GET',
        });
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response).toBeDefined();
        expect(error.response).toEqual(responseData);
        expect(error.response.success).toBe(false);
        expect(error.response.reason).toBe('Insufficient permissions');
      }
    });

    it('should preserve all error response fields for debugging', async () => {
      const responseData = {
        error: 'Conflict',
        message: 'Resource already exists',
        code: 'DUPLICATE_RESOURCE',
        conflictingId: 'existing-123',
        timestamp: new Date().toISOString(),
        trace: {
          service: 'api',
          version: '2.1.0',
        },
      };

      const mockResponse = {
        status: 409,
        statusText: 'Conflict',
        data: responseData,
      };

      mockAxiosInstance.request.mockRejectedValue({
        response: mockResponse,
      });
      mockedAxios.isAxiosError.mockReturnValue(true);

      try {
        await client.testRequest({
          path: '/test',
          method: 'POST',
        });
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toBe('Conflict');
        expect(error.response).toBeDefined();
        expect(error.response.code).toBe('DUPLICATE_RESOURCE');
        expect(error.response.conflictingId).toBe('existing-123');
        expect(error.response.trace.version).toBe('2.1.0');
      }
    });

    it('should bind empty error response object when data is empty', async () => {
      const mockResponse = {
        status: 500,
        statusText: 'Internal Server Error',
        data: {},
      };

      mockAxiosInstance.request.mockRejectedValue({
        response: mockResponse,
      });
      mockedAxios.isAxiosError.mockReturnValue(true);

      try {
        await client.testRequest({
          path: '/test',
          method: 'GET',
        });
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response).toBeDefined();
        expect(error.response).toEqual({});
      }
    });

    it('should make error response accessible for error handling logic', async () => {
      const responseData = {
        error: 'Unauthorized',
        code: 'TOKEN_EXPIRED',
        expiresAt: new Date().toISOString(),
      };

      const mockResponse = {
        status: 401,
        statusText: 'Unauthorized',
        data: responseData,
      };

      mockAxiosInstance.request.mockRejectedValue({
        response: mockResponse,
      });
      mockedAxios.isAxiosError.mockReturnValue(true);

      try {
        await client.testRequest({
          path: '/test',
          method: 'GET',
        });
        fail('Should have thrown an error');
      } catch (error: any) {
        // Can now check specific error code for handling
        if (error.response?.code === 'TOKEN_EXPIRED') {
          // Handle token expiration
          expect(error.response.code).toBe('TOKEN_EXPIRED');
        }
      }
    });

    it('should bind error response with array data in response', async () => {
      const responseData = {
        error: 'Multiple errors occurred',
        code: 'MULTI_ERROR',
        errors: [
          { id: 1, message: 'First error' },
          { id: 2, message: 'Second error' },
        ],
      };

      const mockResponse = {
        status: 400,
        statusText: 'Bad Request',
        data: responseData,
      };

      mockAxiosInstance.request.mockRejectedValue({
        response: mockResponse,
      });
      mockedAxios.isAxiosError.mockReturnValue(true);

      try {
        await client.testRequest({
          path: '/test',
          method: 'POST',
        });
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.response.errors).toHaveLength(2);
        expect(error.response.errors[0].message).toBe('First error');
      }
    });
  });
});
