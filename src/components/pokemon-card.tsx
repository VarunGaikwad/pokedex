"use client";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { PokemonListItem } from "@/lib/pokeapi";
import { POKEMON_PER_PAGE } from "./pokemon-list";

interface PokemonCardProps {
  pokemon: PokemonListItem;
  spirit: string;
}

function getPokemonId(url: string): string {
  const parts = url.split("/");
  return parts[parts.length - 2];
}

export default function PokemonCard({ pokemon, spirit }: PokemonCardProps) {
  const pokemonId = getPokemonId(pokemon.url);
  const isPriority = parseInt(pokemonId) <= POKEMON_PER_PAGE;
  let imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;

  switch (spirit) {
    case "Default":
      imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
      break;

    case "Shiny":
      imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokemonId}.png`;
      break;

    case "Dream World":
      imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonId}.svg`;
      break;

    case "Home":
      imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemonId}.png`;
      break;

    case "Home Shiny":
      imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/${pokemonId}.png`;
      break;

    case "Official Artwork":
      imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
      break;

    case "Official Artwork Shiny":
      imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${pokemonId}.png`;
      break;

    case "Showdown":
      imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${pokemonId}.gif`;
      break;

    case "Showdown Shiny":
      imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/${pokemonId}.gif`;
      break;

    case "Back":
      imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${pokemonId}.png`;
      break;

    case "Back Shiny":
      imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/${pokemonId}.png`;
      break;

    case "Showdown Back":
      imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/${pokemonId}.gif`;
      break;

    case "Showdown Back Shiny":
      imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/shiny/${pokemonId}.gif`;
      break;

    default:
      imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
      break;
  }

  return (
    <Link href={`/pokemon/${pokemon.name}`} className="group">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-primary/20 hover:shadow-2xl hover:-translate-y-1 hover:border-primary">
        <CardContent className="p-0 flex flex-col items-center justify-center">
          <div className="aspect-square w-full relative bg-gray-50">
            <Image
              src={imageUrl}
              alt={pokemon.name}
              fill
              className="object-contain p-4 group-hover:p-2 transition-all duration-300"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              {...(isPriority ? { priority: true } : { loading: "lazy" })}
              data-ai-hint="pokemon character"
            />
          </div>
          <div className="w-full p-2 bg-card-foreground/5 dark:bg-card-foreground/10 text-center">
            <p className="capitalize font-semibold text-sm truncate">
              {pokemon.name.replace("-", " ")}
            </p>
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
