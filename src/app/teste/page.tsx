'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import WelcomeScreen from '../components/WelcomeScreen';
import LoadingState from '../components/ui/LoadingState';
import DebugModal from '../components/DebugModal';
import { useAgentChat } from '../hooks/useAgentChat';
import { AppState, AnalysisData } from '../agent/types';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden">
      {/* Background Illustration Layer */}
      <div className="absolute inset-0 z-0 opacity-5 bg-[url('/contract-bg.svg')] bg-no-repeat bg-cover bg-center pointer-events-none" />

      {/* Framer Motion Fade-in Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={appState}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="relative z-10"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      {/* Debug Button */}
      {messages.length > 0 && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => setShowDebugModal(true)}
          className="fixed bottom-6 right-6 z-40 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-all hover:scale-105"
          title="Debug LLM Console"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </motion.button>
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