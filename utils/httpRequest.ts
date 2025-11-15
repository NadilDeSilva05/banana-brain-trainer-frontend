/**
 * HTTP Request Utility
 * Centralized HTTP request handling with authentication
 */

import { API_URL } from '@/config/apiUrl';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Array<{ msg: string; param: string }>;
}

/**
 * Get authentication token from localStorage
 */
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

/**
 * Set authentication token in localStorage
 */
export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

/**
 * Remove authentication token from localStorage
 */
export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

/**
 * Get request headers with authentication
 */
const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Generic HTTP request function
 * @param endpoint - API endpoint (without base URL)
 * @param options - Fetch options
 * @returns Promise with API response
 */
export const httpRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const url = `${API_URL.BASE}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getHeaders(),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || 'An error occurred',
        errors: data.errors,
      };
    }

    return {
      success: true,
      data: data.data || data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred',
    };
  }
};

/**
 * GET request helper
 */
export const httpGet = <T>(endpoint: string): Promise<ApiResponse<T>> => {
  return httpRequest<T>(endpoint, { method: 'GET' });
};

/**
 * POST request helper
 */
export const httpPost = <T>(
  endpoint: string,
  body: unknown
): Promise<ApiResponse<T>> => {
  return httpRequest<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

/**
 * PUT request helper
 */
export const httpPut = <T>(
  endpoint: string,
  body: unknown
): Promise<ApiResponse<T>> => {
  return httpRequest<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
};

/**
 * DELETE request helper
 */
export const httpDelete = <T>(endpoint: string): Promise<ApiResponse<T>> => {
  return httpRequest<T>(endpoint, { method: 'DELETE' });
};

