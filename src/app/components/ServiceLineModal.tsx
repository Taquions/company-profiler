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
    const [quantity, setQuantity] = useState(3);

    if (!isOpen) return null;

    const handleGenerate = () => {
        onGenerate(additionalContext, quantity);
        setAdditionalContext('');
        setQuantity(3);
    };

    const handleManualAdd = () => {
        onManualAdd();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-800/95 backdrop-blur-lg border border-slate-600/50 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-white">Add Service Lines</h3>
                    <button
                        onClick={onClose}
                        disabled={isGenerating}
                        className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Manual Option */}
                <div className="mb-6">
                    <button
                        onClick={handleManualAdd}
                        disabled={isGenerating}
                        className="w-full bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 font-medium py-3 px-4 rounded-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                    >
                        <div className="flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Manually
                        </div>
                    </button>
                </div>

                {/* Separator */}
                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-slate-800 text-gray-400">ou</span>
                    </div>
                </div>

                {/* AI Generation Option */}
                <div className="space-y-4">
                    <h4 className="text-lg font-medium text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Generate with AI
                    </h4>

                    {/* Additional Context */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Additional Context (Optional)
                        </label>
                        <textarea
                            value={additionalContext}
                            onChange={(e) => setAdditionalContext(e.target.value)}
                            disabled={isGenerating}
                            placeholder="Ex: focus on healthcare solutions, government contracting, etc..."
                            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none disabled:opacity-50"
                            rows={3}
                        />
                    </div>

                    {/* Quantity Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Number of Service Lines
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <button
                                    key={num}
                                    onClick={() => setQuantity(num)}
                                    disabled={isGenerating}
                                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${quantity === num
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
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
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                    >
                        {isGenerating ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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