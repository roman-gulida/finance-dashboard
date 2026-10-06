type FetchOptions = RequestInit & {
  params?: Record<string, string>;
};

class ApiClient {
  private baseURL: string;
  BASE_HEADERS: Record<string, string> = {
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

  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('token');
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 401) {
      // Token expired or invalid — clear auth state
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.href = '/sign_in';
      throw new Error('Session expired. Please log in again.');
    }

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  async get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    const url = this.buildURL(endpoint, options?.params);
    const response = await fetch(url, {
      ...options,
      method: 'GET',
      headers: { ...this.BASE_HEADERS, ...this.getAuthHeaders(), ...options?.headers },
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, body?: unknown, options?: FetchOptions): Promise<T> {
    const url = this.buildURL(endpoint, options?.params);
    const response = await fetch(url, {
      ...options,
      method: 'POST',
      headers: { ...this.BASE_HEADERS, ...this.getAuthHeaders(), ...options?.headers },
      body: JSON.stringify(body),
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, body?: unknown, options?: FetchOptions): Promise<T> {
    const url = this.buildURL(endpoint, options?.params);
    const response = await fetch(url, {
      ...options,
      method: 'PUT',
      headers: { ...this.BASE_HEADERS, ...this.getAuthHeaders(), ...options?.headers },
      body: JSON.stringify(body),
    });
    return this.handleResponse<T>(response);
  }

  async delete<T = void>(endpoint: string, options?: FetchOptions): Promise<T> {
    const url = this.buildURL(endpoint, options?.params);
    const response = await fetch(url, {
      ...options,
      method: 'DELETE',
      headers: { ...this.BASE_HEADERS, ...this.getAuthHeaders(), ...options?.headers },
    });
    return this.handleResponse<T>(response);
  }
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = new ApiClient(API_BASE_URL);
