'use server';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import type { CategorizeMovesOutput } from '@/ai/flows/categorize-moves';
import { getCategorizedMoves } from '@/app/actions';
import TypeBadge from './type-badge';

interface PokemonMovesProps {
  pokemonName: string;
  moves: any[];
}

const MovesTable = ({ moves, hasLevel }: { moves: CategorizeMovesOutput[keyof CategorizeMovesOutput], hasLevel: boolean }) => {
    if (!moves || moves.length === 0) {
        return <p className="text-muted-foreground p-4 text-center">No moves in this category.</p>
    }

    return (
        <div className="w-full overflow-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {hasLevel && <TableHead className="w-[50px] font-bold">Lv.</TableHead>}
                  <TableHead className="font-bold">Move</TableHead>
                  <TableHead className="font-bold">Type</TableHead>
                  <TableHead className="font-bold">Cat.</TableHead>
                  <TableHead className="text-right font-bold">Power</TableHead>
                  <TableHead className="text-right font-bold">Acc.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {moves.map((move) => (
                  <TableRow key={move.name}>
                    {hasLevel && <TableCell className="font-medium">{move.level}</TableCell>}
                    <TableCell className="capitalize font-medium">{move.name.replace('-', ' ')}</TableCell>
                    <TableCell><TypeBadge typeName={move.type} /></TableCell>
                    <TableCell className="capitalize">{move.category}</TableCell>
                    <TableCell className="text-right font-mono">{move.power ?? '—'}</TableCell>
                    <TableCell className="text-right font-mono">{move.accuracy ?? '—'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </div>
    );
};


export default async function PokemonMoves({ pokemonName, moves }: PokemonMovesProps) {
  const categorizedMovesResult = await getCategorizedMoves({ pokemonName, moves });

  const renderCategorizedMoves = () => {
    if ('error' in categorizedMovesResult || !categorizedMovesResult || Object.keys(categorizedMovesResult).length === 0) {
      return (
         <div className="text-center text-muted-foreground">
            <p>Could not load move details.</p>
          </div>
      );
    }
    
    const categorizedMoves: CategorizeMovesOutput = categorizedMovesResult;
    const learnMethods = ['level-up', 'machine', 'egg', 'tutor'];
    
    const defaultTab = learnMethods.find(method => categorizedMoves[method as keyof typeof categorizedMoves]?.length);

    if (!defaultTab) {
        return (
            <div className="text-center text-muted-foreground">
                <p>This Pokémon has no learnable moves to display.</p>
            </div>
        );
    }

    return (
        <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-4">
                {learnMethods.map(method => {
                    const moveList = categorizedMoves[method as keyof typeof categorizedMoves];
                    const count = moveList?.length ?? 0;
                    return (
                        <TabsTrigger key={method} value={method} disabled={count === 0} className="capitalize">
                            {method.replace('-', ' ')} ({count})
                        </TabsTrigger>
                    );
                })}
            </TabsList>
            {learnMethods.map(method => {
                 const moveList = categorizedMoves[method as keyof typeof categorizedMoves];
                 return (
                    <TabsContent key={method} value={method} className="mt-0">
                        <MovesTable moves={moveList} hasLevel={method === 'level-up'} />
                    </TabsContent>
                 );
            })}
        </Tabs>
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
