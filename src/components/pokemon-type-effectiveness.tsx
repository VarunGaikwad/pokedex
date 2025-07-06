'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { CalculateWeaknessesOutput } from '@/ai/flows/calculate-weaknesses';
import { getWeaknesses } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Wand2, Loader2, ShieldAlert, ShieldCheck, ShieldOff } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import TypeBadge from './type-badge';

interface PokemonTypeEffectivenessProps {
  types: string[];
}

export default function PokemonTypeEffectiveness({ types }: PokemonTypeEffectivenessProps) {
  const [isPending, startTransition] = useTransition();
  const [analysis, setAnalysis] = useState<CalculateWeaknessesOutput | null>(null);
  const { toast } = useToast();

  const handleAnalysis = () => {
    startTransition(async () => {
      const result = await getWeaknesses({ types });
      if ('error' in result) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
        setAnalysis(null);
      } else {
        setAnalysis(result);
      }
    });
  };

  const renderContent = () => {
    if (isPending) {
        return <Skeleton className="h-24 w-full" />;
    }
    if (analysis) {
        const { weaknesses4x, weaknesses2x, immunities } = analysis;
        const hasAny = weaknesses4x.length > 0 || weaknesses2x.length > 0 || immunities.length > 0;
        return hasAny ? (
            <div className="space-y-4">
                {weaknesses4x.length > 0 && (
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 flex items-center gap-2 font-bold text-destructive w-28">
                            <ShieldAlert className="h-5 w-5"/>
                            <span>4x Weak</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {weaknesses4x.map(type => <TypeBadge key={type} typeName={type} />)}
                        </div>
                    </div>
                )}
                 {weaknesses2x.length > 0 && (
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 flex items-center gap-2 font-bold text-orange-500 w-28">
                             <ShieldCheck className="h-5 w-5"/>
                            <span>2x Weak</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {weaknesses2x.map(type => <TypeBadge key={type} typeName={type} />)}
                        </div>
                    </div>
                )}
                {immunities.length > 0 && (
                     <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 flex items-center gap-2 font-bold text-muted-foreground w-28">
                            <ShieldOff className="h-5 w-5"/>
                            <span>Immune</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {immunities.map(type => <TypeBadge key={type} typeName={type} />)}
                        </div>
                    </div>
                )}
            </div>
        ) : <p className="text-muted-foreground">This Pokémon has no specific weaknesses or immunities.</p>
    }
    return (
        <div className="text-center text-muted-foreground">
            <p>Click the button to analyze type effectiveness.</p>
        </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <CardTitle className="font-headline">Type Effectiveness</CardTitle>
          <Button onClick={handleAnalysis} disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Analyze with AI
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
