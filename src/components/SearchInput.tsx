import { CloseIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";

export default function SearchInput() {
  return (
    <InputGroup>
      <InputLeftElement pointerEvents="none">
        <SearchIcon />
      </InputLeftElement>
      <Input
        bg="white"
        focusBorderColor="none"
        borderRadius="12.5rem"
        width="100%"
        type="text"
        className="search-shadow"
        placeholder="Pokémon"
      />
      <InputRightElement cursor="pointer">
        <CloseIcon />
      </InputRightElement>
    </InputGroup>
  );
}
