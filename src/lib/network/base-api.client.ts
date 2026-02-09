import axios, { AxiosInstance, AxiosResponse } from 'axios';

/**
 * Configuration options for the BaseApiClient.
 * 
 * @interface BaseApiClientConfig
 * @property {string} baseUrl - The base URL for all API requests
 * @property {string} [urlPrefix] - Optional URL prefix to append to baseUrl (e.g., '/v1' for versioning)
 * 
 * @example
 * const config: BaseApiClientConfig = {
 *   baseUrl: 'https://api.example.com',
 *   urlPrefix: '/v1'
 * };
 */
export interface BaseApiClientConfig {
  baseUrl: string;
  urlPrefix?: string;
}

/**
 * Base API client class providing common request handling functionality.
 * All specific API clients should extend this class.
 * 
 * This class manages HTTP requests using axios and maintains custom headers
 * that are sent with every request. Headers are stored in the client instance
 * (not in axios defaults) for better reliability and explicit control.
 * 
 * @abstract
 * @class BaseApiClient
 * 
 * @example
 * class UserApiClient extends BaseApiClient {
 *   async getUser(id: number) {
 *     return this.request({
 *       path: `/users/${id}`,
 *       method: 'GET'
 *     });
 *   }
 * }
 * 
 * const client = new UserApiClient({
 *   baseUrl: 'https://api.example.com',
 *   urlPrefix: '/v1'
 * });
 * 
 * client.setHeaders({ 'Authorization': 'Bearer token123' });
 * const user = await client.getUser(1);
 */
export abstract class BaseApiClient {
  protected axiosInstance: AxiosInstance;
  protected customHeaders: Record<string, string> = {};

