'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Mars, Venus } from 'lucide-react';

interface PokemonSpritesProps {
  name: string;
  sprites: {
    front_default: string | null;
    front_shiny: string | null;
    front_female: string | null;
    front_shiny_female: string | null;
    other?: {
        'official-artwork'?: {
            front_default: string | null;
            front_shiny: string | null;
            front_female: string | null;
        };
        home?: {
            front_default: string | null;
            front_shiny: string | null;
        };
    }
  };
  genderRate: number;
}

export default function PokemonSprites({ name, sprites, genderRate }: PokemonSpritesProps) {
  const [isShiny, setIsShiny] = useState(false);
  const [is3D, setIs3D] = useState(false);
  const [gender, setGender] = useState<'male' | 'female'>('male');

  const hasGenderDifferences = !!sprites.front_female;

  const officialArt = isShiny 
    ? sprites.other?.['official-artwork']?.front_shiny 
    : sprites.other?.['official-artwork']?.front_default;
  
  const homeSprite = isShiny 
    ? sprites.other?.home?.front_shiny 
    : sprites.other?.home?.front_default;

  const getSmallSprite = () => {
    if (isShiny) {
        return gender === 'female' && sprites.front_shiny_female ? sprites.front_shiny_female : sprites.front_shiny;
    }
    return gender === 'female' && sprites.front_female ? sprites.front_female : sprites.front_default;
  }

  const smallSprite = getSmallSprite();
  
  const displayImage = hasGenderDifferences && gender === 'female' 
    ? smallSprite
    : (is3D ? (homeSprite || officialArt || smallSprite) : (officialArt || smallSprite));

  const isPixelated = (hasGenderDifferences && smallSprite && gender === 'female') || (!is3D && !officialArt && smallSprite);

  return (
    <Card>
      <CardContent className="p-4 flex flex-col gap-4 items-center">
        <div className="relative w-full aspect-square">
            {displayImage ? (
                <Image
                    src={displayImage}
                    alt={`${is3D ? '3D ' : ''}${isShiny ? 'Shiny ' : ''}${gender === 'female' ? 'Female ' : ''}${name} sprite`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className={`object-contain ${isPixelated ? 'pixelated' : ''}`}
                    priority
                    data-ai-hint="pokemon character"
                    unoptimized={isPixelated}
                />
            ) : <div className="w-full h-full bg-muted rounded-md flex items-center justify-center text-muted-foreground">No Image</div>}
        </div>
        <div className="flex items-center gap-x-6 gap-y-4 flex-wrap justify-center">
            <div className="flex items-center space-x-2">
                <Switch id="shiny-toggle" checked={isShiny} onCheckedChange={setIsShiny} aria-label="Toggle shiny sprite" />
                <Label htmlFor="shiny-toggle" className="text-lg font-semibold text-primary">Shiny</Label>
            </div>
            {homeSprite && officialArt && (
              <div className="flex items-center space-x-2">
                  <Switch id="3d-toggle" checked={is3D} onCheckedChange={setIs3D} aria-label="Toggle 3D sprite" disabled={hasGenderDifferences && gender === 'female'}/>
                  <Label htmlFor="3d-toggle" className="text-lg font-semibold text-primary">3D</Label>
              </div>
            )}
        </div>
        {hasGenderDifferences && genderRate !== -1 && genderRate !== 0 && genderRate !== 8 && (
          <RadioGroup defaultValue="male" onValueChange={(value: 'male' | 'female') => setGender(value)} className="flex items-center gap-4">
             <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male" className="flex items-center gap-1"><Mars className="h-5 w-5 text-blue-500" /> Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female" className="flex items-center gap-1"><Venus className="h-5 w-5 text-pink-500" /> Female</Label>
            </div>
          </RadioGroup>
        )}
      </CardContent>
    </Card>
  );
}
