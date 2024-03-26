import ReactDOM from "react-dom/client";
import "./styles/global.css";
import { ChakraProvider } from "@chakra-ui/react";
import NationalDex from "./pages/NationalDex.tsx";
import {
  Navigate,
  Route,
  RouterProvider,
  createHashRouter,
  createRoutesFromElements,
} from "react-router-dom";
import PokemonDetails from "./pages/PokemonDetails.tsx";
import NotFound from "./pages/NotFound.tsx";

const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<Navigate to="pokemon" replace />} />
      <Route path="pokemon">
        <Route path="" element={<NationalDex />} />
        <Route path=":id" element={<PokemonDetails />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ChakraProvider>
    <RouterProvider router={router} />
  </ChakraProvider>
);
