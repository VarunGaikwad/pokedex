'use client';

import { useState, useEffect, useMemo, useTransition } from 'react';
import type { PokemonListItem } from '@/lib/pokeapi';
import { getPokemonList, getTypes } from '@/lib/pokeapi';
import PokemonCard, { PokemonCardSkeleton } from '@/components/pokemon-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from 'lucide-react';

const POKEMON_PER_PAGE = 24;

const fetchPokemonByType = async (type: string) => {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.pokemon.map((p: { pokemon: PokemonListItem }) => p.pokemon);
};

export default function PokemonList() {
  const [pokemon, setPokemon] = useState<PokemonListItem[]>([]);
  const [types, setTypes] = useState<PokemonListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [isPending, startTransition] = useTransition();

  const loadInitialList = async (currentOffset = 0) => {
    setIsLoading(true);
    const listResponse = await getPokemonList(POKEMON_PER_PAGE, currentOffset);
    setPokemon(currentOffset === 0 ? listResponse.results : (prev) => [...prev, ...listResponse.results]);
    setOffset(currentOffset + POKEMON_PER_PAGE);
    setHasMore(!!listResponse.next);
    setIsLoading(false);
  };

  useEffect(() => {
    const loadInitialData = async () => {
        setIsLoading(true);
        const typesResponse = await getTypes();
        setTypes(typesResponse);
        await loadInitialList(0);
        setIsLoading(false);
    };
    loadInitialData();
  }, []);
  
  useEffect(() => {
      const handleTypeChange = async () => {
          if (selectedType === 'all') {
              if (pokemon.length === 0 || !pokemon.some(p => p.url.includes('pokemon/1/'))) {
                loadInitialList(0);
              }
          } else {
              setIsLoading(true);
              const pokemonFromType = await fetchPokemonByType(selectedType);
              setPokemon(pokemonFromType);
              setHasMore(false);
              setIsLoading(false);
          }
      };
      if (!isLoading) {
        handleTypeChange();
      }
  }, [selectedType]);

  const loadMorePokemon = async () => {
    if (!hasMore || isLoadingMore || selectedType !== 'all') return;
    setIsLoadingMore(true);
    const listResponse = await getPokemonList(POKEMON_PER_PAGE, offset);
    setPokemon(prev => [...prev, ...listResponse.results]);
    setOffset(prev => prev + POKEMON_PER_PAGE);
    setHasMore(!!listResponse.next);
    setIsLoadingMore(false);
  };
  
  const filteredPokemon = useMemo(() => {
    return pokemon.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, pokemon]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      setSearchTerm(e.target.value);
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search Pokémon..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10"
            aria-label="Search Pokémon by name"
          />
        </div>
        <Select onValueChange={setSelectedType} defaultValue="all">
          <SelectTrigger className="w-full" aria-label="Filter by type">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {types.map(type => (
              <SelectItem key={type.name} value={type.name} className="capitalize">{type.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {Array.from({ length: POKEMON_PER_PAGE }).map((_, i) => <PokemonCardSkeleton key={i} />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filteredPokemon.map(p => <PokemonCard key={p.name} pokemon={p} />)}
          </div>
          {hasMore && selectedType === 'all' && (
            <div className="flex justify-center mt-8">
              <Button onClick={loadMorePokemon} disabled={isLoadingMore}>
                {isLoadingMore ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
           {filteredPokemon.length === 0 && !isLoading && (
            <div className="text-center col-span-full py-12">
              <p className="text-muted-foreground">No Pokémon found.</p>
            </div>
           )}
        </>
      )}
    </div>
  );
}
