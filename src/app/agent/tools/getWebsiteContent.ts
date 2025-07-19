import { tool } from 'ai';
import { z } from 'zod';
import { load } from 'cheerio';

async function fetchWebsiteContent(url: string) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second timeout

        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            // Add these for better compatibility
            redirect: 'follow',
            mode: 'cors'
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorResult = {
                url,
                content: '',
                error: `Website not accessible (HTTP ${response.status}: ${response.statusText}). Please check if the address is correct and the site is working.`
            };

            console.log('❌ Website Access Error:', errorResult);
            return errorResult;
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('text/html')) {
            const errorResult = {
                url,
                content: '',
                error: 'The provided URL does not point to a valid web page. Please make sure it is a company website.'
            };

            console.log('❌ Invalid Content Type:', { url, contentType, error: errorResult.error });
            return errorResult;
        }

        const html = await response.text();

        if (!html || html.trim().length === 0) {
            return {
                url,
                content: '',
                error: 'The website is empty or did not return valid content.'
            };
        }

        const $ = load(html);

        // Remove script and style elements
        $('script, style, noscript').remove();

        const body = $('body').text();
        const cleanBody = body.replace(/\s+/g, ' ').trim();

        if (cleanBody.length < 50) {
            const errorResult = {
                url,
                content: cleanBody,
                error: 'The website contains too little content for analysis. Please check if it is a complete corporate website.'
            };

            console.log('❌ Insufficient Content:', { url, contentLength: cleanBody.length, error: errorResult.error });
            return errorResult;
        }

        const result = {
            url,
            content: cleanBody,
        };

        console.log('🌐 Website Content Retrieved:', {
            url: result.url,
            contentLength: result.content.length,
            contentPreview: result.content.substring(0, 200) + '...'
        });

        return result;
    } catch (error) {
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                const errorResult = {
                    url,
                    content: '',
                    error: 'Timeout accessing the website (45s). The site may be very slow or unavailable at the moment.'
                };
                console.log('⏰ Website Timeout:', { url, error: error.message });
                return errorResult;
            }

            if (error.message.includes('Failed to fetch') || error.message.includes('network')) {
                const errorResult = {
                    url,
                    content: '',
                    error: 'Could not connect to the website. Please check if the address is correct and the site is online.'
                };
                console.log('🌐 Network Error:', { url, error: error.message });
                return errorResult;
            }

            const errorResult = {
                url,
                content: '',
                error: `Error accessing the website: ${error.message}. Please check if the address is correct.`
            };
            console.log('❌ Website Error:', { url, error: error.message });
            return errorResult;
        }

        const errorResult = {
            url,
            content: '',
            error: 'Unknown error accessing the website. Please try again or check the address.'
        };
        console.log('❓ Unknown Error:', { url, error });
        return errorResult;
    }
}

export const getWebsiteContent = tool({
    description: 'Get the content of a website',
    parameters: z.object({
        url: z.string().describe('The URL of the website to get the content from'),
    }),
    execute: async ({ url }) => {
        return await fetchWebsiteContent(url);
    },
}); 