'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import ProfilePage from '../components/ProfilePage';
import LoadingState from '../components/ui/LoadingState';
import { useProfileData } from '../hooks/useProfileData';

function ProfilePageComponent() {
    const router = useRouter();
    const { profile } = useProfileData();

    const handleBackToWelcome = () => {
        router.push('/');
    };

    if (!profile) {
        return <LoadingState />;
    }

    return (
        <ProfilePage
            initialProfile={profile}
            messages={[]}
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