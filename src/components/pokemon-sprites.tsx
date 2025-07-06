'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface PokemonSpritesProps {
  name: string;
  sprites: {
    front_default: string | null;
    front_shiny: string | null;
    other?: {
        'official-artwork'?: {
            front_default: string | null;
            front_shiny: string | null;
        };
        home?: {
            front_default: string | null;
            front_shiny: string | null;
        };
    }
  };
}

export default function PokemonSprites({ name, sprites }: PokemonSpritesProps) {
  const [isShiny, setIsShiny] = useState(false);
  const [is3D, setIs3D] = useState(false);
  
  const officialArt = isShiny 
    ? sprites.other?.['official-artwork']?.front_shiny 
    : sprites.other?.['official-artwork']?.front_default;
  
  const homeSprite = isShiny 
    ? sprites.other?.home?.front_shiny 
    : sprites.other?.home?.front_default;

  const smallSprite = isShiny ? sprites.front_shiny : sprites.front_default;

  const displayImage = is3D ? (homeSprite || officialArt || smallSprite) : (officialArt || smallSprite);
  const isPixelated = !is3D && !officialArt && smallSprite;

  return (
    <Card>
      <CardContent className="p-4 flex flex-col gap-4 items-center">
        <div className="relative w-full aspect-square">
            {displayImage ? (
                <Image
                    src={displayImage}
                    alt={`${is3D ? '3D ' : ''}${isShiny ? 'Shiny ' : ''}${name} sprite`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className={`object-contain ${isPixelated ? 'pixelated' : ''}`}
                    priority
                    data-ai-hint="pokemon character"
                />
            ) : <div className="w-full h-full bg-muted rounded-md flex items-center justify-center text-muted-foreground">No Image</div>}
        </div>
        <div className="flex items-center gap-x-6 gap-y-2 flex-wrap justify-center">
            <div className="flex items-center space-x-2">
                <Switch id="shiny-toggle" checked={isShiny} onCheckedChange={setIsShiny} aria-label="Toggle shiny sprite" />
                <Label htmlFor="shiny-toggle" className="text-lg font-semibold text-primary">Shiny</Label>
            </div>
            <div className="flex items-center space-x-2">
                <Switch id="3d-toggle" checked={is3D} onCheckedChange={setIs3D} aria-label="Toggle 3D sprite" />
                <Label htmlFor="3d-toggle" className="text-lg font-semibold text-primary">3D</Label>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
