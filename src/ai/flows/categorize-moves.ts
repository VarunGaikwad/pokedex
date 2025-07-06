'use server';

/**
 * @fileOverview This file defines a Genkit flow to categorize a Pokémon's moves by how they are learned.
 *
 * - categorizeMoves - A function that categorizes a Pokémon's moves.
 * - CategorizeMovesInput - The input type for the categorizeMoves function.
 * - CategorizeMovesOutput - The return type for the categorizeMoves function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeMovesInputSchema = z.object({
  pokemonName: z.string().describe('The name of the Pokémon.'),
  moves: z.array(z.string()).describe('The list of moves for the Pokémon.'),
});
export type CategorizeMovesInput = z.infer<typeof CategorizeMovesInputSchema>;

const CategorizeMovesOutputSchema = z.record(z.string(), z.array(z.string())).describe('A map of move learning methods to the moves learned by that method.');
export type CategorizeMovesOutput = z.infer<typeof CategorizeMovesOutputSchema>;

export async function categorizeMoves(input: CategorizeMovesInput): Promise<CategorizeMovesOutput> {
  return categorizeMovesFlow(input);
}

const categorizeMovesTool = ai.defineTool({
  name: 'categorizeMovesTool',
  description: 'Categorizes a list of Pokémon moves by how they are learned (level-up, TM, etc.).',
  inputSchema: z.object({
    pokemonName: z.string().describe('The name of the Pokémon.'),
    moves: z.array(z.string()).describe('The list of moves for the Pokémon.'),
  }),
  outputSchema: CategorizeMovesOutputSchema,
}, async (input) => {
  // This is a placeholder implementation; replace with actual categorization logic.
  const categorizedMoves: CategorizeMovesOutput = {};
  for (const move of input.moves) {
    // Mock categorization logic (replace with actual AI-driven categorization)
    const method = Math.random() > 0.5 ? 'level-up' : 'TM';
    if (!categorizedMoves[method]) {
      categorizedMoves[method] = [];
    }
    categorizedMoves[method]!.push(move);
  }
  return categorizedMoves;
});

const categorizeMovesPrompt = ai.definePrompt({
  name: 'categorizeMovesPrompt',
  tools: [categorizeMovesTool],
  input: {
    schema: CategorizeMovesInputSchema,
  },
  prompt: `Categorize the following moves for {{pokemonName}} by how they are learned (level-up, TM, etc.).

Moves: {{moves}}

Use the categorizeMovesTool to categorize the moves.`,
});

const categorizeMovesFlow = ai.defineFlow(
  {
    name: 'categorizeMovesFlow',
    inputSchema: CategorizeMovesInputSchema,
    outputSchema: CategorizeMovesOutputSchema,
  },
  async input => {
    const {output} = await categorizeMovesPrompt(input);
    // The tool returns the categorized moves object directly
    return output!.categorizeMovesTool;
  }
);
