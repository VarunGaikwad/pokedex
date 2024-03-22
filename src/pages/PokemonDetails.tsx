// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { axiosRequest } from "../service/api";

import { useEffect, useState } from "react";
import PokemonNextPrevious from "../components/PokemonNextPrevious";
import { image_base_url, PokemonDetailsType } from "../data/common";
import { axiosRequest } from "../service/api";
import { useParams } from "react-router-dom";

export default function PokemonDetails() {
  const { id } = useParams(),
    [pokemonInfo, setPokemonInfo] = useState<
      PokemonDetailsType | Record<string, string>
    >({});

  useEffect(() => {
    const fetchPokemonInfo = async () => {
      const response = await axiosRequest(`/api/v2/pokemon-species/${id}`);
      setPokemonInfo(response);
    };
    fetchPokemonInfo();
  }, [id]);

  return (
    <div>
      <div className="flex justify-between gap-4">
        <PokemonNextPrevious
          numberFirst={true}
          numberText="1"
          mainText="Previous"
        />
        <div className="text-4xl flex gap-2 items-center">
          <div>Bulbasaur</div>
          <div className="opacity-50">#0001</div>
        </div>
        <PokemonNextPrevious
          numberFirst={false}
          numberText="2"
          mainText="Next"
        />
      </div>
      <div className="flex text-4xl justify-center gap-4 m-4 items-center"></div>
      <div className="flex justify-between">
        <div>Type and Weakness</div>
        <div>
          <img
            width={300}
            loading="lazy"
            alt={pokemonInfo.name}
            src={`${image_base_url}/other/official-artwork/1.png`}
          />
        </div>
        <div>Height Weight</div>
      </div>
    </div>
  );
}
