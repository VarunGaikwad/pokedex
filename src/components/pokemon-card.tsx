'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { PokemonListItem } from '@/lib/pokeapi';

interface PokemonCardProps {
  pokemon: PokemonListItem;
}

function getPokemonId(url: string): string {
  const parts = url.split('/');
  return parts[parts.length - 2];
}

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  const pokemonId = getPokemonId(pokemon.url);
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;

  return (
    <Link href={`/pokemon/${pokemon.name}`} className="group">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-primary">
        <CardContent className="p-0 flex flex-col items-center justify-center">
          <div className="aspect-square w-full relative bg-card/50">
            <Image
              src={imageUrl}
              alt={pokemon.name}
              fill
              className="object-contain p-4 group-hover:p-2 transition-all duration-300"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              priority={parseInt(pokemonId) <= 24}
              data-ai-hint="pokemon character"
            />
          </div>
          <div className="w-full p-2 bg-card-foreground/5 dark:bg-card-foreground/10 text-center">
            <p className="capitalize font-semibold text-sm truncate">{pokemon.name.replace('-', ' ')}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function PokemonCardSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <Skeleton className="h-6 w-3/4 mx-auto rounded-md" />
    </div>
  );
}
