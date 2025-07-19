import { Message } from 'ai';

export interface ServiceLineGenerationParams {
    companyProfile: {
        companyName: string;
        description: string;
        serviceLines: string[];
        tier1Keywords: string[];
        tier2Keywords: string[];
    };
    additionalContext: string;
    quantity: number;
    agentMemory: Message[];
}

export class ServiceLineGenerator {
    private readonly apiEndpoint = '/api/agent/service-lines';

    async generateServiceLines({
        companyProfile,
        additionalContext,
        quantity,
        agentMemory
    }: ServiceLineGenerationParams): Promise<string[]> {

        console.log('🔧 ServiceLineGenerator called:', {
            companyName: companyProfile.companyName,
            quantity,
            hasAdditionalContext: !!additionalContext,
            memoryMessages: agentMemory.length,
            endpoint: this.apiEndpoint
        });

        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    companyProfile,
                    additionalContext,
                    quantity,
                    agentMemory
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                throw new Error(`API Error (${response.status}): ${errorData.error || 'Unknown error'}`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to generate service lines');
            }

            const serviceLines = data.serviceLines;

            console.log('✅ ServiceLineGenerator success:', {
                companyName: companyProfile.companyName,
                count: serviceLines.length,
                serviceLines
            });

            return serviceLines;

        } catch (error) {
            console.error('❌ ServiceLineGenerator error:', {
                companyName: companyProfile.companyName,
                error: error instanceof Error ? error.message : 'Unknown error'
            });

            throw new Error(
                error instanceof Error
                    ? `Failed to generate service lines: ${error.message}`
                    : 'Failed to generate service lines'
            );
        }
    }
} 