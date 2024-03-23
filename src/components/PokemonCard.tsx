import { Box, Image, Text } from "@chakra-ui/react";
import { PokemonListType, pokemonNumberPadding } from "../data/common";
import missingno from "../assets/missingno.png";
import { useEffect, useState } from "react";
export default function PokemonCard({
  entry_number,
  pokemon_species,
}: PokemonListType) {
  const [pokeImg, setPokeImg] = useState<string>(missingno);

  useEffect(() => {
    const fetchImage = new window.Image();
    fetchImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${entry_number}.png`;
    fetchImage.onload = () => {
      setTimeout(() => {
        setPokeImg(fetchImage.src);
      }, 100);
    };
  }, [entry_number]);

  return (
    <Box
      bg={"#efefef"}
      width={115}
      height={"max-content"}
      borderRadius="1rem"
      boxShadow={"inset 0 4rem #fff,0 0 .5rem .01rem"}
      padding={2}
      margin={2}
    >
      <Text className="text-xs" opacity={0.75} align="end">
        #{pokemonNumberPadding(entry_number.toString())}
      </Text>
      <Image loading="lazy" margin={"auto"} width={75} src={pokeImg} />
      <Text align="center" className="text-sm">
        {pokemon_species.name}
      </Text>
    </Box>
  );
}
