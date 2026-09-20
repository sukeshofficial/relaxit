import type { AuthUserResponse } from '../types/api';

const ACCESS_TOKEN_KEY = 'relaxit_access_token';
const REFRESH_TOKEN_KEY = 'relaxit_refresh_token';
const USER_KEY = 'relaxit_user';

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUserResponse | null;
  isAuthenticated: boolean;
}

type AuthListener = (state: AuthState) => void;

class AuthStore {
  private accessToken: string | null = localStorage.getItem(ACCESS_TOKEN_KEY);
  private refreshToken: string | null = localStorage.getItem(REFRESH_TOKEN_KEY);
  private user: AuthUserResponse | null = this.loadInitialUser();
  private listeners: Set<AuthListener> = new Set();

  private loadInitialUser(): AuthUserResponse | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUserResponse;
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  }

  public getState(): AuthState {
    return {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
      user: this.user,
      isAuthenticated: Boolean(this.accessToken && this.user),
    };
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public getRefreshToken(): string | null {
    return this.refreshToken;
  }

  public getUser(): AuthUserResponse | null {
    return this.user;
  }

  public setTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    this.notify();
  }

  public setUser(user: AuthUserResponse | null): void {
    this.user = user;
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
    this.notify();
  }

  public setAuthSession(user: AuthUserResponse, accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.user = user;
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.notify();
  }

  public clearAuth(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.user = null;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.notify();
  }

  public subscribe(listener: AuthListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const state = this.getState();
    this.listeners.forEach((listener) => listener(state));
  }
}

export const authStore = new AuthStore();
