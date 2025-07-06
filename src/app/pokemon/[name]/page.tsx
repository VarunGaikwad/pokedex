import { getPokemonDetails, getEvolutionChain } from '@/lib/pokeapi';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Venus, Mars, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TypeBadge from '@/components/type-badge';
import PokemonStats from '@/components/pokemon-stats';
import PokemonSprites from '@/components/pokemon-sprites';
import PokemonMoves from '@/components/pokemon-moves';
import PokemonEvolutionChain from '@/components/pokemon-evolution-chain';
import PokemonTypeEffectiveness from '@/components/pokemon-type-effectiveness';

function getGenderRatio(rate: number): { male: number, female: number } | 'genderless' {
    if (rate === -1) {
        return 'genderless';
    }
    const femalePercentage = (rate / 8) * 100;
    const malePercentage = 100 - femalePercentage;
    return { male: malePercentage, female: femalePercentage };
}

export default async function PokemonDetailPage({ params }: { params: { name: string } }) {
  const pokemon = await getPokemonDetails(params.name);

  if (!pokemon) {
    notFound();
  }
  
  const evolutionChain = await getEvolutionChain(pokemon.species_details.evolution_chain?.url);

  const flavorTextEntry = pokemon.species_details.flavor_text_entries.find(
    (entry: any) => entry.language.name === 'en'
  );

  const category = pokemon.species_details.genera?.find(
      (g: any) => g.language.name === 'en'
  )?.genus || 'Unknown';

  const moves = pokemon.moves;
  const abilities = pokemon.abilities.map((ability: any) => ability.ability.name);
  const types = pokemon.types.map((typeInfo: any) => typeInfo.type.name);

  const genderRatio = getGenderRatio(pokemon.species_details.gender_rate);

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
            genderRate={pokemon.species_details.gender_rate}
          />
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-medium">{category}</span>
                </div>
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
                 <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Gender</span>
                    {genderRatio === 'genderless' ? (
                         <div className="flex items-center gap-1 font-medium">
                            <HelpCircle className="h-4 w-4 text-muted-foreground"/> Genderless
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 font-medium">
                           <span className="flex items-center" title={`Male: ${genderRatio.male}%`}><Mars className="h-4 w-4 text-blue-500 mr-1"/> {genderRatio.male}%</span>
                           <span className="flex items-center" title={`Female: ${genderRatio.female}%`}><Venus className="h-4 w-4 text-pink-500 mr-1"/> {genderRatio.female}%</span>
                        </div>
                    )}
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
                {types.map((typeName: string) => (
                    <TypeBadge key={typeName} typeName={typeName} />
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
          
          <PokemonTypeEffectiveness types={types} />

          <PokemonEvolutionChain chain={evolutionChain} />

          <PokemonMoves pokemonName={pokemon.name} moves={moves} />
        </div>
      </div>
    </div>
  );
}
