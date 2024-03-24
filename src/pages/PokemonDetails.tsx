import { Icon } from "@chakra-ui/react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import {
  image_base_url,
  pokemonNumberPadding,
  PokemonResponse,
} from "../data/common";
import PokemonTypeCard from "../components/PokemonTypeCard";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosRequest } from "../service/api";
export default function PokemonDetails() {
  const { id } = useParams(),
    [pokemonInfo, setPokemonInfo] = useState<PokemonResponse>(),
    [randomType, setRandomType] = useState<string>("");

  useEffect(() => {
    const fetchPokemonInfo = async () => {
      const response = await axiosRequest(`/api/v2/pokemon/${id}`);
      setPokemonInfo({ ...response });
      setRandomType(
        response.types[Math.floor(Math.random() * response?.types.length)].type
          ?.name
      );
    };

    fetchPokemonInfo();
  }, [id]);

  return (
    <div className={`bg-${randomType} select-none text-sm`}>
      <div className="container flex flex-col mx-auto h-screen p-2">
        <div className="flex items-start justify-evenly capitalize">
          <div className="w-1/6 flex flex-col justify-between items-start h-full">
            <span className="text-2xl font-semibold text-white text-nowrap">
              {pokemonInfo?.name}
            </span>
            <Icon color="white" boxSize={10} as={IoIosArrowBack} />
          </div>
          <img
            className="w-52 translate-y-20"
            loading="lazy"
            src={`${image_base_url}/other/official-artwork/${id}.png`}
          />
          <div className="w-1/6 flex flex-col justify-between items-end h-full">
            <span className="text-sm font-semibold text-white">
              #{pokemonNumberPadding(pokemonInfo?.id.toString() || "")}
            </span>
            <Icon color="white" boxSize={10} as={IoIosArrowForward} />
          </div>
        </div>
        <div className="flex-grow-2 rounded-md list-content">
          <div className="text-center mt-16">
            <div className="flex justify-center gap-4">
              {pokemonInfo?.types.map((element) => (
                <PokemonTypeCard>{element.type.name}</PokemonTypeCard>
              ))}
            </div>
            <span className="text-lg font-semibold">About</span>
          </div>
        </div>
      </div>
    </div>
  );
}
