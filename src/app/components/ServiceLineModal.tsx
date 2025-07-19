'use client';

import { useState } from 'react';

interface ServiceLineModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (additionalContext: string, quantity: number) => void;
    onManualAdd: () => void;
    isGenerating?: boolean;
}

export default function ServiceLineModal({
    isOpen,
    onClose,
    onGenerate,
    onManualAdd,
    isGenerating = false
}: ServiceLineModalProps) {
    const [additionalContext, setAdditionalContext] = useState('');
    const [quantity, setQuantity] = useState(1);

    if (!isOpen) return null;

    const handleGenerate = () => {
        console.log('🔢 ServiceLineModal sending quantity:', quantity);
        onGenerate(additionalContext, quantity);
        setAdditionalContext('');
    };

    const handleManualAdd = () => {
        onManualAdd();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-neutral-dark/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50">
            <div className="bg-surface border border-default rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md mx-3 sm:mx-4 shadow-xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-primary">Add Service Lines</h3>
                    <button
                        onClick={onClose}
                        disabled={isGenerating}
                        className="text-muted hover:text-primary transition-colors disabled:opacity-50 p-1"
                    >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Manual Option */}
                <div className="mb-4 sm:mb-6">
                    <button
                        onClick={handleManualAdd}
                        disabled={isGenerating}
                        className="w-full bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary font-medium py-2 sm:py-3 px-3 sm:px-4 text-sm sm:text-base rounded-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                    >
                        <div className="flex items-center justify-center gap-2">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Manually
                        </div>
                    </button>
                </div>

                {/* Separator */}
                <div className="relative mb-4 sm:mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-default"></div>
                    </div>
                    <div className="relative flex justify-center text-xs sm:text-sm">
                        <span className="px-2 bg-surface text-muted">ou</span>
                    </div>
                </div>

                {/* AI Generation Option */}
                <div className="space-y-3 sm:space-y-4">
                    <h4 className="text-base sm:text-lg font-medium text-primary flex items-center gap-2">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Generate with AI
                    </h4>

                    {/* Additional Context */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-secondary mb-2">
                            Additional Context (Optional)
                        </label>
                        <textarea
                            value={additionalContext}
                            onChange={(e) => setAdditionalContext(e.target.value)}
                            disabled={isGenerating}
                            placeholder="Ex: focus on healthcare solutions, government contracting, etc..."
                            className="w-full bg-neutral-light border border-default rounded-lg px-3 py-2 text-sm sm:text-base text-primary placeholder-muted focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none disabled:opacity-50"
                            rows={3}
                        />
                    </div>

                    {/* Quantity Selector */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-secondary mb-2">
                            Number of Service Lines
                        </label>
                        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                            {[1, 2, 3].map((num) => (
                                <button
                                    key={num}
                                    onClick={() => setQuantity(num)}
                                    disabled={isGenerating}
                                    className={`py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium transition-all disabled:opacity-50 ${quantity === num
                                        ? 'bg-secondary text-inverse'
                                        : 'bg-neutral-light text-secondary hover:bg-neutral'
                                        }`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="w-full bg-secondary hover:bg-secondary text-inverse font-medium py-2 sm:py-3 px-3 sm:px-4 text-sm sm:text-base rounded-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                        {isGenerating ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Generate Service Lines
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
} 