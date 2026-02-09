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
});
