'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProfilePage from '../components/ProfilePage';
import LoadingState from '../components/LoadingState';

interface CompanyProfile {
    companyName: string;
    description: string;
    serviceLines: string[];
    tier1Keywords: string[];
    tier2Keywords: string[];
    emails: string[];
    pointOfContact: string;
    logoBase64?: string;
}

function ProfilePageComponent() {
    const [profile, setProfile] = useState<CompanyProfile | null>(null);
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const dataParam = searchParams.get('data');

        if (!dataParam) {
            router.push('/?error=' + encodeURIComponent('No profile data provided.'));
            return;
        }

        try {
            const profileData = JSON.parse(dataParam);

            console.log('📊 Profile data received from URL:', {
                rawData: profileData,
                dataSize: JSON.stringify(profileData).length
            });

            // Handle logo storage and cleanup
            let logoBase64 = undefined;
            if (profileData.logo_base64 &&
                typeof profileData.logo_base64 === 'string' &&
                profileData.logo_base64.trim() &&
                profileData.logo_base64.startsWith('data:image/')) {

                const companyName = profileData.company_name || 'Unknown Company';
                try {
                    // Save logo to localStorage
                    localStorage.setItem(`company_logo_${companyName}`, profileData.logo_base64);
                    logoBase64 = profileData.logo_base64;
                    console.log('💾 Logo saved to localStorage for company:', companyName);
                } catch (error) {
                    console.warn('⚠️ Failed to save logo to localStorage:', error);
                }
            }

            // Convert the agent's format to our component format
            const formattedProfile: CompanyProfile = {
                companyName: profileData.company_name || 'Unknown Company',
                description: profileData.company_description || '',
                serviceLines: profileData.service_line || [],
                tier1Keywords: profileData.tier1_keywords || [],
                tier2Keywords: profileData.tier2_keywords || [],
                emails: profileData.emails || [],
                pointOfContact: profileData.poc || '',
                logoBase64: logoBase64
            };

            console.log('✅ Profile formatted successfully:', {
                formattedProfile,
                originalData: profileData
            });

            setProfile(formattedProfile);
        } catch (error) {
            console.error('❌ Error parsing profile data:', error);
            console.log('🔍 Profile parsing error details:', {
                dataParam,
                error,
                stack: error instanceof Error ? error.stack : 'No stack'
            });
            router.push('/?error=' + encodeURIComponent('Invalid profile data format.'));
        }
    }, [searchParams, router]);

    const handleBackToWelcome = () => {
        router.push('/');
    };

    if (!profile) {
        return <LoadingState />;
    }

    return (
        <ProfilePage
            initialProfile={profile}
            messages={[]} // No messages needed since we're getting data from URL
            onBack={handleBackToWelcome}
        />
    );
}

export default function ProfilePageWrapper() {
    return (
        <Suspense fallback={<LoadingState />}>
            <ProfilePageComponent />
        </Suspense>
    );
} 