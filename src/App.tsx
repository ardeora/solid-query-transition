import {
  Component,
  createEffect,
  createRenderEffect,
  createResource,
  Show,
  Suspense,
} from "solid-js";

import logo from "./logo.svg";
import styles from "./App.module.css";
import { createSignal } from "solid-js";
import { createQuery } from "../../../../Workspace/solid-lib-starter/src";

const App: Component = () => {
  return (
    <div class={styles.App}>
      <h1>Suspense test</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <Pokemon />
      </Suspense>
    </div>
  );
};

interface Pokemon {
  name: string;
  weight: number;
  height: number;
  base_experience: number;
}

const Pokemon: Component = () => {
  const [pokemon, setPokemon] = createSignal("");

  const query = createQuery(() => ({
    queryKey: ["pokemon", pokemon()],
    queryFn: async () => {
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemon()}`
      );
      if (!response.ok) {
        return {
          name: "Not found",
          weight: 0,
          height: 0,
          base_experience: 0,
        } as Pokemon;
      }
      if (pokemon() === "") {
        return {
          name: "Initial value",
          weight: 0,
          height: 0,
          base_experience: 0,
        } as Pokemon;
      }
      return response.json() as Promise<Pokemon>;
    },
    placeholderData: (prevData) => prevData,
  }));

  // const [data] = createResource(
  //   pokemon,
  //   async () => {
  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //     const response = await fetch(
  //       `https://pokeapi.co/api/v2/pokemon/${pokemon()}`
  //     );
  //     if (!response.ok) {
  //       return {
  //         name: "Not found",
  //         weight: 0,
  //         height: 0,
  //         base_experience: 0,
  //       } as Pokemon;
  //     }
  //     return response.json() as Promise<Pokemon>;
  //   },
  //   {
  //     initialValue: {
  //       name: "Not foundsssssssss",
  //       weight: 0,
  //       height: 0,
  //       base_experience: 0,
  //     },
  //   }
  // );

  // createRenderEffect(() => {
  //   console.log("Query", { ...query });
  // });

  return (
    <>
      <input
        type="text"
        value={pokemon()}
        onInput={(e) => setPokemon(e.currentTarget.value)}
      />
      <Show when={query.data} keyed>
        {(data) => (
          <div>
            <h2>{data.name}</h2>
            <p>Weight: {data.weight}</p>
            <p>Height: {data.height}</p>
            <p>Base experience: {data.base_experience}</p>
          </div>
        )}
      </Show>
    </>
  );
};

export default App;
