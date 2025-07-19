import { tool } from 'ai';
import { z } from 'zod';

async function returnToHome(errorMessage: string) {
    const result = {
        action: 'refresh_page_with_error',
        error: errorMessage
    };

    console.log('🔄 LLM Tool - Return to Home with Error:', {
        action: result.action,
        errorMessage: errorMessage
    });

    return result;
}

export const returnToHomeWithError = tool({
    description: 'Return to home page with an error message when the website cannot be accessed',
    parameters: z.object({
        error_message: z.string().describe('The error message to display to the user explaining why the website could not be accessed'),
    }),
    execute: async ({ error_message }) => {
        return await returnToHome(error_message);
    },
}); 