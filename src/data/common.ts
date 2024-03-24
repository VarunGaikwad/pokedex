const base_url = "https://pokeapi.co";

const image_base_url =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

export interface PokemonListType {
  entry_number: number;
  pokemon_species: PokemonCommonType;
  types: PokemonTypeType[];
}

interface PokemonTypeType {
  slot: number;
  type: PokemonCommonType;
}

interface PokemonCommonType {
  name: string;
  url: string;
}

export function pokemonNumberPadding(num: string) {
  while (num.length < 4) {
    num = "0" + num;
  }

  return num;
}

export { base_url, image_base_url };

interface Type {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

interface Ability {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

interface Stat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

interface Sprites {
  back_default: string | null;
  back_female: string | null;
  back_shiny: string | null;
  back_shiny_female: string | null;
  front_default: string;
  front_female: string | null;
  front_shiny: string;
  front_shiny_female: string | null;
}

export interface PokemonResponse {
  name: string;
  id: number;
  height: number;
  weight: number;
  types: Type[];
  abilities: Ability[];
  stats: Stat[];
  sprites: Sprites;
}


export interface SortCriteria {
  order: "asc" | "desc";
  type: "number" | "name";
}

export interface SortMenuProps {
  sort: SortCriteria;
  setSort: React.Dispatch<React.SetStateAction<SortCriteria>>;
}

export interface SearchInputProps {
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
}
