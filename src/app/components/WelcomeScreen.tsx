'use client';

import { useState } from 'react';
import ContactModal from './ContactModal';
import { validateUrl } from '../utils/validation';
import { ChartPie } from 'lucide-react';

interface WelcomeScreenProps {
    onUrlSubmit: (data: { url: string; email: string; poc: string }) => void;
    isLoading: boolean;
    errorMessage?: string;
    onClearError?: () => void;
}

export default function WelcomeScreen({ onUrlSubmit, isLoading, errorMessage, onClearError }: WelcomeScreenProps) {
    const [url, setUrl] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [urlError, setUrlError] = useState('');
    const [normalizedUrl, setNormalizedUrl] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setUrlError('');
        
        if (errorMessage && onClearError) {
            onClearError();
        }

        if (!url.trim()) {
            setUrlError('URL is required');
            return;
        }

        const urlValidation = validateUrl(url);
        if (!urlValidation.isValid) {
            setUrlError(urlValidation.error || 'Invalid URL');
            return;
        }

        let normalizedUrl = url.trim();
        if (!normalizedUrl.match(/^https?:\/\//)) {
            normalizedUrl = `https://${normalizedUrl}`;
        }

        setNormalizedUrl(normalizedUrl);
        setShowModal(true);
    };

    const handleModalSubmit = (data: { email: string; poc: string; url: string }) => {
        setShowModal(false);
        onUrlSubmit({ url: data.url, email: data.email, poc: data.poc });
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value);
        if (urlError) {
            setUrlError('');
        }
        if (errorMessage && onClearError) {
            onClearError();
        }
    };

    return (
        <div 
            className="relative min-h-screen w-full overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 50%, var(--color-accent) 100%)',
                backgroundSize: "400% 400%",
                animation: "gradientShift 8s ease infinite"
            }}
        >
            {/* Background overlay */}
            <div className="absolute inset-0" style={{ backgroundColor: 'var(--background)', opacity: 0.85 }}></div>
            
            {/* Subtle decorative elements */}
            <div className="absolute top-[-10%] left-[-10%] w-80 h-80 rounded-full opacity-20 filter blur-3xl" style={{ backgroundColor: 'var(--color-primary)' }}></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 rounded-full opacity-20 filter blur-3xl" style={{ backgroundColor: 'var(--color-accent)' }}></div>
            
            {/* Additional overlay for depth */}
            <div className="absolute inset-0" style={{ backgroundColor: 'var(--background)', opacity: 0.3 }}></div>
            
            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 text-center">
                <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
                    <div className="mb-6 sm:mb-8">
                        <ChartPie className="mx-auto w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-accent mb-3 sm:mb-4" />
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-wide text-primary mb-3 sm:mb-4 drop-shadow-lg leading-tight">
                            Company Profiler
                        </h1>
                        <p className="text-base sm:text-lg lg:text-xl text-secondary max-w-xs sm:max-w-md lg:max-w-2xl mx-auto leading-relaxed">
                            Enter a URL and create your company profile with AI analysis.
                        </p>
                    </div>

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="mb-4 sm:mb-6 bg-surface border border-error rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg backdrop-blur-sm">
                            <div className="flex items-start gap-2 sm:gap-3">
                                <div className="flex-shrink-0 text-error mt-0.5">
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-error font-semibold text-left text-sm sm:text-base">Analysis Error</h3>
                                    <p className="text-secondary text-xs sm:text-sm mt-1 text-left break-words">{errorMessage}</p>
                                </div>
                                {onClearError && (
                                    <button
                                        onClick={onClearError}
                                        className="flex-shrink-0 text-muted hover:text-primary transition-colors p-1"
                                    >
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="bg-surface border border-default rounded-lg sm:rounded-xl p-4 sm:p-6 relative shadow-lg backdrop-blur-sm">
                        <form onSubmit={handleSubmit} id="url-form">
                            <input
                                type="text"
                                placeholder="e.g. mccarren.ai"
                                className={`w-full bg-transparent border-0 px-0 py-2 sm:py-3 text-sm sm:text-base text-primary placeholder-muted focus:outline-none transition-all ${
                                    urlError 
                                        ? 'text-error' 
                                        : ''
                                }`}
                                value={url}
                                onChange={handleUrlChange}
                                disabled={isLoading}
                                required
                            />
                            {urlError && (
                                <p className="text-xs sm:text-sm text-error text-left mt-2 break-words">
                                    {urlError}
                                </p>
                            )}
                            <p className="text-xs sm:text-sm text-muted text-left mt-2">
                                Enter the company website (protocol optional)
                            </p>
                        </form>
                        
                        <button
                            type="submit"
                            form="url-form"
                            className={`absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full border transition-all ${
                                isLoading 
                                    ? 'bg-transparent cursor-not-allowed text-muted border-muted' 
                                    : 'bg-transparent hover:bg-primary-dark hover:scale-110 text-primary border-primary'
                            }`}
                            disabled={isLoading || !url.trim()}
                            title="Create Company Profile"
                        >
                            {isLoading ? (
                                <span className="loading loading-spinner loading-xs text-primary"></span>
                            ) : (
                                <div className="relative">
                                    <svg 
                                        className="w-3 h-3 sm:w-4 sm:h-4" 
                                        fill="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 2L5 9h14z" />
                                    </svg>
                                </div>
                            )}
                        </button>
                    </div>

                    <p className="mt-3 sm:mt-4 text-muted text-xs sm:text-sm leading-relaxed">
                        Our AI extracts comprehensive company information including services, keywords and contacts.
                    </p>
                </div>
            </div>

            <ContactModal
                isOpen={showModal}
                onClose={handleModalClose}
                onSubmit={handleModalSubmit}
                url={normalizedUrl}
            />

            <style jsx>{`
                @keyframes gradientShift {
                    0%, 100% { background-position: 0% 50%; }
                    25% { background-position: 100% 50%; }
                    50% { background-position: 100% 100%; }
                    75% { background-position: 0% 100%; }
                }
            `}</style>
        </div>
    );
} 