  /**
   * Creates a new base API client instance.
   * 
   * Initializes the axios instance with the provided configuration and
   * sets up default headers (Content-Type: application/json).
   * Headers are managed in the client instance for explicit control.
   * 
   * @param {BaseApiClientConfig} config - The configuration options for the API client
   * @param {string} config.baseUrl - The base URL for all API requests
   * @param {string} [config.urlPrefix] - Optional URL prefix (e.g., '/v1')
   * 
   * @example
   * constructor(config: BaseApiClientConfig) {
   *   super(config);
   * }
   */
  constructor(protected config: BaseApiClientConfig) {
    this.axiosInstance = axios.create({
      baseURL: `${config.baseUrl}${config.urlPrefix || ''}`,
    });

    // Initialize custom headers with default header
    this.customHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Sets headers for all subsequent requests.
   * 
   * Headers are stored in the client instance and passed explicitly with each request.
   * This provides better reliability compared to using axios default headers.
   * Headers set to null will be deleted.
   * 
   * @param {Record<string, string | null>} headers - Object containing headers to set.
   *        Use null as a value to delete a header.
   * 
   * @example
   * // Set custom headers
   * client.setHeaders({
   *   'X-Request-Id': 'req-123',
   *   'Authorization': 'Bearer token123'
   * });
   * 
   * // Remove a header
   * client.setHeaders({ 'X-Request-Id': null });
   */
  public setHeaders(headers: Record<string, string | null>): void {
    for (const [key, value] of Object.entries(headers)) {
      if (value === null) {
        delete this.customHeaders[key];
      } else {
        this.customHeaders[key] = value;
      }
    }
  }

  /**
   * Gets the current headers.
   * 
   * Returns a copy of all current headers stored in the client instance.
   * This includes default headers (Content-Type) and any custom headers set via setHeaders().
   * 
   * @returns {Record<string, string>} A copy of all current headers
   * 
   * @example
   * const headers = client.getHeaders();
   * console.log(headers['Content-Type']); // 'application/json'
   * console.log(headers['Authorization']); // 'Bearer token123' (if set)
   */
  public getHeaders(): Record<string, string> {
    return { ...this.customHeaders };
  }

  /**
   * Makes an HTTP request to the API.
   * 
   * Sends a request to the API with the specified configuration and current headers.
   * Headers are explicitly passed with each request for reliable header management.
   * Handles both successful responses and axios errors.
   * 
   * When an error occurs, the full response data is bound to the Error instance via the 
   * `response` property, allowing access to structured error information from the server.
   * 
   * @template T The expected response data type
   * @param {Object} options - Request configuration options
   * @param {string} options.path - The API endpoint path (e.g., '/users/1')
   * @param {Record<string, string | number | undefined>} [options.query] - Optional query parameters
   * @param {any} [options.body] - Optional request body for POST/PUT/PATCH requests
   * @param {string} [options.method='GET'] - HTTP method (GET, POST, PUT, PATCH, DELETE)
   * @returns {Promise<T>} The parsed response data
   * @throws {Error} If the request fails, returns an error status code, or response has success: false.
   *         The error object will have a `response` property containing the full error response data.
   * 
   * @example
   * // GET request
   * const user = await this.request({
   *   path: '/users/1',
   *   method: 'GET'
   * });
   * 
   * // Handling errors with structured error data
   * try {
   *   await this.request({ path: '/users', method: 'POST', body: data });
   * } catch (error: any) {
   *   console.log(error.message);           // 'Validation Error'
   *   console.log(error.response.code);     // 'VALIDATION_ERROR'
   *   console.log(error.response.errors);   // array of field errors
   * }
   * 
   * // GET with query parameters
   * const users = await this.request({
   *   path: '/users',
   *   method: 'GET',
   *   query: { page: 1, limit: 10 }
   * });
   */
  protected async request<T>(options: {
    path: string;
    query?: Record<string, string | number | undefined>;
    body?: any;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  }): Promise<T> {
    const { path, query, body, method = "GET" } = options;

    try {
      const response = await this.axiosInstance.request<T>({
        url: path,
        method,
        params: query,
        data: body,
        headers: this.customHeaders,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return this.handleResponse<T>(error.response);
      }
      throw error;
    }
  }

  /**
   * Handles API response parsing and error checking.
   * 
   * Validates the response status code and checks for error indicators in the response data.
   * Supports two error patterns:
   * 1. HTTP error status codes (< 200 or >= 300)
   * 2. JSON response with success: false field
   * 
   * Priority for error messages: error field > message field > statusText
   * 
   * When an error is thrown, the response data is bound to the Error instance via the 
   * `response` property, making the full error details accessible to callers.
   * 
   * @template T The expected response data type
   * @param {AxiosResponse} response - The axios Response object
   * @returns {T} The parsed and validated response data
   * @throws {Error} If the response indicates an error or has success: false.
   *         The error object will have a `response` property containing the response data.
   * 
   * @example
   * // Successful response
   * const data = handleResponse({ status: 200, data: { id: 1, name: 'John' } });
   * 
   * // Error with success: false
   * // throws Error('Operation failed') with error.response = { success: false, error: 'Operation failed', ... }
   * const data = handleResponse({
   *   status: 200,
   *   data: { success: false, error: 'Operation failed' }
   * });
   * 
   * // HTTP error status
   * // throws Error('Not Found') with error.response = { error: 'Resource not found', code: 'NOT_FOUND', ... }
   * const data = handleResponse({
   *   status: 404,
   *   statusText: 'Not Found',
   *   data: { error: 'Resource not found', code: 'NOT_FOUND' }
   * });
   * 
   * // Usage:
   * // try {
   * //   await client.getUser(1);
   * // } catch (error: any) {
   * //   console.log(error.message); // 'Not Found'
   * //   console.log(error.response); // { error: 'Resource not found', code: 'NOT_FOUND', ... }
   * // }
   */
  protected handleResponse<T>(response: AxiosResponse): T {
    const data = response.data;

    if (response.status < 200 || response.status >= 300) {
      const errorMessage = data?.error || data?.message || response.statusText;
      const error = new Error(errorMessage);
      (error as any).response = data;
      throw error;
    }

    if (data?.success === false) {
      const error = new Error(data.error || "Request failed");
      (error as any).response = data;
      throw error;
    }

    return data as T;
  }
}
