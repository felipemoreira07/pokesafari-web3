"use client";

import CatchPokemonModal from "@/components/catch_pokemon_modal";
import PokeballModal from "@/components/pokeball_modal";
import { IPokemon, useStore } from "@/store";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { contract } from "@/utils/constants";
import { Pokeball } from "@/utils/enum/PokeBalls";
import { FormatPokemon } from "@/utils/formatPokemon";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { LoadingBarContainer } from "react-top-loading-bar";
import { useActiveAccount, useReadContract } from "thirdweb/react";

function SafariUI() {
  const [openPokeballModal, setOpenPokeballModal] = useState<boolean>(false);
  const [catchPokeballModal, setCatchPokeballModal] = useState<boolean>(false);
  const store = useStore();
  const account = useActiveAccount();
  const router = useRouter();

  const {
    data: pokeballs,
    refetch: refetchPokeball,
    isPending: isPendingPokeballs,
    isRefetching: isRefetchingPokeballs,
  } = useReadContract({
    contract,
    method: "function getPokeballs() view returns (uint256)",
    params: [],
  });

  const {
    data: greatballs,
    refetch: refetchGreatball,
    isPending: isPendingGreatballs,
    isRefetching: isRefetchingGreatballs,
  } = useReadContract({
    contract,
    method: "function getGreatballs() view returns (uint256)",
    params: [],
  });

  const {
    data: ultraballs,
    refetch: refetchUltraball,
    isPending: isPendingUltraballs,
    isRefetching: isRefetchingUltraballs,
  } = useReadContract({
    contract,
    method: "function getUltraballs() view returns (uint256)",
    params: [],
  });

  const { data: teamPokemons, refetch: refetchTeamPokemons } = useReadContract({
    contract,
    method:
      "function getAllPokemons() view returns ((string name, string nickname, string url, uint256 captured_at, string[] types, string ability, uint256 weight, uint256 height, string[] moves)[])",
    params: [],
  });

  const { data: oakPokemons, refetch: refetchOakPokemons } = useReadContract({
    contract,
    method:
      "function getAllOakPokemons() view returns ((string name, string nickname, string url, uint256 captured_at, string[] types, string ability, uint256 weight, uint256 height, string[] moves)[])",
    params: [],
  });

  const selectTeamPokemon = (pokemon: IPokemon) => {
    store.setSelectedPokemon(pokemon);
    router.push("/team");
  };

  useEffect(() => {
    if (store.refetchPokeball) {
      if (store.refetchPokeball === Pokeball.enum.Pokeball) refetchPokeball();
      if (store.refetchPokeball === Pokeball.enum.GreatBall) refetchGreatball();
      if (store.refetchPokeball === Pokeball.enum.UltraBall) refetchUltraball();
      store.resetRefetchPokeball();
    }
  }, [store.refetchPokeball]);

  useEffect(() => {
    if (store.refetchPokemons) {
      if (store.refetchPokemons === "team") refetchTeamPokemons();
      if (store.refetchPokemons === "oak") refetchOakPokemons();
      store.resetRefetchPokemons();
    }
  }, [store.refetchPokemons]);

  useEffect(() => {
    if (teamPokemons) {
      const formattedPokemons =
        FormatPokemon.formatContractPokemons(teamPokemons);
      store.setTeamPokemons(formattedPokemons);
    }
  }, [teamPokemons]);

  useEffect(() => {
    if (oakPokemons) {
      const formattedPokemons =
        FormatPokemon.formatContractPokemons(oakPokemons);
      store.setOakPokemons(formattedPokemons);
    }
  }, [oakPokemons]);

  useEffect(() => {
    if (!account) router.push("/");
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 pb-20">
      <div className="flex items-center gap-8">
        <Image
          src="/pokeball.svg"
          alt="Next.js logo"
          width={130}
          height={100}
        />
        <h2 className="text-6xl font-semibold">Safari</h2>
      </div>
      <div className="flex gap-5 mt-5 text-lg font-semibold py-5">
        <div className="flex items-center gap-2">
          <Image
            src="/pokeball.png"
            alt="Next.js logo"
            width={25}
            height={25}
          />
          <p className="text-lg">
            {isPendingPokeballs || isRefetchingPokeballs ? "..." : pokeballs}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Image
            src="/greatball.png"
            alt="Next.js logo"
            width={25}
            height={25}
          />
          <p className="text-lg">
            {isPendingGreatballs || isRefetchingGreatballs ? "..." : greatballs}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Image
            src="/ultraball.png"
            alt="Next.js logo"
            width={25}
            height={25}
          />
          <p className="text-lg">
            {isPendingUltraballs || isRefetchingUltraballs ? "..." : ultraballs}
          </p>
        </div>
      </div>

      <div className="pt-5 flex gap-2">
        <button
          onClick={() => setOpenPokeballModal((prev) => !prev)}
          className="bg-white text-black font-semibold rounded-md px-5 py-3"
        >
          Buy some pokeballs here
        </button>
        <button
          onClick={() => setCatchPokeballModal((prev) => !prev)}
          className="bg-white text-black font-semibold rounded-md px-5 py-3"
        >
          Try to catch a pokemon!
        </button>
      </div>

      {teamPokemons && teamPokemons.length > 0 && (
        <div className="mt-10">
          <p>Team Pokemons</p>
          <div className="flex gap-5 mt-2">
            {teamPokemons.map((p) => (
              <div
                role="button"
                key={p.nickname}
                className="flex flex-col items-center justify-center bg-white rounded-lg p-4 cursor-pointer hover:bg-gray-200 active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() =>
                  selectTeamPokemon(FormatPokemon.formatContractPokemon(p))
                }
              >
                <img alt={p.name} src={p.url} width={60} height={60} />
                <p className="text-black">
                  {capitalizeFirstLetter(p.nickname)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {oakPokemons && oakPokemons?.length > 0 && (
        <div className="mt-7">
          <p>Oak Pokemons</p>
          <div className="flex gap-5 mt-2">
            {oakPokemons.map((p) => (
              <div
                role="button"
                key={p.nickname}
                className="flex flex-col items-center justify-center bg-white rounded-lg p-4 cursor-pointer hover:bg-gray-200 active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <img alt={p.name} src={p.url} width={60} height={60} />
                <p className="text-black">{p.nickname}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <LoadingBarContainer>
        <PokeballModal
          open={openPokeballModal}
          setOpen={setOpenPokeballModal}
        />
        <CatchPokemonModal
          open={catchPokeballModal}
          setOpen={setCatchPokeballModal}
        />
      </LoadingBarContainer>
    </div>
  );
}

export default function Safari() {
  return (
    <LoadingBarContainer>
      <SafariUI />
      <ToastContainer aria-label="" />
    </LoadingBarContainer>
  );
}
