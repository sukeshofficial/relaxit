const ACCESS_TOKEN_KEY = 'relaxit_access_token';
const REFRESH_TOKEN_KEY = 'relaxit_refresh_token';
const USER_KEY = 'relaxit_user';
class AuthStore {
    accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    user = this.loadInitialUser();
    listeners = new Set();
    loadInitialUser() {
        const raw = localStorage.getItem(USER_KEY);
        if (!raw)
            return null;
        try {
            return JSON.parse(raw);
        }
        catch {
            localStorage.removeItem(USER_KEY);
            return null;
        }
    }
    getState() {
        return {
            accessToken: this.accessToken,
            refreshToken: this.refreshToken,
            user: this.user,
            isAuthenticated: Boolean(this.accessToken && this.user),
        };
    }
    getAccessToken() {
        return this.accessToken;
    }
    getRefreshToken() {
        return this.refreshToken;
    }
    getUser() {
        return this.user;
    }
    setTokens(accessToken, refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        this.notify();
    }
    setUser(user) {
        this.user = user;
        if (user) {
            localStorage.setItem(USER_KEY, JSON.stringify(user));
        }
        else {
            localStorage.removeItem(USER_KEY);
        }
        this.notify();
    }
    setAuthSession(user, accessToken, refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.user = user;
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        this.notify();
    }
    clearAuth() {
        this.accessToken = null;
        this.refreshToken = null;
        this.user = null;
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        this.notify();
    }
    subscribe(listener) {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    }
    notify() {
        const state = this.getState();
        this.listeners.forEach((listener) => listener(state));
    }
}
export const authStore = new AuthStore();
