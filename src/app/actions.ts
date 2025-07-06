'use server';

import { categorizeMoves, CategorizeMovesInput, CategorizeMovesOutput } from "@/ai/flows/categorize-moves";

export async function getCategorizedMoves(input: CategorizeMovesInput): Promise<CategorizeMovesOutput | { error: string }> {
  try {
    const result = await categorizeMoves(input);
    return result;
  } catch (e: any) {
    console.error("AI categorization failed:", e);
    return { error: "Failed to categorize moves. Please try again later." };
  }
}
