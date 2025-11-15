/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import { httpPost, httpGet, ApiResponse } from '@/utils/httpRequest';
import { API_URL } from '@/config/apiUrl';
import { AuthResponse, User } from '@/types/api';

export const authService = {
  /**
   * Register a new user
   */
  register: async (
    username: string,
    email: string,
    password: string
  ): Promise<ApiResponse<AuthResponse>> => {
    return httpPost<AuthResponse>(API_URL.AUTH.REGISTER, {
      username,
      email,
      password,
    });
  },

  /**
   * Login user
   */
  login: async (
    email: string,
    password: string
  ): Promise<ApiResponse<AuthResponse>> => {
    return httpPost<AuthResponse>(API_URL.AUTH.LOGIN, {
      email,
      password,
    });
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser: async (): Promise<ApiResponse<{ user: User }>> => {
    return httpGet<{ user: User }>(API_URL.AUTH.ME);
  },
};

