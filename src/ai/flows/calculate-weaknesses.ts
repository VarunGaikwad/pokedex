'use server';

/**
 * @fileOverview This file defines a Genkit flow to calculate a Pokémon's type weaknesses.
 *
 * - calculateWeaknesses - A function that calculates weaknesses for a given set of Pokémon types.
 * - CalculateWeaknessesInput - The input type for the calculateWeaknesses function.
 * - CalculateWeaknessesOutput - The return type for the calculateWeaknesses function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getTypeData } from '@/lib/pokeapi';

const ALL_TYPES = [ "normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"];

export const CalculateWeaknessesInputSchema = z.object({
  types: z.array(z.string()).describe("An array of the Pokémon's type names."),
});
export type CalculateWeaknessesInput = z.infer<typeof CalculateWeaknessesInputSchema>;

export const CalculateWeaknessesOutputSchema = z.object({
  weaknesses4x: z.array(z.string()).describe('Types that deal 4x damage.'),
  weaknesses2x: z.array(z.string()).describe('Types that deal 2x damage.'),
  immunities: z.array(z.string()).describe('Types that deal 0x damage.'),
}).describe("A Pokémon's type weaknesses and immunities.");
export type CalculateWeaknessesOutput = z.infer<typeof CalculateWeaknessesOutputSchema>;

export async function calculateWeaknesses(input: CalculateWeaknessesInput): Promise<CalculateWeaknessesOutput> {
  return calculateWeaknessesFlow(input);
}

const calculateWeaknessesTool = ai.defineTool({
  name: 'calculateWeaknessesTool',
  description: "Calculates a Pokémon's type weaknesses based on its types.",
  inputSchema: CalculateWeaknessesInputSchema,
  outputSchema: CalculateWeaknessesOutputSchema,
}, async ({ types }) => {
    if (types.length === 0) {
        return { weaknesses4x: [], weaknesses2x: [], immunities: [] };
    }

    const damageRelations = await Promise.all(types.map(type => getTypeData(type)));

    const multipliers: { [type: string]: number } = {};
    for (const type of ALL_TYPES) {
        multipliers[type] = 1;
    }

    for (const relation of damageRelations) {
        relation.double_damage_from.forEach((t: { name: string }) => multipliers[t.name] *= 2);
        relation.half_damage_from.forEach((t: { name: string }) => multipliers[t.name] *= 0.5);
        relation.no_damage_from.forEach((t: { name: string }) => multipliers[t.name] *= 0);
    }
    
    const weaknesses4x: string[] = [];
    const weaknesses2x: string[] = [];
    const immunities: string[] = [];

    for (const type of ALL_TYPES) {
        if (multipliers[type] === 4) weaknesses4x.push(type);
        if (multipliers[type] === 2) weaknesses2x.push(type);
        if (multipliers[type] === 0) immunities.push(type);
    }

    return { weaknesses4x, weaknesses2x, immunities };
});


const calculateWeaknessesFlow = ai.defineFlow(
  {
    name: 'calculateWeaknessesFlow',
    inputSchema: CalculateWeaknessesInputSchema,
    outputSchema: CalculateWeaknessesOutputSchema,
  },
  async (input) => {
    return calculateWeaknessesTool(input);
  }
);
