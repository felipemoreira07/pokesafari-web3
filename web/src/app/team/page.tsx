"use client";

import { getAbility, getMoves } from "@/services";
import { IMove, useStore } from "@/store";
import { Moves } from "@/utils/enum/Moves";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Team() {
  const [moves, setMoves] = useState<IMove[]>([]);
  const [abilityDescriptions, setAbilityDescriptions] = useState<string[]>([]);
  const account = useActiveAccount();
  const router = useRouter();
  const store = useStore();

  const getPokeMoves = async () => {
    if (!store.selectedPokemon) return;

    try {
      const movesData = await Promise.all(
        store.selectedPokemon.moves.map(async (move) => {
          const data = await getMoves(move);
          return data;
        })
      );
      setMoves(movesData);
    } catch (error) {
      console.error("Error while searching moves:", error);
    }
  };

  const getPokeAbility = async () => {
    if (!store.selectedPokemon) return;

    try {
      const data = await getAbility(store.selectedPokemon.ability);
      setAbilityDescriptions(data);
    } catch (error) {
      console.error("Error while searching ability:", error);
    }
  };

  useEffect(() => {
    (async () => {
      store.setLoading(true);
      await Promise.all([getPokeMoves(), getPokeAbility()]);
      store.setLoading(false);
    })();
  }, [store.selectedPokemon]);

  useEffect(() => {
    if (!account) router.push("/");
    if (!store.selectedPokemon) router.push("/safari");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16">
      <main className="flex flex-col gap-8 row-start-2 items-center justify-center">
        <h2 className="text-5xl font-semibold">Your team</h2>

        <div className="bg-white rounded-lg p-10 flex items-center justify-center gap-20 text-black">
          <div className="flex items-center justify-center gap-10 rounded-lg p-4">
            <div className="flex flex-col gap-2">
              {moves.map((m) =>
                store.isLoading ? (
                  <div
                    key={m.name}
                    className="w-52 p-3 bg-gray-100 rounded-md border-gray-500 border-2"
                  >
                    <Skeleton height={22} />
                    <div className="mt-1" />
                    <Skeleton height={22} />
                  </div>
                ) : (
                  <div
                    key={m.name}
                    className="p-3 bg-gray-200 rounded-md border-gray-500 border-2"
                  >
                    <p className="font-semibold">
                      <span
                        className="text-white px-2 py-1 rounded-md mr-2"
                        style={{ background: Moves.getColor(m.type) }}
                      >
                        {m.type}
                      </span>
                      {m.name}
                    </p>
                    <p className="mt-1">
                      <span>Power: {m.power ?? "--"}</span>
                      <span className="ml-4">
                        PP: {m.pp}/{m.pp}
                      </span>
                    </p>
                  </div>
                )
              )}
            </div>

            <div className="flex flex-col">
              <p className="text-xl font-semibold">
                {store.selectedPokemon?.name}
              </p>
              <img
                alt={store.selectedPokemon?.name}
                src={store.selectedPokemon?.url}
                width={100}
                height={100}
              />
              <div className="max-w-xs">
                <p>Ability: {store.selectedPokemon?.ability}</p>
                <p className="mt-1">Description:</p>
                {abilityDescriptions.map((desc, i) => (
                  <p key={i}>{desc}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 mt-2">
            {store.teamPokemons.map((p) => (
              <div
                role="button"
                key={p.nickname}
                className="flex flex-col items-center justify-center bg-white rounded-lg p-4 cursor-pointer hover:bg-gray-200 active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => {
                  store.setSelectedPokemon(p);
                  router.push("/team");
                }}
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
