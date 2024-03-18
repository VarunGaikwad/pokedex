import axios from "axios";
import { PokemonListType, base_url } from "../data/common";
import { ChangeEvent, useEffect, useState } from "react";
import PokemonCard from "../components/PokemonCard";

export default function NationalDex() {
  const [originalPokemonList, setOriginalPokemonList] = useState<
      PokemonListType[]
    >([]),
    [filteredPokemonList, setFilteredPokemonList] = useState<PokemonListType[]>(
      []
    ),
    [searchTerm, setSearchTerm] = useState<string>(
      localStorage.getItem("searchText") || ""
    );

  useEffect(() => {
    const fetchPokemon = async () => {
      const {
        data: { pokemon_entries },
      } = await axios.get(`${base_url}/api/v2/pokedex/1/`);
      setOriginalPokemonList([...pokemon_entries]);
      setFilteredPokemonList([...pokemon_entries]);
    };
    fetchPokemon();
  }, []);

  useEffect(() => {
    setFilteredPokemonList(
      originalPokemonList.filter(({ pokemon_species: { name } }) =>
        name.includes(searchTerm.toLocaleLowerCase())
      )
    );
    localStorage.setItem("searchText", searchTerm);
  }, [searchTerm, originalPokemonList]);

  return (
    <div className="flex flex-col justify-center">
      <div className="sticky top-0 bg-white z-10 w-full py-2 flex justify-between items-center p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Pokémon"
            value={searchTerm}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            style={{ paddingRight: "40px" }}
          />
          {searchTerm && (
            <button
              className="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setSearchTerm("")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                viewBox="0 0 329.26933 329"
              >
                <path d="m194.800781 164.769531 128.210938-128.214843c8.34375-8.339844 8.34375-21.824219 0-30.164063-8.339844-8.339844-21.824219-8.339844-30.164063 0l-128.214844 128.214844-128.210937-128.214844c-8.34375-8.339844-21.824219-8.339844-30.164063 0-8.34375 8.339844-8.34375 21.824219 0 30.164063l128.210938 128.214843-128.210938 128.214844c-8.34375 8.339844-8.34375 21.824219 0 30.164063 4.15625 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921875-2.089844 15.082031-6.25l128.210937-128.214844 128.214844 128.214844c4.160156 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921874-2.089844 15.082031-6.25 8.34375-8.339844 8.34375-21.824219 0-30.164063zm0 0" />
              </svg>
            </button>
          )}
        </div>
        <div className="mx-2 text-2xl text-slate-700">PokéDex</div>
      </div>
      <div className="max-w-screen-xl flex flex-row flex-wrap justify-center">
        {filteredPokemonList.map(({ entry_number, pokemon_species }) => (
          <PokemonCard
            key={entry_number}
            entry_number={entry_number}
            pokemon_species={pokemon_species}
          />
        ))}
      </div>
    </div>
  );
}
