'use client';

import { useState } from 'react';
import { Message } from 'ai';

interface DebugModalProps {
    isOpen: boolean;
    onClose: () => void;
    messages: Message[];
}

export default function DebugModal({ isOpen, onClose, messages }: DebugModalProps) {
    const [expandedMessage, setExpandedMessage] = useState<number | null>(null);

    if (!isOpen) return null;

    const toggleMessage = (index: number) => {
        setExpandedMessage(expandedMessage === index ? null : index);
    };

    const formatRole = (role: string) => {
        switch (role) {
            case 'user': return 'User Input';
            case 'assistant': return 'AI Assistant';
            case 'system': return 'System';
            default: return role;
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'user': return 'text-blue-400 border-blue-500/20 bg-blue-500/10';
            case 'assistant': return 'text-green-400 border-green-500/20 bg-green-500/10';
            case 'system': return 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10';
            default: return 'text-gray-400 border-gray-500/20 bg-gray-500/10';
        }
    };

    const exportMessages = () => {
        const jsonString = JSON.stringify(messages, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `llm-conversation-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-900 border border-white/20 rounded-2xl w-full max-w-6xl max-h-[90vh] mx-4 shadow-2xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/20">
                    <div>
                        <h3 className="text-2xl font-bold text-white">LLM Debug Console</h3>
                        <p className="text-gray-400 text-sm mt-1">
                            All inputs and outputs from the AI conversation
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={exportMessages}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            Export JSON
                        </button>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-lg">No messages yet</div>
                            <div className="text-gray-500 text-sm mt-2">Start a conversation to see debug information</div>
                        </div>
                    ) : (
                        messages.map((message, index) => (
                            <div key={index} className={`border rounded-xl ${getRoleColor(message.role)}`}>
                                <div
                                    className="p-4 cursor-pointer flex items-center justify-between"
                                    onClick={() => toggleMessage(index)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="text-sm font-bold">
                                            {formatRole(message.role)}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            Message {index + 1}
                                        </div>
                                        {message.parts && (
                                            <div className="text-xs text-gray-400">
                                                {message.parts.length} part{message.parts.length > 1 ? 's' : ''}
                                            </div>
                                        )}
                                    </div>
                                    <svg
                                        className={`w-5 h-5 transition-transform ${expandedMessage === index ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>

                                {expandedMessage === index && (
                                    <div className="border-t border-current border-opacity-20 p-4 bg-black/20">
                                        {message.content && (
                                            <div className="mb-4">
                                                <h4 className="text-sm font-semibold mb-2">Content:</h4>
                                                <pre className="text-xs bg-black/30 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap">
                                                    {message.content}
                                                </pre>
                                            </div>
                                        )}

                                        {message.parts && message.parts.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-semibold mb-2">Parts ({message.parts.length}):</h4>
                                                <div className="space-y-2">
                                                    {message.parts.map((part, partIndex) => (
                                                        <div key={partIndex} className="bg-black/30 p-3 rounded-lg">
                                                            <div className="text-xs font-semibold text-gray-300 mb-2">
                                                                Type: {part.type}
                                                            </div>
                                                            <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                                                                {JSON.stringify(part, null, 2)}
                                                            </pre>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-4 text-xs text-gray-400">
                                            <strong>Full Message Object:</strong>
                                            <pre className="mt-2 bg-black/30 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap">
                                                {JSON.stringify(message, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
} 