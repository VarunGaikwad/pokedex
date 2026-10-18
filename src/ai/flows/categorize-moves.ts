import { ai } from '@/ai/genkit';
import {
  categorizeMoves as analyzeMoves,
  CategorizeMovesInputSchema,
  CategorizeMovesOutputSchema,
  type CategorizeMovesInput,
  type CategorizeMovesOutput,
} from '@/lib/pokemon-analysis';

export { CategorizeMovesInputSchema, CategorizeMovesOutputSchema };
export type { CategorizeMovesInput, CategorizeMovesOutput };

const categorizeMovesTool = ai.defineTool({
  name: 'categorizeMovesTool',
  description: 'Categorizes Pokémon moves by how they are learned and fetches their type, power, and accuracy.',
  inputSchema: CategorizeMovesInputSchema,
  outputSchema: CategorizeMovesOutputSchema,
}, analyzeMoves);

const categorizeMovesFlow = ai.defineFlow({
  name: 'categorizeMovesFlow',
  inputSchema: CategorizeMovesInputSchema,
  outputSchema: CategorizeMovesOutputSchema,
}, async (input) => categorizeMovesTool(input));

export async function categorizeMoves(input: CategorizeMovesInput): Promise<CategorizeMovesOutput> {
  return categorizeMovesFlow(input);
}
