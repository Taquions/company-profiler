import { useState, useEffect } from 'react';
import { LogoService } from '../agent/services/logo-service';

export function useAsyncLogo(companyName: string, websiteUrl?: string) {
    const [logoBase64, setLogoBase64] = useState<string | null>(null);
    const [isLoadingLogo, setIsLoadingLogo] = useState(false);
    const [logoError, setLogoError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadLogo = async () => {
            const savedLogo = LogoService.getFromLocalStorage(companyName);
            if (savedLogo && isMounted) {
                setLogoBase64(savedLogo);
                console.log('🔄 Logo loaded from localStorage for:', companyName);
                return;
            }

            if (websiteUrl && isMounted) {
                setIsLoadingLogo(true);
                setLogoError(null);

                try {
                    console.log('🎨 Starting async logo fetch for:', companyName);

                    const logoData = await LogoService.fetchFromAPI(websiteUrl, companyName);

                    if (logoData.success && logoData.logoBase64 && isMounted) {
                        setLogoBase64(logoData.logoBase64);
                        LogoService.saveToLocalStorage(companyName, logoData.logoBase64);
                        console.log('✅ Logo fetched and saved to localStorage for:', companyName);
                    } else if (isMounted) {
                        setLogoError(logoData.error || 'Failed to load logo');
                        console.log('❌ Logo fetch failed:', logoData.error);
                    }
                } catch (error) {
                    if (isMounted) {
                        setLogoError(error instanceof Error ? error.message : 'Unknown error');
                        console.log('❌ Logo fetch error:', error);
                    }
                } finally {
                    if (isMounted) {
                        setIsLoadingLogo(false);
                    }
                }
            }
        };

        loadLogo();

        return () => {
            isMounted = false;
        };
    }, [companyName, websiteUrl]);

    return { logoBase64, isLoadingLogo, logoError };
} 