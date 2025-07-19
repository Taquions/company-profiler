'use client';

import { useState } from 'react';
import { validateEmail, validateName } from '../utils/validation';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { email: string; poc: string; url: string }) => void;
    url: string;
}

export default function ContactModal({ isOpen, onClose, onSubmit, url }: ContactModalProps) {
    const [email, setEmail] = useState('');
    const [poc, setPoc] = useState('');
    const [emailError, setEmailError] = useState('');
    const [pocError, setPocError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Reset errors
        setEmailError('');
        setPocError('');

        // Validate email
        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            setEmailError(emailValidation.error || 'Invalid email');
            return;
        }

        // Validate POC name
        const pocValidation = validateName(poc);
        if (!pocValidation.isValid) {
            setPocError(pocValidation.error || 'Invalid name');
            return;
        }

        onSubmit({ email: email.trim(), poc: poc.trim(), url });

        // Reset form
        setEmail('');
        setPoc('');
        onClose();
    };

    const handleClose = () => {
        setEmail('');
        setPoc('');
        setEmailError('');
        setPocError('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800/90 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Contact Information</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <p className="text-gray-300 text-sm mb-6">
                    We need your contact information to analyze <span className="text-blue-400 font-medium">{url}</span>
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full bg-gray-700/50 border rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${emailError
                                    ? 'border-red-500 focus:ring-red-500/20'
                                    : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
                                }`}
                            placeholder="your.email@company.com"
                            required
                        />
                        {emailError && (
                            <p className="text-red-400 text-sm mt-1">{emailError}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="poc" className="block text-sm font-medium text-gray-300 mb-2">
                            Point of Contact (POC)
                        </label>
                        <input
                            type="text"
                            id="poc"
                            value={poc}
                            onChange={(e) => setPoc(e.target.value)}
                            className={`w-full bg-gray-700/50 border rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${pocError
                                    ? 'border-red-500 focus:ring-red-500/20'
                                    : 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
                                }`}
                            placeholder="John Doe"
                            required
                        />
                        {pocError && (
                            <p className="text-red-400 text-sm mt-1">{pocError}</p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium"
                        >
                            Analyze Website
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 