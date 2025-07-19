import { AnalysisData } from '../types';

export function buildAnalysisPrompt(data: AnalysisData): string {
    return `Please analyze the website ${data.url} and extract comprehensive company information. Use the getWebsiteContent tool to retrieve the website content first, then use the redirectToProfile tool to redirect to the profile page with the extracted data:

- company_name: The official company name
- company_description: A brief description of what the company does
- service_line: Array of services the company provides
- tier1_keywords: Primary keywords this company would use to search for government opportunities
- tier2_keywords: Secondary keywords for government contracting
- emails: Use only this email: [${data.email}]
- poc: Use this contact name: ${data.poc}

Please ensure you use the redirectToProfile tool to redirect to the profile page with the extracted information.`;
}

export function buildServiceLinePrompt(
    companyProfile: { companyName: string; description: string; serviceLines: string[]; tier1Keywords: string[]; tier2Keywords: string[] },
    additionalContext: string,
    quantity: number
): string {
    return `I need you to generate ${quantity} new service lines for my company. Please analyze the company profile below and suggest relevant service lines that would complement our existing offerings.

**Company Information:**
- Company Name: ${companyProfile.companyName}
- Description: ${companyProfile.description}
- Current Service Lines: ${companyProfile.serviceLines.join(', ')}
- Tier 1 Keywords: ${companyProfile.tier1Keywords.join(', ')}
- Tier 2 Keywords: ${companyProfile.tier2Keywords.join(', ')}
${additionalContext ? `- Additional Context: ${additionalContext}` : ''}

**Requirements:**
- Generate exactly ${quantity} new service lines
- Avoid duplicating existing service lines
- Make them relevant to the company's business profile
- Focus on professional services that could realistically be offered
- Consider government contracting opportunities

Please respond with ONLY a JSON array of strings, no other text. Example format:
["Service Line 1", "Service Line 2", "Service Line 3"]`;
} 