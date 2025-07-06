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

const MoveVersionGroupDetailSchema = z.object({
  level_learned_at: z.number(),
  move_learn_method: z.object({ name: z.string(), url: z.string() }),
  version_group: z.object({ name: z.string(), url: z.string() }),
});

const MoveSchema = z.object({
  move: z.object({ name: z.string(), url: z.string() }),
  version_group_details: z.array(MoveVersionGroupDetailSchema),
});

const CategorizeMovesInputSchema = z.object({
  pokemonName: z.string().describe('The name of the Pokémon.'),
  moves: z.array(MoveSchema).describe("The list of move objects for the Pokémon from PokeAPI."),
});
export type CategorizeMovesInput = z.infer<typeof CategorizeMovesInputSchema>;

const LevelUpMoveSchema = z.object({
    name: z.string(),
    level: z.number(),
});

const CategorizeMovesOutputSchema = z.object({
  "level-up": z.array(LevelUpMoveSchema).describe("Moves learned by leveling up.").optional(),
  "egg": z.array(z.string()).describe("Moves learned by breeding.").optional(),
  "machine": z.array(z.string()).describe("Moves learned by machine (TM/TR).").optional(),
  "tutor": z.array(z.string()).describe("Moves learned from a move tutor.").optional(),
}).describe('A map of move learning methods to the moves learned by that method.');
export type CategorizeMovesOutput = z.infer<typeof CategorizeMovesOutputSchema>;


export async function categorizeMoves(input: CategorizeMovesInput): Promise<CategorizeMovesOutput> {
  return categorizeMovesFlow(input);
}

// In this case, since the data is structured and available from the API,
// we can implement the categorization logic directly in a tool for accuracy and efficiency,
// rather than relying on an LLM to parse it.
const categorizeMovesTool = ai.defineTool({
  name: 'categorizeMovesTool',
  description: 'Categorizes a list of Pokémon moves by how they are learned (level-up, egg, machine, tutor). It also extracts the level for level-up moves.',
  inputSchema: CategorizeMovesInputSchema,
  outputSchema: CategorizeMovesOutputSchema,
}, async (input) => {
  const categorized: {
    "level-up": { name: string; level: number }[];
    "egg": string[];
    "machine": string[];
    "tutor": string[];
    [key: string]: any;
  } = {
    "level-up": [],
    "egg": [],
    "machine": [],
    "tutor": [],
  };

  const LATEST_GAME_VERSION = 'scarlet-violet';

  for (const moveData of input.moves) {
    const moveName = moveData.move.name;
    
    const learnMethods = new Map<string, number>(); // method -> level
    for (const detail of moveData.version_group_details) {
      // Prioritize latest version, but collect all learn methods for that version
      if (detail.version_group.name === LATEST_GAME_VERSION) {
         learnMethods.set(detail.move_learn_method.name, detail.level_learned_at);
      }
    }

    // Fallback if no data for the latest version group is found, check all details
    if (learnMethods.size === 0) {
        for (const detail of moveData.version_group_details) {
            if (!learnMethods.has(detail.move_learn_method.name)) {
                learnMethods.set(detail.move_learn_method.name, detail.level_learned_at);
            }
        }
    }
    
    for (const [method, level] of learnMethods.entries()) {
        if (method === 'level-up') {
            if(level > 0 && !categorized['level-up'].some(m => m.name === moveName)) {
                categorized['level-up'].push({ name: moveName, level: level });
            }
        } else if (method === 'egg') {
             if (!categorized['egg'].includes(moveName)) {
                categorized['egg'].push(moveName);
             }
        } else if (method === 'machine' || method === 'tm') {
            if (!categorized['machine'].includes(moveName)) {
                categorized['machine'].push(moveName);
            }
        } else if (method === 'tutor') {
            if (!categorized['tutor'].includes(moveName)) {
                categorized['tutor'].push(moveName);
            }
        }
    }
  }

  // Sort level-up moves by level, then name
  categorized['level-up'].sort((a, b) => {
      if (a.level !== b.level) {
          return a.level - b.level;
      }
      return a.name.localeCompare(b.name);
  });
  
  // Clean up empty categories and return
  const finalCategorized: CategorizeMovesOutput = {};
  if (categorized['level-up'].length > 0) finalCategorized['level-up'] = categorized['level-up'];
  if (categorized['egg'].length > 0) finalCategorized['egg'] = categorized['egg'].sort();
  if (categorized['machine'].length > 0) finalCategorized['machine'] = categorized['machine'].sort();
  if (categorized['tutor'].length > 0) finalCategorized['tutor'] = categorized['tutor'].sort();

  return finalCategorized;
});

const categorizeMovesFlow = ai.defineFlow(
  {
    name: 'categorizeMovesFlow',
    inputSchema: CategorizeMovesInputSchema,
    outputSchema: CategorizeMovesOutputSchema,
  },
  async input => {
    // The "AI" part of this feature is using a Genkit flow and tool.
    // We directly call our deterministic tool for accuracy and speed.
    const result = await categorizeMovesTool(input);
    return result;
  }
);
