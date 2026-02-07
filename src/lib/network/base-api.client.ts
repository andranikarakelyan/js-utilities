import axios, { AxiosInstance, AxiosResponse } from 'axios';

/**
 * Configuration options for the BaseApiClient.
 */
export interface BaseApiClientConfig {
  baseUrl: string;
  apiToken: string;
  urlPrefix?: string;
}

/**
 * Base API client class providing common request handling functionality.
 * All specific API clients should extend this class.
 */
export abstract class BaseApiClient {
  protected axiosInstance: AxiosInstance;

  /**
   * Creates a new base API client instance.
   * @param config The configuration options for the API client
   */
  constructor(protected config: BaseApiClientConfig) {
    this.axiosInstance = axios.create({
      baseURL: `${config.baseUrl}${config.urlPrefix || ''}`,
      headers: {
        'Authorization': `Bearer ${config.apiToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Sets a new API token for authentication.
   * Updates the Authorization header for all subsequent requests.
   * @param apiToken The new API token to use
   */
  public setApiToken(apiToken: string): void {
    this.config.apiToken = apiToken;
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${apiToken}`;
  }

  /**
   * Clears the current API token.
   * Removes the Authorization header from all subsequent requests.
   */
  public clearApiToken(): void {
    this.config.apiToken = '';
    delete this.axiosInstance.defaults.headers.common['Authorization'];
  }

  /**
   * Makes an HTTP request to the API.
   * @template T The expected response type
   * @param options Request configuration options
   * @param options.path The API endpoint path
   * @param options.query Optional query parameters
   * @param options.body Optional request body
   * @param options.method HTTP method (defaults to GET)
   * @returns The parsed response data
   * @throws {Error} If the request fails or returns an error response
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
   * @template T The expected response type
   * @param response The axios Response object
   * @returns The parsed and validated response data
   * @throws {Error} If the response indicates an error or has success: false
   */
  protected handleResponse<T>(response: AxiosResponse): T {
    const data = response.data;

    if (response.status < 200 || response.status >= 300) {
      const errorMessage = data?.error || data?.message || response.statusText;
      throw new Error(errorMessage);
    }

    if (data?.success === false) {
      throw new Error(data.error || "Request failed");
    }

    return data as T;
  }
}
