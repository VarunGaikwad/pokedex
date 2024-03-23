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

export interface PokemonDetailsType {
  base_happiness: number;
  capture_rate: number;
  color: PokemonCommonType;
  egg_groups: PokemonCommonType[];
  evolution_chain: Omit<PokemonCommonType, "name">;
  evolves_from_species: PokemonCommonType;
  flavor_text_entries: PokemonFlavourType[];
  form_descriptions: PokemonCommonType[];
  forms_switchable: boolean;
  gender_rate: number;
  genera: PokemonGeneraType[];
  generation: PokemonCommonType;
  growth_rate: PokemonCommonType;
  habitat: PokemonCommonType;
  has_gender_differences: boolean;
  hatch_counter: number;
  id: number;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  name: string;
  names: PokemonNamesType[];
  order: number;
  pal_park_encounters: PokemonPalParkType[];
  pokedex_numbers: PokemonDexNumberType[];
  shape: PokemonCommonType;
  varieties: PokemonVarietyType;
}

interface PokemonFlavourType {
  flavor_text: string;
  language: PokemonCommonType;
}

interface PokemonGeneraType {
  genus: string;
  language: PokemonCommonType;
}

interface PokemonNamesType {
  name: string;
  language: PokemonCommonType;
}

interface PokemonPalParkType {
  base_score: number;
  rate: number;
  area: PokemonCommonType;
}

interface PokemonDexNumberType {
  entry_number: number;
  pokedex: PokemonCommonType;
}

interface PokemonVarietyType {
  is_default: boolean;
  pokemon: PokemonCommonType;
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
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
}
