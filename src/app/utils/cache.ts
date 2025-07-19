interface CachedUserData {
    email: string;
    poc: string;
    lastUsed: string;
}

const CACHE_KEY = 'company_profiler_user_data';
const CACHE_EXPIRY_DAYS = 30;

export const saveUserDataToCache = (email: string, poc: string): void => {
    try {
        const data: CachedUserData = {
            email: email.trim(),
            poc: poc.trim(),
            lastUsed: new Date().toISOString()
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (error) {
        console.warn('Failed to save user data to cache:', error);
    }
};

export const getUserDataFromCache = (): CachedUserData | null => {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) return null;

        const data: CachedUserData = JSON.parse(cached);

        // Check if cache is expired
        const lastUsed = new Date(data.lastUsed);
        const now = new Date();
        const daysDiff = (now.getTime() - lastUsed.getTime()) / (1000 * 3600 * 24);

        if (daysDiff > CACHE_EXPIRY_DAYS) {
            clearUserDataCache();
            return null;
        }

        return data;
    } catch (error) {
        console.warn('Failed to load user data from cache:', error);
        return null;
    }
};

export const clearUserDataCache = (): void => {
    try {
        localStorage.removeItem(CACHE_KEY);
    } catch (error) {
        console.warn('Failed to clear user data cache:', error);
    }
};

export const hasCachedUserData = (): boolean => {
    return getUserDataFromCache() !== null;
}; 