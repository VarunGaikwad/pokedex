// import { useEffect, useState } from "react";
// import { PokemonDetailsType } from "../data/common";
// import { axiosRequest } from "../service/api";
// import { useParams } from "react-router-dom";
import Pokeball from "../assets/pokeball.svg";
export default function PokemonDetails() {
  // const { id } = useParams(),
  //   [pokemonInfo, setPokemonInfo] = useState<PokemonDetailsType | null>(null);

  // useEffect(() => {
  //   const fetchPokemonInfo = async () => {
  //     const response = await axiosRequest(`/api/v2/pokemon-species/${id}`);
  //     setPokemonInfo(response);
  //   };

  //   fetchPokemonInfo();
  // }, [id]);

  return (
    <div className="relative h-screen w-screen bg-green-500 detail-page"></div>
  );
}
