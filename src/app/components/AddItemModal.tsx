'use client';

import { useState } from 'react';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
  title: string;
  placeholder: string;
  type: 'text' | 'email';
}

export default function AddItemModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  placeholder,
  type
}: AddItemModalProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!value.trim()) {
      setError('This field is required');
      return;
    }

    if (type === 'email' && !validateEmail(value.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    onSubmit(value.trim());
    handleClose();
  };

  const handleClose = () => {
    setValue('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-neutral-dark/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="bg-surface border border-default rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md mx-3 sm:mx-4 shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-primary">{title}</h3>
          <button
            onClick={handleClose}
            className="text-muted hover:text-primary transition-colors p-1"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <input
              type={type}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError('');
              }}
              placeholder={placeholder}
              className="w-full bg-neutral-light border border-default rounded-lg px-3 py-2 sm:py-3 text-sm sm:text-base text-primary placeholder-muted focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              autoFocus
            />
            {error && (
              <p className="text-error text-xs sm:text-sm mt-2">{error}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-neutral hover:bg-neutral-dark text-secondary font-medium py-2 sm:py-3 px-4 text-sm sm:text-base rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary-dark text-inverse font-medium py-2 sm:py-3 px-4 text-sm sm:text-base rounded-lg transition-all hover:scale-[1.02] shadow-md hover:shadow-lg"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 