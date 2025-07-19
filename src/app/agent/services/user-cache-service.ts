interface CachedUserData {
    email: string;
    poc: string;
    lastUsed: string;
}

export class UserCacheService {
    private static readonly CACHE_KEY = 'company_profiler_user_data';
    private static readonly CACHE_EXPIRY_DAYS = 30;

    static saveUserData(email: string, poc: string): void {
        try {
            const data: CachedUserData = {
                email: email.trim(),
                poc: poc.trim(),
                lastUsed: new Date().toISOString()
            };
            localStorage.setItem(this.CACHE_KEY, JSON.stringify(data));
            console.log('💾 User data cached successfully');
        } catch (error) {
            console.warn('⚠️ Failed to cache user data:', error);
        }
    }

    static getUserData(): CachedUserData | null {
        try {
            const cached = localStorage.getItem(this.CACHE_KEY);
            if (!cached) return null;

            const data: CachedUserData = JSON.parse(cached);

            // Check if cache is expired
            const lastUsed = new Date(data.lastUsed);
            const now = new Date();
            const daysDiff = (now.getTime() - lastUsed.getTime()) / (1000 * 3600 * 24);

            if (daysDiff > this.CACHE_EXPIRY_DAYS) {
                this.clearUserData();
                return null;
            }

            return data;
        } catch (error) {
            console.warn('⚠️ Failed to load cached user data:', error);
            return null;
        }
    }

    static hasUserData(): boolean {
        return this.getUserData() !== null;
    }

    static clearUserData(): void {
        try {
            localStorage.removeItem(this.CACHE_KEY);
            console.log('🗑️ User data cache cleared');
        } catch (error) {
            console.warn('⚠️ Failed to clear user data cache:', error);
        }
    }
} 