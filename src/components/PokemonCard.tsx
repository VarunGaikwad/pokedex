import { Link } from "react-router-dom";
import PokemonBackground from "../assets/list_pokemon_bg.avif";
import {
  PokemonListType,
  image_base_url,
  pokemonNumberPadding,
} from "../data/common";

export default function PokemonCard({
  entry_number,
  pokemon_species: { name },
}: PokemonListType) {
  return (
    // <Link
    //   to={{
    //     pathname: `/pokedex/${entry_number}`,
    //   }}
    // >
    //   <div
    //     key={entry_number}
    //     className="cursor-pointer m-4 p-5 border-2 border-indigo-100 max-w-sm rounded-3xl overflow-hidden shadow-lg"
    //   >
    //     <div className="size-45 card-background">
    //       <img
    //         width={250}
    //         loading="lazy"
    //         alt={name}
    //         src={`${image_base_url}/other/official-artwork/${entry_number}.png`}
    //       />
    //     </div>
    //     <div className="size-48 pt-10">
    //       <div className="text-2xl opacity-50">
    //         {pokemonNumberPadding(entry_number.toString())}
    //       </div>
    //       <div className="text-4xl capitalize">{name}</div>
    //     </div>
    //   </div>
    // </Link>
    <div className="relative">
      <div className="absolute p-4">
        <div className="flex justify-center" style={{ maxWidth: "100%" }}>
          <img
            width={150}
            loading="lazy"
            alt={name}
            src={`${image_base_url}/other/official-artwork/${entry_number}.png`}
          />
        </div>
      </div>
      <img src={PokemonBackground} alt="Pokemon Background" />
    </div>
  );
}
