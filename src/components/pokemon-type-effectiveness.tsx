'use server';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CalculateWeaknessesOutput } from '@/ai/flows/calculate-weaknesses';
import { getWeaknesses } from '@/app/actions';
import { ShieldAlert, ShieldCheck, ShieldOff } from 'lucide-react';
import TypeBadge from './type-badge';

interface PokemonTypeEffectivenessProps {
  types: string[];
}

export default async function PokemonTypeEffectiveness({ types }: PokemonTypeEffectivenessProps) {
  const analysisResult = await getWeaknesses({ types });

  const renderContent = () => {
    if ('error' in analysisResult || !analysisResult) {
      return (
        <div className="text-center text-muted-foreground">
          <p>Could not analyze type effectiveness at this time.</p>
        </div>
      );
    }
    
    const analysis: CalculateWeaknessesOutput = analysisResult;
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
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Type Effectiveness</CardTitle>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}