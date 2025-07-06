const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export const getPokemonList = async (limit = 20, offset = 0): Promise<PokemonListResponse> => {
  const response = await fetch(`${POKEAPI_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  if (!response.ok) {
    throw new Error('Failed to fetch Pokémon list');
  }
  return response.json();
};

export const getPokemonDetails = async (name: string) => {
  const response = await fetch(`${POKEAPI_BASE_URL}/pokemon/${name.toLowerCase()}`);
  if (!response.ok) {
    return null; 
  }
  const data = await response.json();
  
  const speciesResponse = await fetch(data.species.url);
  if (speciesResponse.ok) {
    const speciesData = await speciesResponse.json();
    data.species_details = speciesData;
  } else {
    data.species_details = { flavor_text_entries: [] }; // Graceful handling
  }

  return data;
};

export const getTypes = async (): Promise<PokemonListItem[]> => {
    const response = await fetch(`${POKEAPI_BASE_URL}/type`);
    if (!response.ok) {
        throw new Error('Failed to fetch types');
    }
    const data = await response.json();
    // Some types like "unknown" and "shadow" are not useful for filtering
    return data.results.filter((type: PokemonListItem) => type.name !== 'unknown' && type.name !== 'shadow');
}
