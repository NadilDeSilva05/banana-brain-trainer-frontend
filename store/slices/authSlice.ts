/**
 * Auth Redux Slice
 * Manages authentication state
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types/api';
import { authService } from '@/services/authService';
import { setToken, removeToken, getToken } from '@/utils/httpRequest';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: typeof window !== 'undefined' ? getToken() : null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

// Async thunks
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      if (response.success && response.data) {
        return response.data.user;
      }
      return rejectWithValue('Not authenticated');
    } catch (error) {
      return rejectWithValue('Failed to check authentication');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.login(email, password);
      if (response.success && response.data) {
        setToken(response.data.token);
        return {
          user: response.data.user,
          token: response.data.token,
        };
      }
      return rejectWithValue(
        response.error || response.errors?.map(e => e.msg).join(', ') || 'Login failed'
      );
    } catch (error) {
      return rejectWithValue('An error occurred during login');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (
    {
      username,
      email,
      password,
    }: { username: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.register(username, email, password);
      if (response.success && response.data) {
        setToken(response.data.token);
        return {
          user: response.data.user,
          token: response.data.token,
        };
      }
      const errorMessage = response.errors
        ? response.errors.map(e => e.msg).join(', ')
        : response.error || 'Registration failed';
      return rejectWithValue(errorMessage);
    } catch (error) {
      return rejectWithValue('An error occurred during registration');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      removeToken();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Check auth
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        removeToken();
      });

    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (
          state,
          action: PayloadAction<{ user: User; token: string }>
        ) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.error = null;
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (
          state,
          action: PayloadAction<{ user: User; token: string }>
        ) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.error = null;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

