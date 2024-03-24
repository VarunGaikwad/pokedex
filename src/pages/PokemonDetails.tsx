import { Flex, Icon, Image, Text } from "@chakra-ui/react";
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
import { TbWeight } from "react-icons/tb";
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

  if (!pokemonInfo) {
    return <></>;
  }

  return (
    <div className={`bg-${randomType} select-none text-sm`}>
      <div className="container flex flex-col mx-auto h-screen p-2">
        <div>
          <Flex
            className="capitalize"
            dir="row"
            alignItems="flex-end"
            pt={4}
            justifyContent="space-between"
          >
            <Text className="text-2xl font-semibold text-white">
              {pokemonInfo?.name}
            </Text>
            <Text className="text-sm font-semibold text-white">
              #{pokemonNumberPadding(pokemonInfo?.id.toString())}
            </Text>
          </Flex>
          <Flex px={2} alignItems="center" className="translate-y-20">
            <Icon color="white" boxSize={10} as={IoIosArrowBack} />
            <Image
              className="w-56"
              loading="lazy"
              margin="auto"
              src={`${image_base_url}/other/official-artwork/${id}.png`}
            />
            <Icon color="white" boxSize={10} as={IoIosArrowForward} />
          </Flex>
        </div>
        <div className="flex-grow-2 rounded-md list-content">
          <Flex gap={2} textAlign="center" direction={"column"} mt={16}>
            <Flex gap={4} justifyContent="center">
              {pokemonInfo.types.map((element) => (
                <PokemonTypeCard>{element.type.name}</PokemonTypeCard>
              ))}
            </Flex>
            <Text className={`text-xl font-semibold text-${randomType}`}>
              About
            </Text>
            <div>
              <div>
                <div>
                  <Icon as={TbWeight} />
                </div>
              </div>
            </div>
          </Flex>
        </div>
      </div>
    </div>
  );
}
