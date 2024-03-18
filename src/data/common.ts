const base_url = "https://pokeapi.co";

const image_base_url = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

export interface PokemonListType {
    entry_number: number;
    pokemon_species: {
        name: string;
        url: string;
    };
}

export { base_url, image_base_url };

