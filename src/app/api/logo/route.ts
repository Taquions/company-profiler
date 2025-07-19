import { NextRequest, NextResponse } from 'next/server';
import { load } from 'cheerio';

interface LogoRequest {
    url: string;
    companyName: string;
}

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

async function getWebsiteContent(url: string): Promise<{ success: true; html: string } | { success: false; error: string }> {
    try {
        console.log('🌐 Fetching website content for logo extraction:', url);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            redirect: 'follow'
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const html = await response.text();
        console.log('✅ Website content fetched successfully for logo extraction');

        return { success: true, html };
    } catch (error) {
        console.log('❌ Website content fetch error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

export async function POST(request: NextRequest) {
    try {
        const { url, companyName }: LogoRequest = await request.json();

        console.log('🚀 Async logo request started:', { url, companyName });

        // First get website content
        const websiteResult = await getWebsiteContent(url);

        if (!websiteResult.success) {
            return NextResponse.json({
                success: false,
                error: `Failed to fetch website: ${websiteResult.error}`
            });
        }

        // Then extract logo
        const logoResult = await extractCompanyLogo(websiteResult.html, url);

        console.log('✅ Async logo request completed:', {
            company: companyName,
            success: logoResult.success,
            error: logoResult.error || 'None'
        });

        return NextResponse.json(logoResult);

    } catch (error) {
        console.error('❌ Logo API Error:', error);
        return NextResponse.json({
            success: false,
            error: 'Internal server error'
        }, { status: 500 });
    }
} 