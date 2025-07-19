'use client';

import { useState, useEffect } from 'react';
import { validateEmail, validateName } from '../utils/validation';
import { getUserDataFromCache, saveUserDataToCache } from '../utils/cache';

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
    const [isLoadedFromCache, setIsLoadedFromCache] = useState(false);

    // Load cached data when modal opens
    useEffect(() => {
        if (isOpen) {
            const cachedData = getUserDataFromCache();
            if (cachedData) {
                setEmail(cachedData.email);
                setPoc(cachedData.poc);
                setIsLoadedFromCache(true);
            } else {
                setIsLoadedFromCache(false);
            }
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setEmailError('');
        setPocError('');

        // Validate email
        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            setEmailError(emailValidation.error || 'Invalid email');
            return;
        }

        // Validate name
        const nameValidation = validateName(poc);
        if (!nameValidation.isValid) {
            setPocError(nameValidation.error || 'Invalid name');
            return;
        }

        // If all validations pass, save to cache and submit the form
        const trimmedEmail = email.trim();
        const trimmedPoc = poc.trim();
        
        saveUserDataToCache(trimmedEmail, trimmedPoc);
        onSubmit({ email: trimmedEmail, poc: trimmedPoc, url });
        
        setEmail('');
        setPoc('');
        setEmailError('');
        setPocError('');
        setIsLoadedFromCache(false);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (emailError) {
            setEmailError('');
        }
    };

    const handlePocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPoc(e.target.value);
        if (pocError) {
            setPocError('');
        }
    };

    const handleClose = () => {
        setEmail('');
        setPoc('');
        setEmailError('');
        setPocError('');
        setIsLoadedFromCache(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
                <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white text-center mb-2">
                        Company Information
                    </h3>
                    {isLoadedFromCache && (
                        <div className="mb-3 bg-green-500/10 backdrop-blur-lg border border-green-500/20 rounded-lg p-2">
                            <p className="text-green-400 text-center text-xs">
                                ✓ Previous contact details loaded
                            </p>
                        </div>
                    )}
                    <p className="text-gray-300 text-center text-sm">
                        Please provide your company contact details
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Company Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring transition-all ${emailError
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                : 'border-white/20 focus:border-blue-500 focus:ring-blue-500/20'
                                }`}
                            placeholder="contact@company.com"
                            required
                        />
                        {emailError && (
                            <p className="text-sm text-red-400 mt-1">
                                {emailError}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Point of Contact
                        </label>
                        <input
                            type="text"
                            value={poc}
                            onChange={handlePocChange}
                            className={`w-full bg-white/5 border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring transition-all ${pocError
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                : 'border-white/20 focus:border-blue-500 focus:ring-blue-500/20'
                                }`}
                            placeholder="John Doe"
                            required
                        />
                        {pocError && (
                            <p className="text-sm text-red-400 mt-1">
                                {pocError}
                            </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                            Only letters, spaces, hyphens and apostrophes are allowed
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
                        >
                            Continue
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 