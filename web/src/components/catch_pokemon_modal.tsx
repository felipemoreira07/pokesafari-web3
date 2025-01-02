"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import {
  prepareContractCall,
  sendTransaction,
  toWei,
  waitForReceipt,
} from "thirdweb";
import { contract, client } from "@/utils/constants";
import { useActiveAccount } from "thirdweb/react";
import { INewPokemon, IPokemon, useAppStore } from "@/store";
import { useLoadingBar } from "react-top-loading-bar";
import { useRouter } from "next/navigation";
import { Pokeball } from "@/utils/enum/PokeBalls";
import { sepolia } from "thirdweb/chains";
import { toast, ToastContainer } from "react-toastify";
import Image from "next/image";
import { getFilteredPokemon } from "@/utils/getFilteredPokemon";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";

interface PokeballModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function CatchPokemonModal(props: PokeballModalProps) {
  const [pokeballType, setPokeballType] = useState<number>(1);
  const router = useRouter();
  const account = useActiveAccount();
  const store = useAppStore();
  const { start: startLoadingBar, complete: completeLoadingBar } =
    useLoadingBar({
      color: "blue",
      height: 2,
    });
  const randomPokemonId = Math.floor(Math.random() * 1025) + 1;

  const getNewPokemon = async () => {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`
      );
      const data: INewPokemon = await response.json();
      const filteredPokemon = getFilteredPokemon(data, randomPokemonId);
      store.setNewPokemon(filteredPokemon);
      console.log(store.newPokemon);
    } catch (error) {
      console.error("Erro ao buscar Pokémon:", error);
    }
  };

  const run = () => {
    props.setOpen(false);
    store.resetNewPokemon();
  };

  const catchPokemon = async () => {
    if (!account || !store.newPokemon) return;

    const name = store.newPokemon.name;
    const nickname = store.newPokemon.name;
    const url = store.newPokemon.url;
    const captured_at = BigInt(store.newPokemon.captured_at);
    const types = store.newPokemon.types;
    const ability = store.newPokemon.ability;
    const weight = BigInt(store.newPokemon.weight);
    const height = BigInt(store.newPokemon.height);
    const moves = store.newPokemon.moves;
    const pokeball_type = BigInt(pokeballType);
    console.log(pokeball_type);
    const catchAccuracy = BigInt(Math.floor(Math.random() * 100));

    startLoadingBar();
    const transaction = prepareContractCall({
      contract,
      method:
        "function catchPokemon(string name, string nickname, string url, uint256 captured_at, string[] types, string ability, uint256 weight, uint256 height, (string name, string moveType)[] moves, uint256 pokeball_type, uint256 catchAccuracy)",
      params: [
        name,
        nickname,
        url,
        captured_at,
        types,
        ability,
        weight,
        height,
        moves,
        pokeball_type,
        catchAccuracy,
      ],
    });

    const { transactionHash } = await sendTransaction({
      transaction,
      account,
    });
    console.log(transactionHash);

    const receipt = await waitForReceipt({
      chain: sepolia,
      client,
      transactionHash,
    });
    console.log("receipt", receipt);

    if (receipt.status === "success") {
      toast.success(`${store.newPokemon.name} caught with success!!`);
      store.setRefetchPokemons("team");
    } else {
      toast.error("Pokemon ran away..");
    }

    completeLoadingBar();
    run();
  };

  useEffect(() => {
    if (!account) router.push("/");
  }, []);

  useEffect(() => {
    if (!store.newPokemon) getNewPokemon();
  }, [store.newPokemon]);

  return (
    <Dialog open={props.open} onClose={props.setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-700/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in my-8 w-full max-w-md data-[closed]:translate-y-0 data-[closed]:scale-95"
          >
            <div className="bg-white p-8 flex flex-col items-center justify-center">
              <DialogTitle
                as="h3"
                className="font-semibold text-2xl text-gray-900"
              >
                You encounter a Pokemon!
              </DialogTitle>
              {store.newPokemon ? (
                <div className="mt-5 text-lg text-gray-500 flex flex-col items-center justify-center">
                  <img
                    alt={store.newPokemon.name}
                    src={store.newPokemon.url}
                    width={150}
                    height={150}
                  />
                  <p>
                    A wild {capitalizeFirstLetter(store.newPokemon.name)}{" "}
                    appeared!
                  </p>
                </div>
              ) : (
                <div>...</div>
              )}
            </div>
            <div className="bg-gray-50 px-8 pt-3 pb-8 flex flex-row-reverse">
              <select
                id="pokeballType"
                className="w-32 p-3 rounded-md bg-white text-red-500 ml-3 font-semibold shadow-md outline-none focus:ring-2 focus:ring-red-300"
                value={pokeballType}
                onChange={(e) => setPokeballType(Number(e.target.value))}
              >
                <option value={1}>Pokeball</option>
                <option value={2}>Greatball</option>
                <option value={3}>Ultraball</option>
              </select>
              <button
                type="button"
                onClick={catchPokemon}
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-md font-semibold text-white shadow-sm hover:bg-red-500 ml-3 w-auto disabled:bg-gray-400"
                disabled={store.isLoading}
              >
                {store.isLoading ? "..." : "Capture"}
              </button>
              <button
                type="button"
                data-autofocus
                onClick={() => run()}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-md font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mt-0 w-auto"
                disabled={store.isLoading}
              >
                {store.isLoading ? "..." : "Run"}
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
      <ToastContainer aria-label="" />
    </Dialog>
  );
}
