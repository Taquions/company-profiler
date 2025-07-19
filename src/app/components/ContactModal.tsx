'use client';

import { useState } from 'react';

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

    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        setEmailError('');
        setPocError('');

        let hasErrors = false;

        if (!email.trim()) {
            setEmailError('Email is required');
            hasErrors = true;
        } else if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address');
            hasErrors = true;
        }

        if (!poc.trim()) {
            setPocError('Point of Contact is required');
            hasErrors = true;
        }

        if (hasErrors) return;

        onSubmit({ email: email.trim(), poc: poc.trim(), url });
    };

    const handleClose = () => {
        setEmail('');
        setPoc('');
        setEmailError('');
        setPocError('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-neutral-dark/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50">
            <div className="bg-surface border border-default rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md shadow-xl">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-bold text-primary">Contact Information</h2>
                    <button
                        onClick={handleClose}
                        className="text-muted hover:text-primary transition-colors p-1"
                    >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <p className="text-secondary text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">
                    We need your contact information to analyze <span className="text-primary font-medium break-all">{url}</span>
                </p>

                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-secondary mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full bg-neutral-light border rounded-lg px-3 py-2 text-sm sm:text-base text-primary placeholder-muted focus:outline-none focus:ring-2 transition-all ${emailError
                                ? 'border-error text-error'
                                : 'border-default focus:border-primary focus:ring-primary/20'
                                }`}
                            placeholder="your.email@company.com"
                            required
                        />
                        {emailError && (
                            <p className="text-error text-xs sm:text-sm mt-1">{emailError}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="poc" className="block text-xs sm:text-sm font-medium text-secondary mb-2">
                            Point of Contact (POC)
                        </label>
                        <input
                            type="text"
                            id="poc"
                            value={poc}
                            onChange={(e) => setPoc(e.target.value)}
                            className={`w-full bg-neutral-light border rounded-lg px-3 py-2 text-sm sm:text-base text-primary placeholder-muted focus:outline-none focus:ring-2 transition-all ${pocError
                                ? 'border-error text-error'
                                : 'border-default focus:border-primary focus:ring-primary/20'
                                }`}
                            placeholder="John Doe"
                            required
                        />
                        {pocError && (
                            <p className="text-error text-xs sm:text-sm mt-1">{pocError}</p>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 text-sm sm:text-base text-secondary hover:text-primary border border-default hover:border-hover rounded-lg transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 text-sm sm:text-base bg-primary hover:bg-primary-dark text-inverse rounded-lg transition-all font-medium shadow-md hover:shadow-lg"
                        >
                            Analyze Website
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 