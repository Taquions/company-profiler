import { tool } from 'ai';
import { z } from 'zod';
import { load } from 'cheerio';

async function extractCompanyLogo(html: string, baseUrl: string) {
    try {
        console.log('🎨 Getting company logo from HTML content for:', baseUrl);

        const $ = load(html);

        // Look for favicon and icon links in order of preference
        const iconSelectors = [
            'link[rel="icon"][type="image/svg+xml"]',
            'link[rel="icon"][type="image/png"]',
            'link[rel="shortcut icon"]',
            'link[rel="icon"]',
            'link[rel="apple-touch-icon"]',
            'link[rel="apple-touch-icon-precomposed"]'
        ];

        let iconUrl = null;

        for (const selector of iconSelectors) {
            const element = $(selector).first();
            if (element.length > 0) {
                iconUrl = element.attr('href');
                if (iconUrl) {
                    console.log(`🎯 Found icon with selector: ${selector}, url: ${iconUrl}`);
                    break;
                }
            }
        }

        // If no icon found in meta tags, try default favicon.ico
        if (!iconUrl) {
            iconUrl = '/favicon.ico';
            console.log('🔍 No icon meta tags found, trying default favicon.ico');
        }

        // Convert relative URLs to absolute
        const baseUrlObject = new URL(baseUrl);
        const absoluteIconUrl = iconUrl.startsWith('http')
            ? iconUrl
            : new URL(iconUrl, baseUrlObject.origin).toString();

        console.log('📸 Fetching logo from:', absoluteIconUrl);

        // Download the icon
        const iconController = new AbortController();
        const iconTimeoutId = setTimeout(() => iconController.abort(), 15000);

        const iconResponse = await fetch(absoluteIconUrl, {
            signal: iconController.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            redirect: 'follow',
            mode: 'cors'
        });

        clearTimeout(iconTimeoutId);

        if (!iconResponse.ok) {
            return {
                success: false,
                error: `Icon not accessible: HTTP ${iconResponse.status} from ${absoluteIconUrl}`
            };
        }

        const contentType = iconResponse.headers.get('content-type');
        if (!contentType || !contentType.startsWith('image/')) {
            return {
                success: false,
                error: `Invalid image type: ${contentType} from ${absoluteIconUrl}`
            };
        }

        // Convert to base64 for localStorage storage
        const arrayBuffer = await iconResponse.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const dataUrl = `data:${contentType};base64,${base64}`;

        console.log('✅ Logo successfully retrieved for localStorage:', {
            url: absoluteIconUrl,
            contentType,
            sizeKB: Math.round(arrayBuffer.byteLength / 1024)
        });

        return {
            success: true,
            logoBase64: dataUrl,
            originalUrl: absoluteIconUrl,
            contentType
        };

    } catch (error) {
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                return {
                    success: false,
                    error: 'Timeout getting company logo (15s)'
                };
            }
            console.log('❌ Logo Error:', error.message);
            return {
                success: false,
                error: `Error getting logo: ${error.message}`
            };
        }

        return {
            success: false,
            error: 'Unknown error getting company logo'
        };
    }
}

export const getCompanyLogo = tool({
    description: 'Extract company logo/favicon from HTML content and return it as base64 for localStorage storage. Requires HTML from getWebsiteContent tool.',
    parameters: z.object({
        html: z.string().describe('HTML content from getWebsiteContent tool'),
        url: z.string().describe('Base URL of the website for resolving relative icon paths'),
    }),
    execute: async ({ html, url }) => {
        return await extractCompanyLogo(html, url);
    },
}); 