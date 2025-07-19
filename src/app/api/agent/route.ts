import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextRequest } from 'next/server';
import { tools } from '../../agent/tools';
import { SYSTEM_PROMPT } from '../../agent/prompts/system-prompt';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
    try {
        const { messages } = await request.json();

        console.log('🚀 Agent API Call Started:', {
            messageCount: messages.length,
            lastMessage: messages[messages.length - 1]?.content?.substring(0, 200) + '...',
            timestamp: new Date().toISOString()
        });

        const result = await streamText({
            model: openai('gpt-4.1-mini'),
            system: SYSTEM_PROMPT,
            messages,
            tools,
        });

        console.log('✅ Agent Stream Text Created:', {
            modelUsed: 'gpt-4.1-mini',
            toolsAvailable: Object.keys(tools),
            timestamp: new Date().toISOString()
        });

        return result.toDataStreamResponse();

    } catch (error) {
        console.error('❌ Agent API error:', error);

        return new Response(
            JSON.stringify({
                error: 'Failed to process agent request'
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
} 