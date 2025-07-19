'use client';

import { useState, useEffect } from 'react';

const progressMessages = [
    { main: "Investigating website...", sub: "Analyzing domain and structure" },
    { main: "Extracting content...", sub: "Reading website information" },
    { main: "Analyzing company data...", sub: "Processing business details" },
    { main: "Identifying services...", sub: "Discovering offerings and solutions" },
    { main: "Extracting contacts...", sub: "Finding communication channels" },
    { main: "Building profile...", sub: "Compiling comprehensive data" },
    { main: "Finalizing analysis...", sub: "Preparing company profile" }
];

export default function LoadingState() {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessageIndex(prev => (prev + 1) % progressMessages.length);
        }, 2500); // Change message every 2.5 seconds

        return () => clearInterval(interval);
    }, []);

    const currentMessage = progressMessages[currentMessageIndex];

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
            <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6">
                <div className="text-center max-w-xs sm:max-w-sm">
                    {/* Loading spinner */}
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 border-2 sm:border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4 sm:mb-6" style={{ borderColor: 'var(--color-primary) transparent var(--color-primary) var(--color-primary)' }}></div>

                    {/* Progress messages with animation */}
                    <div className="min-h-[50px] sm:min-h-[60px] flex flex-col justify-center">
                        <p className="text-primary text-lg sm:text-xl lg:text-2xl font-medium mb-1 sm:mb-2 transition-all duration-500 ease-in-out leading-tight">
                            {currentMessage.main}
                        </p>
                        <p className="text-secondary text-xs sm:text-sm lg:text-base transition-all duration-500 ease-in-out leading-relaxed">
                            {currentMessage.sub}
                        </p>
                    </div>

                    {/* Progress indicator dots */}
                    <div className="flex justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6">
                        {progressMessages.map((_, index) => (
                            <div
                                key={index}
                                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${index === currentMessageIndex
                                    ? 'scale-125'
                                    : ''
                                    }`}
                                style={{
                                    backgroundColor: index === currentMessageIndex
                                        ? 'var(--color-primary)'
                                        : 'var(--color-neutral)'
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

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