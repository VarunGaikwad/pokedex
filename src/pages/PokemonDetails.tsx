import { Flex, Icon, Image, Text } from "@chakra-ui/react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import { image_base_url } from "../data/common";
import PokemonTypeCard from "../components/PokemonTypeCard";
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
    <div className="bg-ice select-none">
      <div className="container flex flex-col mx-auto h-screen p-2">
        <Flex
          className="capitalize"
          dir="row"
          alignItems="flex-end"
          pt={4}
          justifyContent="space-between"
        >
          <Text className="text-2xl font-semibold text-white" fontSize="3rem">
            bulbasaur
          </Text>
          <Text className="text-lg font-semibold text-white">#001</Text>
        </Flex>
        <Flex px={2} alignItems="center" className="translate-y-20">
          <Icon color="white" boxSize={10} as={IoIosArrowBack} />
          <Image
            width={250}
            loading="lazy"
            margin="auto"
            src={`${image_base_url}/other/dream-world/1.svg`}
          />
          <Icon color="white" boxSize={10} as={IoIosArrowForward} />
        </Flex>
        <div className="flex-grow-2 rounded-md list-content">
          <Flex gap={2} textAlign="center" direction={"column"} mt={24}>
            <Flex gap={4} justifyContent="center">
              <PokemonTypeCard>grass</PokemonTypeCard>
              <PokemonTypeCard>poison</PokemonTypeCard>
            </Flex>
            <Text className="text-2xl font-semibold text-ice">About</Text>
          </Flex>
        </div>
      </div>
    </div>
  );
}
