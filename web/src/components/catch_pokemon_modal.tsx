"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { prepareContractCall, sendTransaction, waitForReceipt } from "thirdweb";
import { contract, client } from "@/utils/constants";
import { useActiveAccount } from "thirdweb/react";
import { INewPokemon, useStore } from "@/store";
import { useLoadingBar } from "react-top-loading-bar";
import { sepolia } from "thirdweb/chains";
import { toast } from "react-toastify";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { FormatPokemon } from "@/utils/formatPokemon";

type PokeballModalProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

export default function CatchPokemonModal(props: PokeballModalProps) {
  const [pokeballType, setPokeballType] = useState<number>(1);
  const account = useActiveAccount();
  const store = useStore();
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
      const filteredPokemon = FormatPokemon.formatSafariPokemon(data);
      store.setNewPokemon(filteredPokemon);
    } catch (error) {
      console.error("Erro ao buscar Pokémon:", error);
    }
  };

  const run = () => {
    store.setEnablePokemonCapturedEvent(true);
    store.setEnablePokemonEscapedEvent(true);
    props.setOpen(false);
    store.setLoading(false);
    store.resetNewPokemon();
  };

  const catchPokemon = async () => {
    if (!account || !store.newPokemon) return;

    const _name = store.newPokemon.name;
    const _nickname = store.newPokemon.name;
    const _url = store.newPokemon.url;
    const _captured_at = BigInt(store.newPokemon.captured_at);
    const _types = store.newPokemon.types;
    const _ability = store.newPokemon.ability;
    const _weight = BigInt(store.newPokemon.weight);
    const _height = BigInt(store.newPokemon.height);
    const _moves = store.newPokemon.moves;
    const _pokeball_type = BigInt(pokeballType);
    const _catch_accuracy = BigInt(Math.floor(Math.random() * 100));

    try {
      startLoadingBar();
      store.setLoading(true);
      const transaction = prepareContractCall({
        contract,
        method:
          "function catchPokemon(string _name, string _nickname, string _url, uint256 _captured_at, string[] _types, string _ability, uint256 _weight, uint256 _height, string[] _moves, uint256 _pokeball_type, uint256 _catch_accuracy)",
        params: [
          _name,
          _nickname,
          _url,
          _captured_at,
          _types,
          _ability,
          _weight,
          _height,
          _moves,
          _pokeball_type,
          _catch_accuracy,
        ],
      });

      const { transactionHash } = await sendTransaction({
        transaction,
        account,
      });

      const receipt = await waitForReceipt({
        chain: sepolia,
        client,
        transactionHash,
      });

      if (receipt.status === "success") {
        // toast.success(`${store.newPokemon.name} caught with success!!`);
        store.setRefetchPokemons("team");
        store.setRefetchPokeball(pokeballType);
      } else {
        // toast.error("Pokemon ran away..");
      }
    } catch (e: any) {
      console.log("error:", e.message);
    } finally {
      completeLoadingBar();
      run();
    }
  };

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
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in my-8 w-full max-w-md data-[closed]:scale-95"
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
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-md font-semibold text-white shadow-sm hover:bg-red-500 ml-3 disabled:bg-gray-400"
                disabled={store.isLoading}
              >
                {store.isLoading ? "..." : "Capture"}
              </button>
              <button
                type="button"
                data-autofocus
                onClick={() => run()}
                className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-md font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                disabled={store.isLoading}
              >
                {store.isLoading ? "..." : "Run"}
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
