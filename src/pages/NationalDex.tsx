import { useEffect, useState } from "react";
import PokeBall from "../assets/pokeball.svg";
import SearchInput from "../components/SearchInput";
import SortMenu from "../components/SortMenu";
import { PokemonListType, SortCriteria } from "../data/common";
import PokemonCard from "../components/PokemonCard";
import PokemonList from "../data/pokemon_list.json";

export default function NationalDex() {
  const [sort, setSort] = useState<SortCriteria>(
      JSON.parse(
        localStorage.getItem("sortSetting") ||
          JSON.stringify({
            order: "asc",
            type: "number",
          })
      )
    ),
    [filteredPokemonList, setFilteredPokemonList] =
      useState<PokemonListType[]>(PokemonList),
    [searchInput, setSearchInput] = useState<string>(
      localStorage.getItem("searchInput") || ""
    );

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
    localStorage.setItem("sortSetting", JSON.stringify(sort));
    localStorage.setItem("searchInput", searchInput);
  }, [sort, searchInput]);

  return (
    <div className="bg-primary select-none">
      <div className="container flex flex-col mx-auto h-screen gap-1 p-1">
        <div className="flex flex-col md:flex-row space-y-1 md:items-center">
          <span className="flex gap-1 font-bold text-2xl text-white">
            <img className="size-7" src={PokeBall} />
            Pokédex
          </span>
          <div className="flex-grow md:ml-2 flex gap-1">
            <SearchInput {...{ searchInput, setSearchInput }} />
            <SortMenu {...{ sort, setSort }} />
          </div>
        </div>
        <div className="flex-grow rounded-md list-content capitalize overflow-y-auto">
          <div className="grid gap-4 grid-cols-3 p-2 md:grid-cols-6">
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
