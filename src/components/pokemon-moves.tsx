'use server';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { CategorizeMovesOutput } from '@/ai/flows/categorize-moves';
import { getCategorizedMoves } from '@/app/actions';

interface PokemonMovesProps {
  pokemonName: string;
  moves: any[];
}

export default async function PokemonMoves({ pokemonName, moves }: PokemonMovesProps) {
  const categorizedMovesResult = await getCategorizedMoves({ pokemonName, moves });

  const renderCategorizedMoves = () => {
    if ('error' in categorizedMovesResult || !categorizedMovesResult || Object.keys(categorizedMovesResult).length === 0) {
      return (
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {moves.map(move => move.move.name).sort().map(moveName => (
              <div key={moveName} className="bg-muted p-2 rounded-md text-sm text-center capitalize truncate">
                {moveName.replace('-', ' ')}
              </div>
            ))}
          </div>
      );
    }
    
    const categorizedMoves: CategorizeMovesOutput = categorizedMovesResult;
    const moveCategories = Object.entries(categorizedMoves);

    return (
      <Accordion type="single" collapsible className="w-full" defaultValue="level-up">
        {moveCategories.sort(([a], [b]) => a.localeCompare(b)).map(([method, moveList]) => (
          <AccordionItem value={method} key={method}>
            <AccordionTrigger className="text-lg capitalize">{method.replace('-', ' ')} ({moveList.length})</AccordionTrigger>
            <AccordionContent>
              {method === 'level-up' && Array.isArray(moveList) ? (
                <div className="space-y-2">
                  {(moveList as {name: string, level: number}[]).map((move) => (
                    <div key={move.name} className="flex justify-between items-center bg-muted p-2 rounded-md text-sm capitalize">
                      <span>{move.name.replace('-', ' ')}</span>
                      <span className="font-bold text-primary">Lvl {move.level}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {Array.isArray(moveList) && moveList.map((move: string) => (
                    <div key={move} className="bg-muted p-2 rounded-md text-sm text-center capitalize">
                      {move.replace('-', ' ')}
                    </div>
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Learnable Moves</CardTitle>
      </CardHeader>
      <CardContent>
        {renderCategorizedMoves()}
      </CardContent>
    </Card>
  );
}