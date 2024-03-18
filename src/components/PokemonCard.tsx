import { Link } from "react-router-dom";
import { PokemonListType, image_base_url } from "../data/common";

export default function PokemonCard({
  entry_number,
  pokemon_species: { name },
}: PokemonListType) {
  return (
    <Link
      to={{
        pathname: `/pokedex/${entry_number}`,
      }}
    >
      <div
        key={entry_number}
        className="cursor-pointer m-4 p-5 border-2 border-indigo-100 max-w-sm rounded overflow-hidden shadow-lg"
      >
        <div className="text-5xl text-slate-700">{entry_number}</div>
        <div className="text-3xl capitalize text-slate-800">{name}</div>
        <img
          width={250}
          loading="lazy"
          alt={name}
          src={`${image_base_url}/other/official-artwork/${entry_number}.png`}
        />
      </div>
    </Link>
  );
}
