import { userApi } from '../api/user.api';
import { authStore } from '../store/authStore';
/**
 * Hydrates authentication session upon application startup.
 * If an access token exists, attempts GET /api/v1/users/me.
 * If token is expired (401), the central Axios interceptor will attempt single-flight refresh.
 * If refresh fails, authStore clears state automatically.
 */
export async function hydrateAuthSession() {
    const token = authStore.getAccessToken();
    if (!token) {
        authStore.clearAuth();
        return;
    }
    try {
        await userApi.getCurrentUser();
    }
    catch (error) {
        console.warn('Failed to hydrate authentication session:', error);
        authStore.clearAuth();
    }
}
