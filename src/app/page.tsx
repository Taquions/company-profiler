'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import WelcomeScreen from './components/WelcomeScreen';
import LoadingState from './components/ui/LoadingState';
import DebugModal from './components/DebugModal';
import { useAgentChat } from './hooks/useAgentChat';
import { AppState, AnalysisData } from './agent/types';

function HomePageComponent() {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [showDebugModal, setShowDebugModal] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const { analyzeWebsite, messages, isLoading } = useAgentChat();

  const errorMessage = searchParams.get('error') || undefined;

  const handleUrlSubmit = async (data: AnalysisData) => {
    setAppState('loading');
    analyzeWebsite(data);
  };

  const handleClearError = () => {
    router.push('/');
  };

  const renderContent = () => {
    switch (appState) {
      case 'loading':
        return <LoadingState />;
      default:
        return (
          <WelcomeScreen
            onUrlSubmit={handleUrlSubmit}
            isLoading={isLoading}
            errorMessage={errorMessage}
            onClearError={handleClearError}
          />
        );
    }
  };

  return (
    <div className="relative">
      {renderContent()}

      {/* Debug Button - Only show if there are messages */}
      {messages.length > 0 && (
        <button
          onClick={() => setShowDebugModal(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 bg-secondary hover:bg-secondary text-inverse p-2 sm:p-3 rounded-full shadow-lg transition-all hover:scale-105"
          title="Debug LLM Console"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>
      )}

      {/* Debug Modal */}
      <DebugModal
        isOpen={showDebugModal}
        onClose={() => setShowDebugModal(false)}
        messages={messages}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <HomePageComponent />
    </Suspense>
  );
}