import { CloseIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import { SearchInputProps } from "../data/common";

export default function SearchInput({
  searchInput,
  setSearchInput,
}: SearchInputProps) {
  return (
    <InputGroup>
      <InputLeftElement pointerEvents="none">
        <SearchIcon />
      </InputLeftElement>
      <Input
        value={searchInput}
        onChange={(event) => {
          setSearchInput(event.target.value);
        }}
        bg="white"
        focusBorderColor="none"
        borderRadius="12.5rem"
        width="100%"
        type="text"
        className="search-shadow"
        placeholder="Pokémon"
      />
      <InputRightElement cursor="pointer">
        <CloseIcon
          visibility={!searchInput ? "hidden" : "visible"}
          onClick={() => setSearchInput("")}
        />
      </InputRightElement>
    </InputGroup>
  );
}
