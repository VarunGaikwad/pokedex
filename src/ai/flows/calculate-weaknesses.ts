import { ai } from '@/ai/genkit';
import {
  calculateWeaknesses as analyzeWeaknesses,
  CalculateWeaknessesInputSchema,
  CalculateWeaknessesOutputSchema,
  type CalculateWeaknessesInput,
  type CalculateWeaknessesOutput,
} from '@/lib/pokemon-analysis';

export { CalculateWeaknessesInputSchema, CalculateWeaknessesOutputSchema };
export type { CalculateWeaknessesInput, CalculateWeaknessesOutput };

const calculateWeaknessesTool = ai.defineTool({
  name: 'calculateWeaknessesTool',
  description: "Calculates a Pokémon's type weaknesses based on its types.",
  inputSchema: CalculateWeaknessesInputSchema,
  outputSchema: CalculateWeaknessesOutputSchema,
}, analyzeWeaknesses);

const calculateWeaknessesFlow = ai.defineFlow({
  name: 'calculateWeaknessesFlow',
  inputSchema: CalculateWeaknessesInputSchema,
  outputSchema: CalculateWeaknessesOutputSchema,
}, async (input) => calculateWeaknessesTool(input));

export async function calculateWeaknesses(input: CalculateWeaknessesInput): Promise<CalculateWeaknessesOutput> {
  return calculateWeaknessesFlow(input);
}
