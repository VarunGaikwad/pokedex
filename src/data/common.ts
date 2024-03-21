const base_url = "https://pokeapi.co";

const image_base_url = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

export interface PokemonListType {
    entry_number: number;
    pokemon_species: {
        name: string;
        url: string;
    };
}

export function pokemonNumberPadding(num: string) {
    while (num.length < 4) {
        num = "0" + num;
    }

    return "#" + num;
}

export { base_url, image_base_url };

