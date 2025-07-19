import { useState } from 'react';
import { Message } from 'ai';
import { ServiceLineGenerator, ServiceLineGenerationParams } from '../agent/services/service-line-generator';
import { CompanyProfile } from '../agent/types';

export function useServiceLineGeneration() {
    const [isGenerating, setIsGenerating] = useState(false);
    const serviceLineGenerator = new ServiceLineGenerator();

    const generateServiceLines = async (
        companyProfile: CompanyProfile,
        additionalContext: string,
        quantity: number,
        agentMemory: Message[]
    ): Promise<string[]> => {
        setIsGenerating(true);

        try {
            const params: ServiceLineGenerationParams = {
                companyProfile: {
                    companyName: companyProfile.companyName,
                    description: companyProfile.description,
                    serviceLines: companyProfile.serviceLines,
                    tier1Keywords: companyProfile.tier1Keywords,
                    tier2Keywords: companyProfile.tier2Keywords
                },
                additionalContext,
                quantity,
                agentMemory
            };

            const generatedServiceLines = await serviceLineGenerator.generateServiceLines(params);

            const uniqueServiceLines = generatedServiceLines.filter(line =>
                !companyProfile.serviceLines.includes(line)
            );

            console.log('✅ Service lines generated successfully:', {
                total: uniqueServiceLines.length,
                serviceLines: uniqueServiceLines
            });

            return uniqueServiceLines;
        } catch (error) {
            console.error('Error generating service lines:', error);
            throw error;
        } finally {
            setIsGenerating(false);
        }
    };

    return {
        generateServiceLines,
        isGenerating
    };
} 