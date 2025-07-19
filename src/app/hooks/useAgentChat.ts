import { useChat } from '@ai-sdk/react';
import { useRouter } from 'next/navigation';
import { createResponseHandler } from '../agent/handlers/response-handler';
import { buildAnalysisPrompt } from '../agent/utils/prompt-builder';
import { AnalysisData } from '../agent/types';

export function useAgentChat() {
    const router = useRouter();

    const { append, messages, isLoading } = useChat({
        api: '/api/agent',
        maxSteps: 10,
        onFinish: createResponseHandler({ router })
    });

    const analyzeWebsite = async (data: AnalysisData) => {
        // Store website URL in session storage for async logo loading
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('current_website_url', data.url);

            // Store original user prompt for agent memory
            const userPrompt = `Analyze website: ${data.url} (Contact: ${data.poc}, Email: ${data.email})`;
            sessionStorage.setItem('original_user_prompt', userPrompt);
        }

        const prompt = buildAnalysisPrompt(data);

        console.log('📤 Sending prompt to Agent API:', {
            url: data.url,
            email: data.email,
            poc: data.poc,
            promptLength: prompt.length,
            endpoint: '/api/agent'
        });

        append({ role: 'user', content: prompt });
    };

    return {
        analyzeWebsite,
        messages,
        isLoading
    };
} 