'use client';

import { useState, Suspense } from 'react';
import { useChat } from '@ai-sdk/react';
import { useSearchParams, useRouter } from 'next/navigation';
import WelcomeScreen from './components/WelcomeScreen';
import LoadingState from './components/LoadingState';
import DebugModal from './components/DebugModal';

type AppState = 'welcome' | 'loading';

function HomePageComponent() {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [showDebugModal, setShowDebugModal] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get error from URL parameter
  const errorMessage = searchParams.get('error') || undefined;

  const { append, messages, isLoading } = useChat({
    api: '/agent',
    maxSteps: 10,
    onFinish: (message) => {
      console.log('🎬 LLM Chat onFinish called:', {
        messageId: message.id,
        role: message.role,
        createdAt: message.createdAt,
        partsCount: message.parts?.length || 0,
        fullMessage: message
      });

      try {
        if (!message.parts) {
          console.log('❌ No parts in message');
          throw new Error('No parts in message');
        }

        // Check for tool invocations
        for (const part of message.parts) {
          if (part.type === 'tool-invocation') {
            const toolName = part.toolInvocation.toolName;

            console.log('🔧 Tool Invocation Found:', {
              toolName,
              args: part.toolInvocation.args,
              toolCallId: part.toolInvocation.toolCallId
            });

            if (toolName === 'returnToHomeWithError') {
              const errorMessage = part.toolInvocation.args.error_message;
              console.log('🔄 Redirecting to home with error:', errorMessage);
              // Refresh page with error
              window.location.href = `/?error=${encodeURIComponent(errorMessage)}`;
              return;
            }

            if (toolName === 'redirectToProfile') {
              const profileData = part.toolInvocation.args;
              console.log('📊 Redirecting to profile with data:', profileData);
              // Redirect to profile page with data
              const profileParams = new URLSearchParams({
                data: JSON.stringify(profileData)
              });
              router.push(`/profile?${profileParams.toString()}`);
              return;
            }
          }
        }
      } catch (error) {
        console.error('❌ Error parsing AI response:', error);
        console.log('🔍 Full error details:', {
          error,
          message: message,
          stack: error instanceof Error ? error.stack : 'No stack'
        });
        window.location.href = '/?error=' + encodeURIComponent('Error processing analysis response.');
      }
    }
  });

  const handleUrlSubmit = async (data: { url: string; email: string; poc: string }) => {
    setAppState('loading');

    // Store website URL in session storage for async logo loading
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('current_website_url', data.url);
    }

    const prompt = `Please analyze the website ${data.url} and extract comprehensive company information. Use the getWebsiteContent tool to retrieve the website content first, then use the redirectToProfile tool to redirect to the profile page with the extracted data:

- company_name: The official company name
- company_description: A brief description of what the company does
- service_line: Array of services the company provides
- tier1_keywords: Primary keywords this company would use to search for government opportunities
- tier2_keywords: Secondary keywords for government contracting
- emails: Use only this email: [${data.email}]
- poc: Use this contact name: ${data.poc}

Please ensure you use the redirectToProfile tool to redirect to the profile page with the extracted information.`;

    console.log('📤 Sending prompt to LLM:', {
      url: data.url,
      email: data.email,
      poc: data.poc,
      promptLength: prompt.length,
      fullPrompt: prompt
    });

    append({ role: 'user', content: prompt });
  };

  const handleClearError = () => {
    // Clear error from URL
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
          className="fixed bottom-6 right-6 z-40 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-all hover:scale-105"
          title="Debug LLM Console"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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