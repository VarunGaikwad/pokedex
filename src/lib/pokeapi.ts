import { pokemonIdFromUrl, STANDARD_TYPES, type CatalogPokemon, type DiscoveryState, type InitialDiscovery } from './pokemon-discovery';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

// Cache lightweight indexes and visited metadata, never a failed request.
const requests = new Map<string, Promise<unknown>>();
function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
  const existing = requests.get(key);
  if (existing) return existing as Promise<T>;
  const request = load().catch((error) => {
    requests.delete(key);
    throw error;
  });
  requests.set(key, request);
  return request;
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`PokéAPI request failed (${response.status}). Please try again.`);
  return response.json();
}

export interface PokemonSummary extends CatalogPokemon {
  types: string[];
}

export const getPokemonCatalog = (): Promise<CatalogPokemon[]> => cached('catalog', async () => {
  const data = await fetchJson<PokemonListResponse>(`${POKEAPI_BASE_URL}/pokemon-species?limit=100000`);
  // Species are canonical national-dex entries; forms remain accessible through detail URLs.
  return data.results.map((species) => {
    const id = pokemonIdFromUrl(species.url);
    return { id, name: species.name, url: `${POKEAPI_BASE_URL}/pokemon/${id}/` };
  }).sort((a, b) => a.id - b.id);
});

export const getGenerations = (): Promise<PokemonListItem[]> => cached('generations', async () => {
  const data = await fetchJson<PokemonListResponse>(`${POKEAPI_BASE_URL}/generation?limit=100`);
  return data.results;
});

export const getTypeMembership = (type: string): Promise<ReadonlySet<number>> => cached(`type:${type}`, async () => {
  const data = await fetchJson<{ pokemon: { pokemon: PokemonListItem }[] }>(`${POKEAPI_BASE_URL}/type/${type}`);
  return new Set(data.pokemon.map(({ pokemon }) => pokemonIdFromUrl(pokemon.url)));
});

export const getGenerationMembership = (generation: string): Promise<ReadonlySet<number>> => cached(`generation:${generation}`, async () => {
  const data = await fetchJson<{ pokemon_species: PokemonListItem[] }>(`${POKEAPI_BASE_URL}/generation/${generation}`);
  return new Set(data.pokemon_species.map((species) => pokemonIdFromUrl(species.url)));
});

export async function getInitialDiscovery(state: DiscoveryState): Promise<InitialDiscovery> {
  try {
    const [catalog, generations, typeIds, generationIds] = await Promise.all([
      getPokemonCatalog(),
      getGenerations(),
      state.type === 'all' ? undefined : getTypeMembership(state.type),
      state.generation === 'all' ? undefined : getGenerationMembership(state.generation),
    ]);
    return {
      state, catalog, generations,
      membership: {
        key: `${state.type}:${state.generation}`,
        ...(typeIds && { typeIds: [...typeIds] }),
        ...(generationIds && { generationIds: [...generationIds] }),
      },
    };
  } catch {
    // Keep the requested controls while the client loader offers connection recovery.
    return { state, catalog: null, generations: [], membership: null };
  }
}

let activeMetadataRequests = 0;
const metadataQueue: (() => void)[] = [];
async function withMetadataSlot<T>(load: () => Promise<T>): Promise<T> {
  if (activeMetadataRequests >= 4) await new Promise<void>((resolve) => metadataQueue.push(resolve));
  else activeMetadataRequests++;
  try {
    return await load();
  } finally {
    const next = metadataQueue.shift();
    if (next) next();
    else activeMetadataRequests--;
  }
}

const getPokemonSummary = (pokemon: CatalogPokemon): Promise<PokemonSummary> => cached(`metadata:${pokemon.id}`, async () => {
  const data = await fetchJson<{ types: { slot: number; type: { name: string } }[] }>(pokemon.url);
  return { ...pokemon, types: data.types.sort((a, b) => a.slot - b.slot).map(({ type }) => type.name) };
});

export async function getPokemonPageMetadata(pokemon: CatalogPokemon[], signal?: AbortSignal): Promise<PokemonSummary[]> {
  const result: PokemonSummary[] = new Array(pokemon.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(4, pokemon.length) }, async () => {
    while (next < pokemon.length) {
      if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
      const index = next++;
      result[index] = await withMetadataSlot(() => {
        // A stale page must not start new network work after waiting for a slot.
        if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
        return getPokemonSummary(pokemon[index]);
      });
    }
  }));
  return result;
}

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
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Failed to fetch Pokémon details (${response.status})`);
  const data = await response.json();
  
  const speciesResponse = await fetch(data.species.url);
  if (speciesResponse.ok) {
    const speciesData = await speciesResponse.json();
    data.species_details = speciesData;
  } else {
    throw new Error(`Failed to fetch Pokémon species (${speciesResponse.status})`);
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

export const getMoveDetails = async (url: string) => {
  if (!url) return null;
  try {
    const response = await fetch(url);
    if (!response.ok) {
        console.warn(`Failed to fetch move details from ${url}`);
        return null;
    }
    return response.json();
  } catch (error) {
    console.error("Failed to fetch move details:", error);
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

export const getTypes = (): Promise<PokemonListItem[]> => cached('types', async () => {
    const data = await fetchJson<PokemonListResponse>(`${POKEAPI_BASE_URL}/type?limit=100`);
    return data.results.filter((type) => (STANDARD_TYPES as readonly string[]).includes(type.name));
});
