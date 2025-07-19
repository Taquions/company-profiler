export interface CompanyProfile {
    companyName: string;
    description: string;
    serviceLines: string[];
    tier1Keywords: string[];
    tier2Keywords: string[];
    emails: string[];
    pointOfContact: string;
    logoBase64?: string;
}

export interface ProfileData {
    company_name: string;
    service_line: string[];
    company_description: string;
    tier1_keywords: string[];
    tier2_keywords: string[];
    emails: string[];
    poc: string;
    logo_base64?: string;
}

export interface WebsiteContentResult {
    url: string;
    content: string;
    error?: string;
}

export interface LogoResult {
    success: boolean;
    logoBase64?: string;
    originalUrl?: string;
    contentType?: string;
    error?: string;
}

export interface AnalysisData {
    url: string;
    email: string;
    poc: string;
}

export type AppState = 'welcome' | 'loading'; 