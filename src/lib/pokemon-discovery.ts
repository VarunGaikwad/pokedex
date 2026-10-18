export const POKEMON_PER_PAGE = 24;
export const STANDARD_TYPES = ["normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison", "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"] as const;
export const ARTWORK_STYLES = ["Official Artwork", "Default", "Dream World", "Home", "Showdown", "Back", "Showdown Back"] as const;
export type ArtworkStyle = typeof ARTWORK_STYLES[number];
export type DiscoverySort = "number" | "number-desc" | "name" | "name-desc";

export interface CatalogPokemon {
  id: number;
  name: string;
  url: string;
}

export interface DiscoveryState {
  q: string;
  type: string;
  generation: string;
  sort: DiscoverySort;
  page: number;
  artwork: ArtworkStyle;
  shiny: boolean;
}

export interface InitialDiscovery {
  state: DiscoveryState;
  catalog: CatalogPokemon[] | null;
  generations: { name: string; url: string }[];
  membership: {
    key: string;
    typeIds?: number[];
    generationIds?: number[];
  } | null;
}

export const DEFAULT_DISCOVERY: DiscoveryState = {
  q: "", type: "all", generation: "all", sort: "number", page: 1,
  artwork: "Official Artwork", shiny: false,
};

export function normalizePokemonSearch(value: string): string {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
}

export function matchesPokemon(pokemon: CatalogPokemon, query: string): boolean {
  const normalized = normalizePokemonSearch(query);
  if (!normalized) return true;
  if (/^\d+$/.test(normalized)) return pokemon.id === Number(normalized);
  return normalizePokemonSearch(pokemon.name).includes(normalized);
}

export function filterCatalog(
  catalog: CatalogPokemon[],
  state: Pick<DiscoveryState, "q" | "type" | "generation" | "sort">,
  typeIds?: ReadonlySet<number>,
  generationIds?: ReadonlySet<number>,
): CatalogPokemon[] {
  const filtered = catalog.filter((pokemon) => matchesPokemon(pokemon, state.q)
    && (state.type === "all" || !!typeIds?.has(pokemon.id))
    && (state.generation === "all" || !!generationIds?.has(pokemon.id)));
  return filtered.sort((a, b) => {
    switch (state.sort) {
      case "name": return a.name.localeCompare(b.name) || a.id - b.id;
      case "name-desc": return b.name.localeCompare(a.name) || a.id - b.id;
      case "number-desc": return b.id - a.id;
      default: return a.id - b.id;
    }
  });
}

export function paginate<T>(items: T[], requestedPage: number, pageSize = POKEMON_PER_PAGE) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(totalPages, Math.max(1, Math.floor(requestedPage) || 1));
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), page, totalPages, start, total: items.length };
}

export function parseDiscoveryParams(input: URLSearchParams | Record<string, string | string[] | undefined>): DiscoveryState {
  const params = input instanceof URLSearchParams ? input : new URLSearchParams(
    Object.entries(input).flatMap(([key, value]) => value === undefined ? [] : [[key, Array.isArray(value) ? value[0] || "" : value]]),
  );
  const type = params.get("type") || "all";
  const generation = params.get("generation") || "all";
  const sort = params.get("sort") || "number";
  const artwork = params.get("artwork") || "Official Artwork";
  const page = Number(params.get("page"));
  return {
    q: (params.get("q") || "").slice(0, 100),
    type: (STANDARD_TYPES as readonly string[]).includes(type) ? type : "all",
    generation: /^[1-9]\d?$/.test(generation) ? generation : "all",
    sort: ["number", "number-desc", "name", "name-desc"].includes(sort) ? sort as DiscoverySort : "number",
    page: Number.isSafeInteger(page) && page > 0 ? page : 1,
    artwork: (ARTWORK_STYLES as readonly string[]).includes(artwork) ? artwork as ArtworkStyle : "Official Artwork",
    shiny: params.get("shiny") === "1" || params.get("shiny") === "true",
  };
}

export function discoveryParams(state: DiscoveryState): string {
  const params = new URLSearchParams();
  if (state.q) params.set("q", state.q);
  if (state.type !== "all") params.set("type", state.type);
  if (state.generation !== "all") params.set("generation", state.generation);
  if (state.sort !== "number") params.set("sort", state.sort);
  if (state.page > 1) params.set("page", String(state.page));
  if (state.artwork !== "Official Artwork") params.set("artwork", state.artwork);
  if (state.shiny) params.set("shiny", "1");
  return params.toString();
}

export function pokemonIdFromUrl(url: string): number {
  return Number(url.match(/\/(\d+)\/?$/)?.[1]) || 0;
}

export function displayPokemonName(name: string): string {
  return name.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function spriteUrl(id: number, artwork: ArtworkStyle, shiny: boolean): string {
  const root = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";
  const variant = shiny ? "shiny/" : "";
  switch (artwork) {
    case "Default": return `${root}/${variant}${id}.png`;
    case "Dream World": return `${root}/other/dream-world/${id}.svg`;
    case "Home": return `${root}/other/home/${variant}${id}.png`;
    case "Showdown": return `${root}/other/showdown/${variant}${id}.gif`;
    case "Back": return `${root}/back/${variant}${id}.png`;
    case "Showdown Back": return `${root}/other/showdown/back/${variant}${id}.gif`;
    default: return `${root}/other/official-artwork/${variant}${id}.png`;
  }
}
