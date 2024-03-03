interface CommonObject {
  [key: string]: string | number | CommonObject[] | boolean;
}

export interface PokemonListType {
  abilities?: string[];
  base_experience?: number;
  cries?: CommonObject;
  forms?: CommonObject[];
  game_indices?: CommonObject;
  height?: number;
  held_items?: CommonObject[];
  id: number;
  is_default?: boolean;
  location_area_encounters?: string;
  moves?: CommonObject[];
  name: string;
  order?: number;
  past_abilities?: CommonObject[];
  past_types?: CommonObject[];
  species?: CommonObject;
  sprites: PokemonSprites;
  stats?: CommonObject[];
  types: PokemonTypeSlot[];
  weight?: number;
}

interface PokemonTypeSlot {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

interface PokemonSprites {
  back_default: string;
  back_female: string;
  back_shiny: string;
  back_shiny_female: string;
  front_default: string;
  front_female: string;
  front_shiny: string;
  front_shiny_female: string;
  other: PokemonSpritesOther;
}

interface PokemonSpritesOther {
  dream_world: PokemonSprites;
  home: PokemonSprites;
  "official-artwork": PokemonSprites;
  showdown: PokemonSprites;
}

const checkDeviceType = () => {
    const viewportHeight = window.innerHeight;
    const mobileThreshold = 600; // Example threshold for mobile devices

    if (viewportHeight <= mobileThreshold) {
      return "Mobile";
    } else {
      return "Desktop";
    }
  },
  currentDevice = checkDeviceType();

export { currentDevice };
