import {
  image_base_url,
  PokemonListType,
  pokemonNumberPadding,
} from "../data/common";
import missingno from "../assets/missingno.png";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
export default function PokemonCard({
  entry_number,
  pokemon_species,
}: PokemonListType) {
  const [pokeImg, setPokeImg] = useState<string>(missingno);

  useEffect(() => {
    const fetchImage = new Image();
    fetchImage.src = `${image_base_url}/other/official-artwork/${entry_number}.png`;
    fetchImage.onload = () => {
      setPokeImg(fetchImage.src);
    };
  }, [entry_number]);

  return (
    <Link to={`/${entry_number}`}>
      <div
        className="h-max bg-slate-100 rounded-md p-2 flex flex-col"
        style={{
          boxShadow:
            "0px 0px 10px 5px rgba(0,0,0,0.1),inset 0px 3.5rem 5px 0px white",
        }}
      >
        <span className="opacity-50 text-end">
          #{pokemonNumberPadding(entry_number.toString())}
        </span>
        <img
          height={20}
          loading="lazy"
          className="m-auto"
          src={pokeImg}
          alt={pokemon_species.name}
        />
        <span className="mt-1 text-sm font-semibold text-center">
          {pokemon_species.name}
        </span>
      </div>
    </Link>
  );
}
