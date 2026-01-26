type FetchOptions = RequestInit & {
  params?: Record<string, string>;
};

class ApiClient {
  private baseURL: string;
  BASE_HEADERS = {
    'Content-Type': 'application/json',
  };

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private buildURL(endpoint: string, params?: Record<string, string>): string {
    const url = new URL(endpoint, this.baseURL);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    return url.toString();
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorMessage = await response.text().catch(() => 'Request failed');
      throw new Error(errorMessage || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    const url = this.buildURL(endpoint, options?.params);
    const response = await fetch(url, {
      ...options,
      method: 'GET',
      headers: { ...this.BASE_HEADERS, ...options?.headers },
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, body?: unknown, options?: FetchOptions): Promise<T> {
    const url = this.buildURL(endpoint, options?.params);
    const response = await fetch(url, {
      ...options,
      method: 'POST',
      headers: { ...this.BASE_HEADERS, ...options?.headers },
      body: JSON.stringify(body),
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, body?: unknown, options?: FetchOptions): Promise<T> {
    const url = this.buildURL(endpoint, options?.params);
    const response = await fetch(url, {
      ...options,
      method: 'PUT',
      headers: { ...this.BASE_HEADERS, ...options?.headers },
      body: JSON.stringify(body),
    });
    return this.handleResponse<T>(response);
  }

  async delete<T = void>(endpoint: string, options?: FetchOptions): Promise<T> {
    const url = this.buildURL(endpoint, options?.params);
    const response = await fetch(url, {
      ...options,
      method: 'DELETE',
      headers: { ...this.BASE_HEADERS, ...options?.headers },
    });
    return this.handleResponse<T>(response);
  }
}

export const api = new ApiClient('http://localhost:5000');
