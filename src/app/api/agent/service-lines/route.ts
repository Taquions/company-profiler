import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const ServiceLineRequestSchema = z.object({
    companyProfile: z.object({
        companyName: z.string(),
        description: z.string(),
        serviceLines: z.array(z.string()),
        tier1Keywords: z.array(z.string()),
        tier2Keywords: z.array(z.string())
    }),
    additionalContext: z.string(),
    quantity: z.number().min(1).max(10),
    agentMemory: z.array(z.object({
        id: z.string(),
        role: z.enum(['user', 'assistant']),
        content: z.string()
    }))
});

const SERVICE_LINE_SYSTEM_PROMPT = `You are a specialized AI agent designed to analyze company websites and extract structured business information to create comprehensive company profiles. Your primary function is to help users understand companies and their potential for government contracting opportunities.

When a user asks to generate new service lines for their company profile, analyze the existing company information and generate relevant service lines that complement the existing ones.

Focus on generating service lines that:
- Are specific and relevant to the company's business
- Complement existing service lines without duplication
- Consider government contracting opportunities
- Align with the company's tier 1 and tier 2 keywords
- Are professionally worded and clear

Always respond with only the requested JSON format containing the service lines array.`;

export const maxDuration = 60;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { companyProfile, additionalContext, quantity, agentMemory } = ServiceLineRequestSchema.parse(body);

        console.log('🔧 Agent Service Lines API called:', {
            companyName: companyProfile.companyName,
            quantity,
            hasAdditionalContext: !!additionalContext,
            memoryMessages: agentMemory.length
        });

        const userPrompt = `Based on the company profile you have already analyzed, generate ${quantity} new service line that would complement the past one you have generated.

Services line generated: ${companyProfile.serviceLines.join(', ')}

${additionalContext ? `Additional Context: ${additionalContext}` : ''}

Please respond with ONLY a JSON object in this exact format:
{
  "service_lines": ["Service Line 1", "Service Line 2"]
}

Generate exactly ${quantity} service line(s). Make them specific and relevant to the company's business. Consider our previous conversation to avoid repetition and build upon previous suggestions.`;

        const messages = [
            {
                role: 'system' as const,
                content: SERVICE_LINE_SYSTEM_PROMPT
            },
            ...agentMemory.slice(-4).map(msg => ({
                role: msg.role,
                content: msg.content
            })),
            {
                role: 'user' as const,
                content: userPrompt
            }
        ];

        const result = await generateObject({
            model: openai('gpt-4.1-mini'),
            messages,
            temperature: 0.3,
            schema: z.object({
                service_lines: z.array(z.string())
            }),
            schemaDescription: 'An array of company service lines'
        });

        const serviceLines = result.object.service_lines;

        console.log('✅ Agent Service Lines generated successfully:', {
            companyName: companyProfile.companyName,
            count: serviceLines.length,
            serviceLines
        });

        return NextResponse.json({
            success: true,
            serviceLines
        });

    } catch (error) {
        console.error('❌ Agent Service Lines API error:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid request data',
                    details: error.errors
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to generate service lines'
            },
            { status: 500 }
        );
    }
} 