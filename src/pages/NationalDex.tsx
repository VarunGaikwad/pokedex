import { useEffect, useState } from "react";
import PokeBall from "../assets/pokeball.svg";
import SearchInput from "../components/SearchInput";
import SortMenu from "../components/SortMenu";
import { PokemonListType, SortCriteria } from "../data/common";
import PokemonCard from "../components/PokemonCard";
import PokemonList from "../data/pokemon_list.json";

export default function NationalDex() {
  const [sort, setSort] = useState<SortCriteria>({
      order: "asc",
      type: "number",
    }),
    [filteredPokemonList, setFilteredPokemonList] =
      useState<PokemonListType[]>(PokemonList),
    [searchInput, setSearchInput] = useState<string>("");

  useEffect(() => {
    const { type, order } = sort,
      getFiltedSorted = () => {
        const result = PokemonList.filter((item) =>
          item.pokemon_species.name.includes(searchInput.toLocaleLowerCase())
        );

        if (type === "number") {
          if (order === "asc")
            return [
              ...result.sort(
                (first, second) => first.entry_number - second.entry_number
              ),
            ];

          return [
            ...result.sort(
              (first, second) => -first.entry_number + second.entry_number
            ),
          ];
        }
        if (order === "asc")
          return [
            ...result.sort((first, second) =>
              first.pokemon_species.name.localeCompare(
                second.pokemon_species.name
              )
            ),
          ];

        return [
          ...result.sort((first, second) =>
            second.pokemon_species.name.localeCompare(
              first.pokemon_species.name
            )
          ),
        ];
      };

    setFilteredPokemonList(getFiltedSorted);
  }, [sort, searchInput]);

  return (
    <div className="bg-primary select-none">
      <div className="container flex flex-col mx-auto h-screen gap-1 p-1 pt-0">
        <div>
          <span className="flex items-center gap-1 font-bold text-2xl text-white">
            <img className="size-7" src={PokeBall} />
            Pokédex
          </span>
          <div className="flex items-center gap-1">
            <SearchInput {...{ searchInput, setSearchInput }} />
            <SortMenu {...{ sort, setSort }} />
          </div>
        </div>
        <div className="flex-grow rounded-md list-content capitalize overflow-y-auto">
          <div className="flex flex-wrap justify-evenly overflow-y-auto">
            {filteredPokemonList.map(
              ({ entry_number, pokemon_species, types }, idx) => (
                <PokemonCard
                  {...{ entry_number, pokemon_species, types }}
                  key={idx}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
