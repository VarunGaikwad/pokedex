'use server';

import {
  categorizeMoves,
  calculateWeaknesses,
  CategorizeMovesInputSchema,
  CalculateWeaknessesInputSchema,
  type CategorizeMovesInput,
  type CategorizeMovesOutput,
  type CalculateWeaknessesInput,
  type CalculateWeaknessesOutput,
} from '@/lib/pokemon-analysis';

export async function getCategorizedMoves(input: CategorizeMovesInput): Promise<CategorizeMovesOutput | { error: string }> {
  try {
    return await categorizeMoves(CategorizeMovesInputSchema.parse(input));
  } catch (e: unknown) {
    console.error("Move categorization failed:", e);
    return { error: "Failed to categorize moves. Please try again later." };
  }
}

export async function getWeaknesses(input: CalculateWeaknessesInput): Promise<CalculateWeaknessesOutput | { error: string }> {
  try {
    return await calculateWeaknesses(CalculateWeaknessesInputSchema.parse(input));
  } catch (e: unknown) {
    console.error("Weakness calculation failed:", e);
    return { error: "Failed to calculate weaknesses. Please try again later." };
  }
}
