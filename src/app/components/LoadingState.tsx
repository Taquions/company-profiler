'use client';

import { useState, useEffect } from 'react';

interface StreamField {
  label: string;
  value: string;
  completed: boolean;
}

export default function LoadingState() {
    const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [fields, setFields] = useState<StreamField[]>([
        { label: 'Company Name', value: 'Analyzing company identity...', completed: false },
        { label: 'Description', value: 'Extracting company overview and mission...', completed: false },
        { label: 'Service Lines', value: 'Cataloging business services...', completed: false },
        { label: 'Primary Keywords', value: 'Identifying tier 1 government opportunities...', completed: false },
        { label: 'Secondary Keywords', value: 'Mapping tier 2 contracting terms...', completed: false },
        { label: 'Contact Information', value: 'Processing contact details...', completed: false },
        { label: 'Point of Contact', value: 'Identifying key stakeholders...', completed: false }
    ]);

    useEffect(() => {
        if (currentFieldIndex >= fields.length) return;

        const currentField = fields[currentFieldIndex];
        if (currentCharIndex < currentField.value.length) {
            const timer = setTimeout(() => {
                setCurrentCharIndex(prev => prev + 1);
            }, 50 + Math.random() * 50); // Variable typing speed for realism

            return () => clearTimeout(timer);
        } else {
            // Mark current field as completed and move to next
            setTimeout(() => {
                setFields(prev => prev.map((field, index) => 
                    index === currentFieldIndex 
                        ? { ...field, completed: true }
                        : field
                ));
                setCurrentFieldIndex(prev => prev + 1);
                setCurrentCharIndex(0);
            }, 800);
        }
    }, [currentFieldIndex, currentCharIndex, fields]);

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
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
                <div className="w-full max-w-2xl">
                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl">
                        <div className="flex flex-col items-center space-y-8">
                            <div className="text-center space-y-4">
                                <div className="flex items-center justify-center space-x-3">
                                    <span className="loading loading-spinner loading-lg text-blue-400"></span>
                                    <h2 className="text-4xl font-bold text-white">
                                        Analyzing Company Profile
                                    </h2>
                                </div>
                                <p className="text-gray-300 text-lg">
                                    AI is extracting comprehensive company information...
                                </p>
                            </div>
                            
                            <div className="w-full space-y-4">
                                {fields.map((field, index) => {
                                    const isActive = index === currentFieldIndex;
                                    const isVisible = index <= currentFieldIndex;
                                    
                                    if (!isVisible) return null;

                                    const displayValue = isActive 
                                        ? field.value.substring(0, currentCharIndex)
                                        : field.value;

                                    return (
                                        <div 
                                            key={index}
                                            className={`bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4 transition-all duration-300 ${
                                                field.completed ? 'opacity-75 border-green-400/30' : isActive ? 'border-blue-400/50' : ''
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-3 h-3 rounded-full transition-colors ${
                                                        field.completed 
                                                            ? 'bg-green-400' 
                                                            : isActive 
                                                                ? 'bg-blue-400 animate-pulse' 
                                                                : 'bg-white/30'
                                                    }`} />
                                                    <span className="font-semibold text-white">
                                                        {field.label}
                                                    </span>
                                                </div>
                                                {field.completed && (
                                                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-300 ml-6">
                                                {displayValue}
                                                {isActive && !field.completed && (
                                                    <span className="animate-pulse text-blue-400">|</span>
                                                )}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="w-full space-y-3">
                                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                                    <div 
                                        className="h-full bg-blue-600 transition-all duration-300 ease-out rounded-full"
                                        style={{ 
                                            width: `${((currentFieldIndex + (currentCharIndex / (fields[currentFieldIndex]?.value.length || 1))) / fields.length) * 100}%` 
                                        }}
                                    />
                                </div>
                                
                                <div className="text-center">
                                    <p className="text-sm text-gray-300">
                                        Processing field {Math.min(currentFieldIndex + 1, fields.length)} of {fields.length}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {Math.round(((currentFieldIndex + (currentCharIndex / (fields[currentFieldIndex]?.value.length || 1))) / fields.length) * 100)}% complete
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 