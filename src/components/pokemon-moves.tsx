'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { CategorizeMovesOutput } from '@/ai/flows/categorize-moves';
import { getCategorizedMoves } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Wand2, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface PokemonMovesProps {
  pokemonName: string;
  moves: any[];
}

export default function PokemonMoves({ pokemonName, moves }: PokemonMovesProps) {
  const [isPending, startTransition] = useTransition();
  const [categorizedMoves, setCategorizedMoves] = useState<CategorizeMovesOutput | null>(null);
  const { toast } = useToast();

  const handleCategorize = () => {
    startTransition(async () => {
      const result = await getCategorizedMoves({ pokemonName, moves });
      if ('error' in result) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
        setCategorizedMoves(null);
      } else {
        setCategorizedMoves(result);
      }
    });
  };

  const renderCategorizedMoves = () => {
    if (!categorizedMoves || Object.keys(categorizedMoves).length === 0) {
      return <p className="text-muted-foreground">Could not categorize moves.</p>;
    }

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
        <div className="flex flex-wrap items-center justify-between gap-4">
          <CardTitle className="font-headline">Learnable Moves</CardTitle>
          <Button onClick={handleCategorize} disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Categorize with AI
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
          </div>
        ) : categorizedMoves ? (
          renderCategorizedMoves()
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {moves.map(move => move.move.name).sort().map(moveName => (
              <div key={moveName} className="bg-muted p-2 rounded-md text-sm text-center capitalize truncate">
                {moveName.replace('-', ' ')}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
