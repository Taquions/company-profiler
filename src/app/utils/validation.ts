export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export function validateUrl(url: string): ValidationResult {
    if (!url || !url.trim()) {
        return { isValid: false, error: 'URL is required' };
    }

    let trimmedUrl = url.trim();

    if (!trimmedUrl.match(/^https?:\/\//)) {
        trimmedUrl = `https://${trimmedUrl}`;
    }

    try {
        const urlObj = new URL(trimmedUrl);

        if (!urlObj.hostname || urlObj.hostname.length < 3) {
            return { isValid: false, error: 'URL must contain a valid domain' };
        }

        if (!urlObj.hostname.includes('.')) {
            return { isValid: false, error: 'URL must contain a valid domain (e.g. google.com)' };
        }

        if (urlObj.hostname === 'localhost' ||
            urlObj.hostname.match(/^127\./) ||
            urlObj.hostname.match(/^192\.168\./) ||
            urlObj.hostname.match(/^10\./) ||
            urlObj.hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./)) {
            return { isValid: false, error: 'Local URLs are not allowed for security reasons' };
        }

        return { isValid: true };
    } catch {
        return { isValid: false, error: 'Invalid URL format' };
    }
}

export function validateEmail(email: string): ValidationResult {
    if (!email || !email.trim()) {
        return { isValid: false, error: 'Email is required' };
    }

    const trimmedEmail = email.trim();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(trimmedEmail)) {
        return { isValid: false, error: 'Invalid email format' };
    }

    if (trimmedEmail.length > 254) {
        return { isValid: false, error: 'Email too long' };
    }

    const [localPart, domain] = trimmedEmail.split('@');

    if (localPart.length > 64) {
        return { isValid: false, error: 'Email local part too long' };
    }

    if (domain.length > 255) {
        return { isValid: false, error: 'Email domain too long' };
    }

    return { isValid: true };
}

export function validateName(name: string): ValidationResult {
    if (!name || !name.trim()) {
        return { isValid: false, error: 'Name is required' };
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
        return { isValid: false, error: 'Name must be at least 2 characters long' };
    }

    if (trimmedName.length > 100) {
        return { isValid: false, error: 'Name too long (maximum 100 characters)' };
    }

    const nameRegex = /^[a-zA-ZÀ-ÿĀ-žА-я\s\-'\.]+$/;

    if (!nameRegex.test(trimmedName)) {
        return { isValid: false, error: 'Name can only contain letters, spaces, hyphens and apostrophes' };
    }

    if (trimmedName.match(/\s{2,}/) || trimmedName.match(/[-'\.]{2,}/)) {
        return { isValid: false, error: 'Name cannot have consecutive repeated characters' };
    }

    if (trimmedName.match(/^[-'\.\s]/) || trimmedName.match(/[-'\.\s]$/)) {
        return { isValid: false, error: 'Name cannot start or end with special characters' };
    }

    return { isValid: true };
} 