/**
 * HTTP Request Utility
 * Centralized HTTP request handling with authentication
 */

import { API_URL } from '@/config/apiUrl';
import { ApiResponse } from '@/types/api';

/**
 * Get authentication token from localStorage
 */
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
};

/**
 * Get headers with authentication
 */
const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Handle API response
 */
const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');

  if (!response.ok) {
    let error = 'An error occurred';
    
    if (isJson) {
      const errorData = await response.json();
      error = errorData.message || errorData.error || error;
    } else {
      error = await response.text() || error;
    }

    // Handle 401 Unauthorized - clear token and redirect to login
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
    }

    return {
      success: false,
      error,
    };
  }

  if (isJson) {
    const data = await response.json();
    return {
      success: true,
      data: data.data || data,
    };
  }

  return {
    success: true,
  } as ApiResponse<T>;
};

/**
 * GET request
 */
export const httpGet = async <T>(url: string): Promise<ApiResponse<T>> => {
  try {
    const fullUrl = url.startsWith('http') ? url : `${API_URL.BASE}${url}`;
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: getHeaders(),
    });

    return handleResponse<T>(response);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred',
    };
  }
};

/**
 * POST request
 */
export const httpPost = async <T>(
  url: string,
  body?: unknown
): Promise<ApiResponse<T>> => {
  try {
    const fullUrl = url.startsWith('http') ? url : `${API_URL.BASE}${url}`;
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    return handleResponse<T>(response);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred',
    };
  }
};

/**
 * PUT request
 */
export const httpPut = async <T>(
  url: string,
  body?: unknown
): Promise<ApiResponse<T>> => {
  try {
    const fullUrl = url.startsWith('http') ? url : `${API_URL.BASE}${url}`;
    const response = await fetch(fullUrl, {
      method: 'PUT',
      headers: getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    return handleResponse<T>(response);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred',
    };
  }
};

/**
 * DELETE request
 */
export const httpDelete = async <T>(url: string): Promise<ApiResponse<T>> => {
  try {
    const fullUrl = url.startsWith('http') ? url : `${API_URL.BASE}${url}`;
    const response = await fetch(fullUrl, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    return handleResponse<T>(response);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred',
    };
  }
};

