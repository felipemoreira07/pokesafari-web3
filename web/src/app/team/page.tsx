"use client";

import { useStore } from "@/store";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useActiveAccount } from "thirdweb/react";

export default function Team() {
  const account = useActiveAccount();
  const router = useRouter();
  const store = useStore();

  useEffect(() => {
    // const getMoves = async () => {
    //   try {
    //     const response = await fetch(
    //       `https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`
    //     );
    //     const data: INewPokemon = await response.json();
    //     const filteredPokemon = FormatPokemon.formatSafariPokemons(data);
    //     store.setNewPokemon(filteredPokemon);
    //     console.log(store.newPokemon);
    //   } catch (error) {
    //     console.error("Erro ao buscar Pokémon:", error);
    //   }
    // };
  }, []);

  useEffect(() => {
    if (!account) router.push("/");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16">
      <main className="flex flex-col gap-8 row-start-2 items-center justify-center">
        <h2 className="text-5xl font-semibold">Your team</h2>

        <div className="bg-white rounded-lg p-10 flex items-center justify-center gap-20">
          <div className="flex items-center justify-center rounded-lg p-4">
            <div className="text-black">
              <div>
                {store.selectedPokemon?.moves.map((m) => (
                  <p className="">{m}</p>
                ))}
              </div>
              <div>
                <p>Ability</p>
                <p>{store.selectedPokemon?.ability}</p>
              </div>
            </div>

            <div className="flex flex-col">
              <p className="text-black text-xl font-semibold">
                {store.selectedPokemon?.name}
              </p>
              <img
                alt={store.selectedPokemon?.name}
                src={store.selectedPokemon?.url}
                width={100}
                height={100}
              />
            </div>
          </div>

          <div className="flex flex-col gap-5 mt-2">
            {store.teamPokemons.map((p) => (
              <div
                role="button"
                key={p.nickname}
                className="flex flex-col items-center justify-center bg-white rounded-lg p-4 cursor-pointer hover:bg-gray-200 active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => router.push("/team")}
              >
                <img alt={p.name} src={p.url} width={60} height={60} />
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => router.push("/safari")}>Go to Safari</button>
      </main>
    </div>
  );
}
