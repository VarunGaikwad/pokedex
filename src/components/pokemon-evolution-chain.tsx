import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import type { PokemonListItem } from '@/lib/pokeapi';

interface EvolutionDetail {
  item: PokemonListItem | null;
  trigger: PokemonListItem;
  gender: number | null;
  held_item: PokemonListItem | null;
  known_move: PokemonListItem | null;
  known_move_type: PokemonListItem | null;
  location: PokemonListItem | null;
  min_level: number | null;
  min_happiness: number | null;
  min_beauty: number | null;
  min_affection: number | null;
  needs_overworld_rain: boolean;
  party_species: PokemonListItem | null;
  party_type: PokemonListItem | null;
  relative_physical_stats: number | null;
  time_of_day: string;
  trade_species: PokemonListItem | null;
  turn_upside_down: boolean;
}

interface EvolutionNode {
  species: PokemonListItem;
  evolves_to: EvolutionNode[];
  evolution_details: EvolutionDetail[];
}

interface PokemonEvolutionChainProps {
  chain: {
    chain: EvolutionNode;
  } | null;
}

function getPokemonIdFromUrl(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 2];
}

function EvolutionStep({ node }: { node: EvolutionNode }) {
    const id = getPokemonIdFromUrl(node.species.url);
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

    return (
        <div className="flex flex-col sm:flex-row items-center gap-2">
            <Link href={`/pokemon/${node.species.name}`}>
                <div className="flex flex-col items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors">
                    <div className="relative h-24 w-24">
                       <Image src={imageUrl} alt={node.species.name} fill className="object-contain" data-ai-hint="pokemon character" />
                    </div>
                    <span className="capitalize font-medium text-sm">{node.species.name.replace('-', ' ')}</span>
                </div>
            </Link>

            {node.evolves_to.length > 0 && (
                <div className="flex flex-col gap-4">
                    {node.evolves_to.map((nextNode, index) => (
                        <div key={index} className="flex flex-col sm:flex-row items-center gap-2">
                            <div className="flex flex-col items-center text-center">
                                <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90 sm:rotate-0" />
                                <span className="text-xs text-muted-foreground max-w-24 mt-1">
                                    {formatEvolutionDetails(nextNode.evolution_details[0])}
                                </span>
                            </div>
                            <EvolutionStep node={nextNode} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function formatEvolutionDetails(details: EvolutionDetail | undefined): string {
    if (!details) return 'Special';
    if (details.trigger.name === 'level-up') {
        if (details.min_level) return `Level ${details.min_level}`;
        if (details.min_happiness) return `High Friendship`;
        if (details.min_affection) return `High Affection`;
        return 'Level Up';
    }
    if (details.trigger.name === 'trade') {
        if (details.held_item) return `Trade holding ${details.held_item.name.replace('-', ' ')}`;
        return 'Trade';
    }
    if (details.trigger.name === 'use-item') {
        if (details.item) return `Use ${details.item.name.replace('-', ' ')}`;
    }
    return details.trigger.name.replace('-', ' ');
}

export default function PokemonEvolutionChain({ chain }: PokemonEvolutionChainProps) {
  if (!chain) {
    return (
      <Card>
        <CardHeader><CardTitle className="font-headline">Evolution Chain</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Evolution data not available for this Pokémon.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader><CardTitle className="font-headline">Evolution Chain</CardTitle></CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="flex items-center gap-2 p-2">
            <EvolutionStep node={chain.chain} />
        </div>
      </CardContent>
    </Card>
  );
}
