'use client';

import { useState } from 'react';
import ContactModal from './ContactModal';
import { validateUrl } from '../utils/validation';

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
        
        // Clear any previous error messages when submitting
        if (errorMessage && onClearError) {
            onClearError();
        }

        if (!url.trim()) {
            setUrlError('URL is required');
            return;
        }

        // Validate URL format only
        const urlValidation = validateUrl(url);
        if (!urlValidation.isValid) {
            setUrlError(urlValidation.error || 'Invalid URL');
            return;
        }

        // Normalize URL with protocol
        let normalizedUrl = url.trim();
        if (!normalizedUrl.match(/^https?:\/\//)) {
            normalizedUrl = `https://${normalizedUrl}`;
        }

        // Pass normalized URL to modal
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
        // Clear error message when user starts typing a new URL
        if (errorMessage && onClearError) {
            onClearError();
        }
    };

    return (
        <div 
            className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800"
            style={{
                backgroundImage: "url('/contract.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
            }}
        >
            {/* Background overlay for transparency */}
            <div className="absolute inset-0 bg-slate-900/95"></div>
            
            {/* Subtle decorative elements */}
            <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-blue-600 rounded-full opacity-20 filter blur-3xl"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-slate-600 rounded-full opacity-20 filter blur-3xl"></div>
            
            {/* Additional overlay */}
            <div className="absolute inset-0 bg-black/40"></div>
            
            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
                <div className="w-full max-w-lg">
                    <div className="mb-8">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white drop-shadow-lg mb-4">
                            Company Profiler
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                            Enter a URL and create your company profile with AI analysis.
                        </p>
                    </div>

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="mb-6 bg-red-500/10 backdrop-blur-lg border border-red-500/20 rounded-2xl p-4 shadow-2xl">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 text-red-400 mt-0.5">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-red-400 font-semibold text-left">Analysis Error</h3>
                                    <p className="text-gray-300 text-sm mt-1 text-left">{errorMessage}</p>
                                </div>
                                {onClearError && (
                                    <button
                                        onClick={onClearError}
                                        className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-6 relative">
                        <form onSubmit={handleSubmit} id="url-form">
                            <input
                                type="text"
                                placeholder="e.g. mccarren.ai"
                                className={`w-full bg-transparent border-0 px-0 py-3 text-white placeholder-gray-400 focus:outline-none transition-all ${
                                    urlError 
                                        ? 'text-red-400' 
                                        : ''
                                }`}
                                value={url}
                                onChange={handleUrlChange}
                                disabled={isLoading}
                                required
                            />
                            {urlError && (
                                <p className="text-sm text-red-400 text-left mt-2">
                                    {urlError}
                                </p>
                            )}
                            <p className="text-sm text-gray-400 text-left mt-2">
                                Enter the company website (protocol optional)
                            </p>
                        </form>
                        
                        <button
                            type="submit"
                            form="url-form"
                            className={`absolute bottom-4 right-4 w-8 h-8 flex items-center justify-center rounded-full border transition-all ${
                                isLoading 
                                    ? 'bg-transparent cursor-not-allowed text-gray-600 border-gray-600' 
                                    : 'bg-transparent hover:bg-blue-600/20 hover:scale-110 text-blue-500 border-blue-500'
                            }`}
                            disabled={isLoading || !url.trim()}
                            title="Create Company Profile"
                        >
                            {isLoading ? (
                                <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                                <div className="relative">
                                    <svg 
                                        className="w-4 h-4" 
                                        fill="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 2L5 9h14z" />
                                    </svg>
                                </div>
                            )}
                        </button>
                    </div>

                    <div className="mt-8 text-gray-400 text-sm">
                        Our AI extracts comprehensive company information including services, keywords and contacts
                    </div>
                </div>
            </div>

            <ContactModal
                isOpen={showModal}
                onClose={handleModalClose}
                onSubmit={handleModalSubmit}
                url={normalizedUrl}
            />
        </div>
    );
} 