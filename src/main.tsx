import ReactDOM from "react-dom/client";
import "./styles/global.css";
import { ChakraProvider } from "@chakra-ui/react";

import {
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import NationalDex from "./pages/NationalDex.tsx";
import PokemonDetails from "./pages/PokemonDetails.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<NationalDex />}>
      <Route index element={<Navigate to="pokedex" replace />} />
      <Route path="pokedex">
        <Route path="" element={<NationalDex />} />
        <Route path=":id" element={<PokemonDetails />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ChakraProvider>
    <RouterProvider router={router} />
  </ChakraProvider>
);
