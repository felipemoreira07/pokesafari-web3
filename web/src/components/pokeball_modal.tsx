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
import { useAppStore } from "@/store";
import { useLoadingBar } from "react-top-loading-bar";
import { useRouter } from "next/navigation";
import { Pokeball } from "@/utils/enum/PokeBalls";
import { sepolia } from "thirdweb/chains";
import { toast } from "react-toastify";

interface PokeballModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const POKEBALL_PRICE = "0.001 ether";
const GREATBALL_PRICE = "0.002 ether";
const ULTRABALL_PRICE = "0.005 ether";

export default function PokeballModal(props: PokeballModalProps) {
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

  const addPokeballs = async () => {
    console.log(account);
    if (!account) return;
    store.setLoading(true);
    startLoadingBar();

    const transaction = await prepareContractCall({
      contract,
      method:
        "function addPokeballs(uint256 _pokeball_type, uint256 quantity) payable",
      params: [BigInt(pokeballType), BigInt(quantity)],
      value: toWei(String(Pokeball.getEtherPrice(pokeballType) * quantity)),
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
      toast.success(`${Pokeball.getLabel(pokeballType)} bought with success!!`);
      store.setRefetchPokeball(pokeballType);
    } else {
      toast.error("Pokeball purchase failed;");
    }
    store.setLoading(false);
    completeLoadingBar();
    props.setOpen(false);
  };

  useEffect(() => {
    if (!account) router.push("/");
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
                    PokeShop
                  </DialogTitle>
                  <div className="mt-5 text-md text-gray-500">
                    <p>Buy some balls and go catch some pokes!</p>
                    <p>
                      Prices: 1 PokeBall - {POKEBALL_PRICE} / 1 GreatBall -{" "}
                      {GREATBALL_PRICE} / 1 UltraBall - {ULTRABALL_PRICE}
                    </p>

                    <div className="flex gap-3 mt-5">
                      <div>
                        <p className="mb-1">Type</p>
                        <select
                          id="pokeballType"
                          className="w-32 h-12 p-3 rounded-md bg-white text-red-500 font-semibold shadow-md outline-none focus:ring-2 focus:ring-red-300"
                          value={pokeballType}
                          onChange={(e) =>
                            setPokeballType(Number(e.target.value))
                          }
                        >
                          <option value={1}>Pokeball</option>
                          <option value={2}>Greatball</option>
                          <option value={3}>Ultraball</option>
                        </select>
                      </div>

                      <div>
                        <p className="mb-1">Quantity</p>
                        <input
                          id="quantity"
                          type="number"
                          min="1"
                          className="w-32 h-12 p-3 rounded-md bg-white text-red-500 font-semibold shadow-md outline-none focus:ring-2 focus:ring-red-300"
                          value={quantity}
                          onChange={(e) => setQuantity(Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-8 pt-3 pb-8 flex flex-row-reverse">
              <button
                type="button"
                onClick={addPokeballs}
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-md font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto disabled:bg-gray-400"
                disabled={store.isLoading}
              >
                {store.isLoading ? "..." : "Buy"}
              </button>
              <button
                type="button"
                data-autofocus
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
