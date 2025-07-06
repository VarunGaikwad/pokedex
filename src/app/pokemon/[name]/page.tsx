import { getPokemonDetails } from '@/lib/pokeapi';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TypeBadge from '@/components/type-badge';
import PokemonStats from '@/components/pokemon-stats';
import PokemonSprites from '@/components/pokemon-sprites';
import PokemonMoves from '@/components/pokemon-moves';

export default async function PokemonDetailPage({ params }: { params: { name: string } }) {
  const pokemon = await getPokemonDetails(params.name);

  if (!pokemon) {
    notFound();
  }

  const flavorTextEntry = pokemon.species_details.flavor_text_entries.find(
    (entry: any) => entry.language.name === 'en'
  );

  const moves = pokemon.moves;
  const abilities = pokemon.abilities.map((ability: any) => ability.ability.name);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Link href="/" className="mb-8 inline-flex items-center gap-2 text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to Pokédex
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <PokemonSprites
            name={pokemon.name}
            sprites={pokemon.sprites}
          />
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Height</span>
                    <span className="font-medium">{(pokemon.height * 0.1).toFixed(1)} m</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Weight</span>
                    <span className="font-medium">{(pokemon.weight * 0.1).toFixed(1)} kg</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Abilities</span>
                    <div className="flex flex-col items-end gap-1">
                        {abilities.map((ability: string) => (
                            <span key={ability} className="capitalize font-medium">{ability.replace('-', ' ')}</span>
                        ))}
                    </div>
                </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
                <span className="text-2xl font-bold text-muted-foreground">#{pokemon.id.toString().padStart(4, '0')}</span>
                <h1 className="text-5xl font-bold capitalize font-headline">{pokemon.name.replace('-', ' ')}</h1>
            </div>
            <div className="flex gap-2">
                {pokemon.types.map((typeInfo: any) => (
                    <TypeBadge key={typeInfo.type.name} typeName={typeInfo.type.name} />
                ))}
            </div>
          </div>
          
          <p className="text-lg leading-relaxed">{flavorTextEntry?.flavor_text.replace(/\\n/g, ' ').replace(/\f/g, ' ')}</p>

          <Card>
            <CardHeader><CardTitle className="font-headline">Base Stats</CardTitle></CardHeader>
            <CardContent>
              <PokemonStats stats={pokemon.stats} />
            </CardContent>
          </Card>

          <PokemonMoves pokemonName={pokemon.name} moves={moves} />
        </div>
      </div>
    </div>
  );
}
