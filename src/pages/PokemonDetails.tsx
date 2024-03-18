import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosRequest } from "../service/api";

export default function PokemonDetails() {
  const { id } = useParams(),
    [pokemonInfo, setPokemonInfo] = useState({});

  useEffect(() => {
    const fetchPokemonInfo = async () => {
      const response = await axiosRequest(`/api/v2/pokemon-species/${id}`);
      setPokemonInfo(response);
    };
    fetchPokemonInfo();
  }, [id]);

  return <pre>{JSON.stringify(pokemonInfo, null, 4)}</pre>;
}
