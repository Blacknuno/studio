// src/ai/flows/suggest-protocol-configuration.ts
'use server';

/**
 * @fileOverview Provides AI-powered suggestions for optimal protocol configurations based on network conditions.
 *
 * - suggestProtocolConfiguration - A function that suggests protocol configurations.
 * - SuggestProtocolConfigurationInput - The input type for the suggestProtocolConfiguration function.
 * - SuggestProtocolConfigurationOutput - The return type for the suggestProtocolConfiguration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestProtocolConfigurationInputSchema = z.object({
  networkConditions: z
    .string()
    .describe(
      'Description of the current network conditions, including bandwidth, latency, and security requirements.'
    ),
  supportedProtocols: z
    .array(z.string())
    .describe('List of protocols supported by the system (e.g., OpenVPN, WireGuard, Xray, Sing-box).'),
});
export type SuggestProtocolConfigurationInput = z.infer<typeof SuggestProtocolConfigurationInputSchema>;

const SuggestProtocolConfigurationOutputSchema = z.object({
  suggestedConfiguration: z
    .string()
    .describe(
      'AI-powered suggestion for the optimal protocol configuration based on the input network conditions.'
    ),
  reasoning: z
    .string()
    .describe('Explanation of why the suggested configuration is optimal for the given conditions.'),
});
export type SuggestProtocolConfigurationOutput = z.infer<typeof SuggestProtocolConfigurationOutputSchema>;

export async function suggestProtocolConfiguration(
  input: SuggestProtocolConfigurationInput
): Promise<SuggestProtocolConfigurationOutput> {
  return suggestProtocolConfigurationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestProtocolConfigurationPrompt',
  input: {schema: SuggestProtocolConfigurationInputSchema},
  output: {schema: SuggestProtocolConfigurationOutputSchema},
  prompt: `You are an AI expert in network protocol configuration.

  Based on the provided network conditions and supported protocols, suggest an optimal protocol configuration and explain your reasoning.

  Network Conditions: {{{networkConditions}}}
  Supported Protocols: {{#each supportedProtocols}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  `,
});

const suggestProtocolConfigurationFlow = ai.defineFlow(
  {
    name: 'suggestProtocolConfigurationFlow',
    inputSchema: SuggestProtocolConfigurationInputSchema,
    outputSchema: SuggestProtocolConfigurationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
