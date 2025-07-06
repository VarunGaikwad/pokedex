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
    data.species_details = { flavor_text_entries: [], genera: [], gender_rate: -1, evolution_chain: { url: null } };
  }

  return data;
};

export const getEvolutionChain = async (url: string) => {
  if (!url) return null;
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error("Failed to fetch evolution chain:", error);
    return null;
  }
};

export const getTypeData = async (typeName: string) => {
    const response = await fetch(`${POKEAPI_BASE_URL}/type/${typeName}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch type data for ${typeName}`);
    }
    const data = await response.json();
    return data.damage_relations;
}

export const getTypes = async (): Promise<PokemonListItem[]> => {
    const response = await fetch(`${POKEAPI_BASE_URL}/type`);
    if (!response.ok) {
        throw new Error('Failed to fetch types');
    }
    const data = await response.json();
    // Some types like "unknown" and "shadow" are not useful for filtering
    return data.results.filter((type: PokemonListItem) => type.name !== 'unknown' && type.name !== 'shadow');
}
