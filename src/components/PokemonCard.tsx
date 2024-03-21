import { Link } from "react-router-dom";
import {
  PokemonListType,
  image_base_url,
  pokemonNumberPadding,
} from "../data/common";
import PokemonTypeCard from "./PokemonTypeCard";

export default function PokemonCard({
  entry_number,
  pokemon_species: { name },
  types,
}: PokemonListType) {
  return (
    <Link
      to={{
        pathname: `/pokedex/${entry_number}`,
      }}
    >
      <div className="pokemon-card">
        <div className="absolute z-10 h-full w-full flex flex-col gap-16">
          <div className="flex justify-center pt-12">
            <img
              width={175}
              loading="lazy"
              alt={name}
              src={`${image_base_url}/other/official-artwork/${entry_number}.png`}
            />
          </div>
          <div className="px-8 flex flex-col justify-between h-full pb-10">
            <div>
              <div className="text-2xl opacity-50">
                {pokemonNumberPadding(entry_number.toString())}
              </div>
              <div className="text-4xl capitalize">{name}</div>
            </div>
            <div className="flex gap-4 justify-between">
              {types.map(({ type }, idx) => (
                <PokemonTypeCard key={idx}>{type.name}</PokemonTypeCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
