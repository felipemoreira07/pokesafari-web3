"use client";

import { useState } from "react";
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
import { useActiveAccount, useContractEvents } from "thirdweb/react";
import { useStore } from "@/store";
import { useLoadingBar } from "react-top-loading-bar";
import { Pokeball } from "@/utils/enum/PokeBalls";
import { sepolia } from "thirdweb/chains";
import { toast } from "react-toastify";
import {
  preparedPokemonCapturedEvent,
  preparedPokemonEscapedEvent,
  preparedPokemonSentToOakEvent,
} from "@/utils/events";

type PokeballModalProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

const POKEBALL_PRICE = "0.001 ether";
const GREATBALL_PRICE = "0.002 ether";
const ULTRABALL_PRICE = "0.005 ether";

export default function EventsModal(props: PokeballModalProps) {
  const store = useStore();

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
                    PokeShop
                  </DialogTitle>
                  <div className="mt-5 text-md text-gray-500">
                    <p>Buy some balls and go catch some pokes!</p>
                    <p>
                      Prices: 1 PokeBall - {POKEBALL_PRICE} / 1 GreatBall -{" "}
                      {GREATBALL_PRICE} / 1 UltraBall - {ULTRABALL_PRICE}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-8 pt-3 pb-8 flex flex-row-reverse">
              <button
                type="button"
                onClick={() => props.setOpen(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-md font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                disabled={store.isLoading}
              >
                {store.isLoading ? "..." : "Cancel"}
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
