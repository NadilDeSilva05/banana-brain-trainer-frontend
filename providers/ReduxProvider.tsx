"use client";

import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { ReactNode, useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { checkAuth } from '@/store/slices/authSlice';

/**
 * Component to initialize auth check on mount
 */
function AuthInitializer({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Check if user is authenticated on mount
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      dispatch(checkAuth());
    }
  }, [dispatch]);

  return <>{children}</>;
}

/**
 * Redux Provider Component
 */
export default function ReduxProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
}

