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

interface PokeballModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const POKEBALL_PRICE = "0.001 ether";
const GREATBALL_PRICE = "0.002 ether";
const ULTRABALL_PRICE = "0.005 ether";

export default function CatchPokemonModal(props: PokeballModalProps) {
  const [pokeballType, setPokeballType] = useState<number>(1);
  const [quantity, setQuantity] = useState<number>(1);
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
    // fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`)
    //   .then((data) => data.json())
    //   .then((pokemon: INewPokemon) => {
    //     store.setNewPokemon(pokemon);
    //   });

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`
      );
      const data: INewPokemon = await response.json();

      // Filtra os dados relevantes
      const filteredPokemon: IPokemon = {
        name: data.name,
        url: data.sprites.front_default,
        moves: data.moves.map((move: { move: { name: string } }) => ({
          name: move.move.name,
          moveType: "normal",
        })),
        ability: data.abilities.map(
          (ability: { ability: { name: string } }) => ability.ability.name
        )[0],
        types: data.types.map(
          (type: { type: { name: string } }) => type.type.name
        ),
        weight: data.weight,
        height: data.height,
        captured_at: Date.now(),
        id: randomPokemonId,
        nickname: "",
      };

      // Atualiza o estado na store
      store.setNewPokemon(filteredPokemon);
      console.log(store.newPokemon);
    } catch (error) {
      console.error("Erro ao buscar Pokémon:", error);
    }
  };

  useEffect(() => {
    if (!account) router.push("/");
    getNewPokemon();
  }, []);

  return (
    <Dialog open={props.open} onClose={props.setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-700/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-md data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white p-8">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
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
                      <p>A wild {store.newPokemon.name} appeared!</p>
                    </div>
                  ) : (
                    <div>...</div>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-8 pt-3 pb-8 flex flex-row-reverse">
              <button
                type="button"
                // onClick={addPokeballs}
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-md font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto disabled:bg-gray-400"
                disabled={store.isLoading}
              >
                {store.isLoading ? "..." : "Capture"}
              </button>
              <button
                type="button"
                data-autofocus
                onClick={() => props.setOpen(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-md font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
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
