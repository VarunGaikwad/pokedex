'use server';

import { categorizeMoves, CategorizeMovesInput, CategorizeMovesOutput } from "@/ai/flows/categorize-moves";
import { calculateWeaknesses, CalculateWeaknessesInput, CalculateWeaknessesOutput } from "@/ai/flows/calculate-weaknesses";

export async function getCategorizedMoves(input: CategorizeMovesInput): Promise<CategorizeMovesOutput | { error: string }> {
  try {
    const result = await categorizeMoves(input);
    return result;
  } catch (e: any) {
    console.error("AI categorization failed:", e);
    return { error: "Failed to categorize moves. Please try again later." };
  }
}

export async function getWeaknesses(input: CalculateWeaknessesInput): Promise<CalculateWeaknessesOutput | { error: string }> {
  try {
    const result = await calculateWeaknesses(input);
    return result;
  } catch (e: any) {
    console.error("AI weakness calculation failed:", e);
    return { error: "Failed to calculate weaknesses. Please try again later." };
  }
}
