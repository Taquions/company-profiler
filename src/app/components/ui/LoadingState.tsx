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
            <div className="relative z-10 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    {/* Loading spinner */}
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                    
                    {/* Progress messages with animation */}
                    <div className="min-h-[60px] flex flex-col justify-center">
                        <p className="text-white text-xl font-medium mb-2 transition-all duration-500 ease-in-out">
                            {currentMessage.main}
                        </p>
                        <p className="text-gray-300 text-sm transition-all duration-500 ease-in-out">
                            {currentMessage.sub}
                        </p>
                    </div>

                    {/* Progress indicator dots */}
                    <div className="flex justify-center gap-2 mt-6">
                        {progressMessages.map((_, index) => (
                            <div
                                key={index}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                    index === currentMessageIndex 
                                        ? 'bg-blue-500 scale-125' 
                                        : 'bg-gray-600'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
} 