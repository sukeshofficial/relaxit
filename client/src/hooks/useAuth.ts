import { useState, useEffect } from 'react';
import { authStore, type AuthState } from '../store/authStore';

export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>(() => authStore.getState());

  useEffect(() => {
    // Initial sync in case state changed prior to listener attachment
    setAuthState(authStore.getState());
    const unsubscribe = authStore.subscribe((newState) => {
      setAuthState(newState);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return authState;
}
