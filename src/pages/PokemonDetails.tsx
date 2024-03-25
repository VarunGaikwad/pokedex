import { Icon } from "@chakra-ui/react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import {
  centimeterToFeet,
  FlavorTextType,
  image_base_url,
  kilogramToPound,
  PokemonInfoType,
  pokemonNumberPadding,
  PokemonSpeciesType,
  randomNumber,
} from "../data/common";
import PokemonTypeCard from "../components/PokemonTypeCard";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosRequest } from "../service/api";
import { TbWeight } from "react-icons/tb";
import { GiMagicPalm } from "react-icons/gi";
import { AiOutlineLineHeight } from "react-icons/ai";
import AboutCard from "../components/AboutCard";
import PokemonStats from "../components/PokemonStats";
export default function PokemonDetails() {
  const { id } = useParams(),
    [pokemonInfo, setPokemonInfo] = useState<PokemonInfoType>(),
    [pokemonDetails, setPokemonDetails] = useState<PokemonSpeciesType>(),
    [randomType, setRandomType] = useState<string>(""),
    minNum = 1,
    maxNum = 1025;

  useEffect(() => {
    const fetchPokemonInfo = async () => {
      const responseInfo = await axiosRequest(`/api/v2/pokemon/${id}`),
        responseDetails = await axiosRequest(`/api/v2/pokemon-species/${id}`);
      setPokemonInfo({ ...responseInfo });

      responseDetails.flavor_text_entries =
        responseDetails.flavor_text_entries.filter(
          (element: FlavorTextType) => element.language.name === "en"
        );

      setPokemonDetails({ ...responseDetails });

      setRandomType(
        responseInfo.types[
          Math.floor(Math.random() * responseInfo?.types.length)
        ].type?.name
      );
    };

    fetchPokemonInfo();
  }, [id]);

  return (
    <div className={`bg-${randomType} select-none text-sm`}>
      <div className="container flex flex-col mx-auto h-screen p-2 relative detail-page">
        <div className="flex items-start justify-evenly capitalize">
          <div className="w-1/6 flex flex-col justify-between items-start h-full">
            <span className="text-2xl font-semibold text-white text-nowrap">
              {pokemonInfo?.name}
            </span>
            {minNum !== pokemonInfo?.id && (
              <Link to={`/pokedex/${Number(id) - 1}`}>
                <Icon color="white" boxSize={10} as={IoIosArrowBack} />
              </Link>
            )}
          </div>
          <img
            className="w-52 translate-y-14"
            loading="lazy"
            src={`${image_base_url}/other/official-artwork/${id}.png`}
          />
          <div className="w-1/6 flex flex-col justify-between items-end h-full">
            <span className="text-sm font-semibold text-white">
              #{pokemonNumberPadding(pokemonInfo?.id.toString() || "")}
            </span>
            {maxNum !== pokemonInfo?.id && (
              <Link to={`/pokedex/${Number(id) + 1}`}>
                <Icon color="white" boxSize={10} as={IoIosArrowForward} />
              </Link>
            )}
          </div>
        </div>
        <div className="flex-grow-2 rounded-md list-content">
          <div className="mt-12">
            <div className="flex justify-center gap-4">
              {pokemonInfo?.types.map((element, idx) => (
                <PokemonTypeCard key={idx}>{element.type.name}</PokemonTypeCard>
              ))}
            </div>
            <span
              className={`pt-4 flex justify-center text-lg font-bold text-${randomType}`}
            >
              About
            </span>
            <div className="flex justify-evenly">
              <AboutCard
                title="Weight"
                icon={TbWeight}
                details={kilogramToPound(pokemonInfo?.weight) + " lbs"}
              />
              <AboutCard
                title="Height"
                icon={AiOutlineLineHeight}
                details={
                  centimeterToFeet(pokemonInfo?.height).replace(".", "' ") + '"'
                }
              />
              <AboutCard
                title="Abilities"
                icon={GiMagicPalm}
                details={
                  (pokemonInfo?.abilities.length === 1
                    ? pokemonInfo.abilities[0]
                    : pokemonInfo?.abilities.find((item) => item.is_hidden)
                  )?.ability?.name || ""
                }
                hiddenDetails={
                  pokemonInfo?.abilities.length === 1
                    ? ""
                    : (
                        pokemonInfo?.abilities.find(
                          (item) => !item.is_hidden
                        ) || {}
                      ).ability?.name || ""
                }
              />
            </div>
            <div className="text-center mt-2 px-2 text-sm">
              {(
                pokemonDetails?.flavor_text_entries[
                  randomNumber(pokemonDetails?.flavor_text_entries.length)
                ]?.flavor_text || ""
              ).replace(/\f/g, " ")}
            </div>
            <span
              className={`pt-4 flex justify-center text-lg font-bold text-${randomType}`}
            >
              Base Stat
            </span>
            <div className={`flex-grow text-${randomType} pt-6 px-2 md:px-24`}>
              {pokemonInfo?.stats.map((stats, idx) => (
                <PokemonStats
                  key={idx}
                  title={stats.stat.name}
                  value={stats.base_stat}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
