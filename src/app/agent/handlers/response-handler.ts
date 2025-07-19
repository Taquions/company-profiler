import { Message } from 'ai';
import { useRouter } from 'next/navigation';

interface UseAgentResponseHandlerProps {
    router: ReturnType<typeof useRouter>;
}

export function createResponseHandler({ router }: UseAgentResponseHandlerProps) {
    return (message: Message) => {
        console.log('🎬 LLM Chat onFinish called:', {
            messageId: message.id,
            role: message.role,
            createdAt: message.createdAt,
            partsCount: message.parts?.length || 0,
            fullMessage: message
        });

        try {
            if (!message.parts) {
                console.log('❌ No parts in message');
                throw new Error('No parts in message');
            }

            // Extract text content for agent summary
            let agentSummary = '';
            let hasRedirectTool = false;

            // Check for tool invocations and text content
            for (const part of message.parts) {
                if (part.type === 'text') {
                    agentSummary += part.text + '\n';
                }

                if (part.type === 'tool-invocation') {
                    const toolName = part.toolInvocation.toolName;

                    console.log('🔧 Tool Invocation Found:', {
                        toolName,
                        args: part.toolInvocation.args,
                        toolCallId: part.toolInvocation.toolCallId
                    });

                    if (toolName === 'returnToHomeWithError') {
                        const errorMessage = part.toolInvocation.args.error_message;
                        console.log('🔄 Redirecting to home with error:', errorMessage);
                        window.location.href = `/?error=${encodeURIComponent(errorMessage)}`;
                        return;
                    }

                    if (toolName === 'redirectToProfile') {
                        const profileData = part.toolInvocation.args;
                        hasRedirectTool = true;

                        console.log('📊 Redirecting to profile with data:', profileData);

                        // Save agent conversation to sessionStorage
                        if (typeof window !== 'undefined') {
                            try {
                                // Get original user prompt from sessionStorage
                                const originalPrompt = sessionStorage.getItem('original_user_prompt') || 'Analyze company website';

                                const agentConversation = {
                                    userMessage: {
                                        id: Date.now().toString(),
                                        role: 'user',
                                        content: originalPrompt
                                    },
                                    assistantMessage: {
                                        id: (Date.now() + 1).toString(),
                                        role: 'assistant',
                                        content: agentSummary.trim() || `Análise concluída para ${profileData.company_name}. Identifiquei informações sobre a empresa incluindo: nome da empresa, descrição do negócio, linhas de serviço, palavras-chave relevantes para contratos governamentais, e informações de contato. A empresa foi categorizada com base em seus serviços principais e potencial para oportunidades de contratação governamental.`
                                    }
                                };

                                sessionStorage.setItem('agent_conversation', JSON.stringify(agentConversation));
                                console.log('💾 Agent conversation saved to sessionStorage:', agentConversation);
                            } catch (error) {
                                console.warn('⚠️ Failed to save agent conversation:', error);
                            }
                        }

                        const profileParams = new URLSearchParams({
                            data: JSON.stringify(profileData)
                        });
                        router.push(`/profile?${profileParams.toString()}`);
                        return;
                    }
                }
            }

            // If we have text content but no redirect tool, it might be an error case
            if (agentSummary && !hasRedirectTool) {
                console.log('📝 Agent provided summary without redirect:', agentSummary);
            }

        } catch (error) {
            console.error('❌ Error parsing AI response:', error);
            console.log('🔍 Full error details:', {
                error,
                message: message,
                stack: error instanceof Error ? error.stack : 'No stack'
            });
            window.location.href = '/?error=' + encodeURIComponent('Error processing analysis response.');
        }
    };
} 