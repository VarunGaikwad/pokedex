import { Flex, Image, Text } from "@chakra-ui/react";
import {
  image_base_url,
  PokemonListType,
  pokemonNumberPadding,
} from "../data/common";
import missingno from "../assets/missingno.png";
import { useEffect, useState } from "react";
export default function PokemonCard({
  entry_number,
  pokemon_species,
}: PokemonListType) {
  const [pokeImg, setPokeImg] = useState<string>(missingno);

  useEffect(() => {
    const fetchImage = new window.Image();
    fetchImage.src = `${image_base_url}/other/official-artwork/${entry_number}.png`;
    fetchImage.onload = () => {
      setTimeout(() => {
        setPokeImg(fetchImage.src);
      }, 100);
    };
  }, [entry_number]);

  return (
    <Flex
      maxHeight="max-content"
      direction="column"
      height="max-content"
      bgColor="#eee"
      borderRadius="1rem"
      boxShadow="0px 0px 10px 5px rgba(0,0,0,0.1),inset 0px 3.5rem 5px 0px white"
      padding={2}
    >
      <Text className="text-xs" opacity={0.75} align="end">
        #{pokemonNumberPadding(entry_number.toString())}
      </Text>
      <Image height={50} loading="lazy" margin="auto" src={pokeImg} />
      <Text marginTop={1} className="text-xs font-semibold" align="center">
        {pokemon_species.name}
      </Text>
    </Flex>
  );
}
