import { tool } from 'ai';
import { z } from 'zod';

interface ProfileData {
    company_name: string;
    service_line: string[];
    company_description: string;
    tier1_keywords: string[];
    tier2_keywords: string[];
    emails: string[];
    poc: string;
    logo_base64?: string;
}

async function redirectToCompanyProfile(profileData: ProfileData) {
    const result = {
        action: 'redirect_to_profile',
        profile_data: profileData
    };

    console.log('🎯 LLM Tool - Redirect to Profile:', {
        action: result.action,
        companyName: profileData.company_name,
        description: profileData.company_description,
        serviceLines: profileData.service_line,
        tier1Keywords: profileData.tier1_keywords,
        tier2Keywords: profileData.tier2_keywords,
        emails: profileData.emails,
        poc: profileData.poc,
        hasLogo: !!profileData.logo_base64,
        fullData: profileData
    });

    return result;
}

export const redirectToProfile = tool({
    description: 'Extract company information from the website and redirect to the company profile page',
    parameters: z.object({
        company_name: z.string().describe('Name of the company.'),
        service_line: z.array(z.string()).max(2).describe('List of core business services or solutions the company provides. Use descriptive names for the company\'s service line, e.g. "Software Development", "Cybersecurity Consulting", "Infrastructure Management".'),
        company_description: z.string().max(240).describe('Brief description of the company (maximum 240 characters).'),
        tier1_keywords: z
            .array(z.string())
            .max(3)
            .describe(
                'Top 3 PRIMARY single words (not phrases) that this company would use to search for government opportunities. Examples: "Software", "Consulting", "Engineering", "Healthcare".',
            ),
        tier2_keywords: z
            .array(z.string())
            .max(3)
            .describe('Top 3 SECONDARY single words (not phrases) for broader government searches. Examples: "Technology", "Services", "Solutions", "Support".'),
        emails: z.array(z.string()).describe('List of emails found on the website.'),
        poc: z.string().describe('Point of Contact name, if available.'),
        logo_base64: z.string().describe('Company logo in base64 format (data URL), if available from getCompanyLogo tool. If the getCompanyLogo tool not returns success: true, send an empty string.'),
    }),
    execute: async (args) => {
        return await redirectToCompanyProfile(args);
    },
}); 