'use server';

/**
 * @fileOverview This file defines a Genkit flow to categorize a Pokémon's moves by how they are learned,
 * and fetch detailed information for each move.
 *
 * - categorizeMoves - A function that categorizes a Pokémon's moves.
 * - CategorizeMovesInput - The input type for the categorizeMoves function.
 * - CategorizeMovesOutput - The return type for the categorizeMoves function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { getMoveDetails } from '@/lib/pokeapi';

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

const MoveDetailSchema = z.object({
    name: z.string(),
    level: z.number().optional(),
    type: z.string(),
    category: z.string().describe("e.g., physical, special, status"),
    power: z.number().nullable(),
    accuracy: z.number().nullable(),
});

const CategorizeMovesOutputSchema = z.object({
  "level-up": z.array(MoveDetailSchema).describe("Moves learned by leveling up.").optional(),
  "egg": z.array(MoveDetailSchema).describe("Moves learned by breeding.").optional(),
  "machine": z.array(MoveDetailSchema).describe("Moves learned by machine (TM/TR).").optional(),
  "tutor": z.array(MoveDetailSchema).describe("Moves learned from a move tutor.").optional(),
}).describe('A map of move learning methods to the moves learned by that method, with full details.');
export type CategorizeMovesOutput = z.infer<typeof CategorizeMovesOutputSchema>;


export async function categorizeMoves(input: CategorizeMovesInput): Promise<CategorizeMovesOutput> {
  return categorizeMovesFlow(input);
}

const categorizeMovesTool = ai.defineTool({
  name: 'categorizeMovesTool',
  description: 'Categorizes a list of Pokémon moves by how they are learned (level-up, egg, machine, tutor) and fetches detailed information for each move like type, power, and accuracy.',
  inputSchema: CategorizeMovesInputSchema,
  outputSchema: CategorizeMovesOutputSchema,
}, async (input) => {
    const moveDetailsPromises = input.moves.map(moveData => 
        getMoveDetails(moveData.move.url).then(details => ({
            name: moveData.move.name,
            details,
        }))
    );
    const moveDetailsResults = await Promise.all(moveDetailsPromises);

    const moveDetailsMap = new Map();
    for (const result of moveDetailsResults) {
        if (result.details) {
            moveDetailsMap.set(result.name, result.details);
        }
    }

  const categorized: {
    "level-up": z.infer<typeof MoveDetailSchema>[];
    "egg": z.infer<typeof MoveDetailSchema>[];
    "machine": z.infer<typeof MoveDetailSchema>[];
    "tutor": z.infer<typeof MoveDetailSchema>[];
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
    const details = moveDetailsMap.get(moveName);
    if (!details) continue;
    
    const learnMethods = new Map<string, number>(); // method -> level
    for (const detail of moveData.version_group_details) {
      if (detail.version_group.name === LATEST_GAME_VERSION) {
         learnMethods.set(detail.move_learn_method.name, detail.level_learned_at);
      }
    }

    if (learnMethods.size === 0) {
        for (const detail of moveData.version_group_details) {
            if (!learnMethods.has(detail.move_learn_method.name)) {
                learnMethods.set(detail.move_learn_method.name, detail.level_learned_at);
            }
        }
    }
    
    for (const [method, level] of learnMethods.entries()) {
        const moveDetail = {
            name: moveName,
            type: details.type.name,
            category: details.damage_class.name,
            power: details.power,
            accuracy: details.accuracy,
        };

        if (method === 'level-up') {
            if(level > 0 && !categorized['level-up'].some(m => m.name === moveName)) {
                categorized['level-up'].push({ ...moveDetail, level: level });
            }
        } else if (method === 'egg') {
             if (!categorized['egg'].some(m => m.name === moveName)) {
                categorized['egg'].push(moveDetail);
             }
        } else if (method === 'machine' || method === 'tm') {
            if (!categorized['machine'].some(m => m.name === moveName)) {
                categorized['machine'].push(moveDetail);
            }
        } else if (method === 'tutor') {
            if (!categorized['tutor'].some(m => m.name === moveName)) {
                categorized['tutor'].push(moveDetail);
            }
        }
    }
  }

  categorized['level-up'].sort((a, b) => {
      if (a.level! !== b.level!) {
          return a.level! - b.level!;
      }
      return a.name.localeCompare(b.name);
  });
  
  const finalCategorized: CategorizeMovesOutput = {};
  if (categorized['level-up'].length > 0) finalCategorized['level-up'] = categorized['level-up'];
  if (categorized['egg'].length > 0) finalCategorized['egg'] = categorized['egg'].sort((a,b) => a.name.localeCompare(b.name));
  if (categorized['machine'].length > 0) finalCategorized['machine'] = categorized['machine'].sort((a,b) => a.name.localeCompare(b.name));
  if (categorized['tutor'].length > 0) finalCategorized['tutor'] = categorized['tutor'].sort((a,b) => a.name.localeCompare(b.name));

  return finalCategorized;
});

const categorizeMovesFlow = ai.defineFlow(
  {
    name: 'categorizeMovesFlow',
    inputSchema: CategorizeMovesInputSchema,
    outputSchema: CategorizeMovesOutputSchema,
  },
  async input => {
    const result = await categorizeMovesTool(input);
    return result;
  }
);
