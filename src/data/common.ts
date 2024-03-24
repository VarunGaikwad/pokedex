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
    name: "hp" | "attack" | "defense" | "special-attack" | "special-defense" | "speed";
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

export interface PokemonInfoType {
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

export const centimeterToFeet = (num: number = 0): string => (num * 0.0328084 * 10).toFixed(2)

export const kilogramToPound = (num: number = 0): string => (num / 10 * 2.20462).toFixed(2)

export interface PokemonSpeciesType {
  id: number;
  name: string;
  order: number;
  gender_rate: number;
  capture_rate: number;
  base_happiness: number;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  hatch_counter: number;
  has_gender_differences: boolean;
  forms_switchable: boolean;
  growth_rate: {
    name: string;
    url: string;
  };
  pokedex_numbers: {
    entry_number: number;
    pokedex: {
      name: string;
      url: string;
    };
  }[];
  egg_groups: {
    name: string;
    url: string;
  }[];
  color: {
    name: string;
    url: string;
  };
  shape: {
    name: string;
    url: string;
  };
  evolves_from_species: {
    name: string;
    url: string;
  } | null;
  evolution_chain: {
    url: string;
  };
  habitat: {
    name: string;
    url: string;
  } | null;
  generation: {
    name: string;
    url: string;
  };
  names: {
    name: string;
    language: {
      name: string;
      url: string;
    };
  }[];
  pal_park_encounters: {
    area: {
      name: string;
      url: string;
    };
    base_score: number;
    rate: number;
  }[];
  flavor_text_entries: FlavorTextType[];
  form_descriptions: {
    description: string;
    language: {
      name: string;
      url: string;
    };
  }[];
  genera: {
    genus: string;
    language: {
      name: string;
      url: string;
    };
  }[];
  varieties: {
    is_default: boolean;
    pokemon: {
      name: string;
      url: string;
    };
  }[];
}

export interface FlavorTextType {
  flavor_text: string;
  language: {
    name: string;
    url: string;
  };
  version: {
    name: string;
    url: string;
  };
}


export const randomNumber = (max: number) => Math.floor(Math.random() * max)