export class LogoService {
    private static readonly CACHE_PREFIX = 'company_logo_';

    static saveToLocalStorage(companyName: string, logoBase64: string): void {
        try {
            const key = this.CACHE_PREFIX + companyName;
            localStorage.setItem(key, logoBase64);
            console.log('💾 Logo saved to localStorage for company:', companyName);
        } catch (error) {
            console.warn('⚠️ Failed to save logo to localStorage:', error);
        }
    }

    static getFromLocalStorage(companyName: string): string | null {
        try {
            const key = this.CACHE_PREFIX + companyName;
            return localStorage.getItem(key);
        } catch (error) {
            console.warn('⚠️ Failed to load logo from localStorage:', error);
            return null;
        }
    }

    static removeFromLocalStorage(companyName: string): void {
        try {
            const key = this.CACHE_PREFIX + companyName;
            localStorage.removeItem(key);
            console.log('🗑️ Logo removed from localStorage for company:', companyName);
        } catch (error) {
            console.warn('⚠️ Failed to remove logo from localStorage:', error);
        }
    }

    static async fetchFromAPI(websiteUrl: string, companyName: string) {
        const response = await fetch('/api/logo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: websiteUrl, companyName })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return await response.json();
    }
} 