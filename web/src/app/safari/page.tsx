"use client";

import PokeballModal from "@/components/pokeball_modal";
import { contract } from "@/utils/constants";
import Image from "next/image";
import { useState } from "react";
import { prepareContractCall } from "thirdweb";
import { useReadContract } from "thirdweb/react";

export default function Safari() {
  const [openPokeballModal, setOpenPokeballModal] = useState<boolean>(false);

  const { data: pokeballs, isPending: isPendingPokeballs } = useReadContract({
    contract,
    method: "function getPokeballs() view returns (uint256)",
    params: [],
  });

  const { data: greatballs, isPending: isPendingGreatballs } = useReadContract({
    contract,
    method: "function getGreatballs() view returns (uint256)",
    params: [],
  });

  const { data: ultraballs, isPending: isPendingUltraballs } = useReadContract({
    contract,
    method: "function getUltraballs() view returns (uint256)",
    params: [],
  });

  // const transaction = prepareContractCall({
  //   contract,
  //   method:
  //     "function addPokeballs(uint256 pokeball_type, uint256 quantity) payable",
  //   params: [pokeball_type, quantity],
  // });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 pb-20 font-[family-name:var(--font-poppins)]">
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
          <p className="text-lg">{isPendingPokeballs ? "..." : pokeballs}</p>
        </div>
        <div className="flex items-center gap-2">
          <Image
            src="/greatball.png"
            alt="Next.js logo"
            width={25}
            height={25}
          />
          <p className="text-lg">{isPendingGreatballs ? "..." : greatballs}</p>
        </div>
        <div className="flex items-center gap-2">
          <Image
            src="/ultraball.png"
            alt="Next.js logo"
            width={25}
            height={25}
          />
          <p className="text-lg">{isPendingUltraballs ? "..." : ultraballs}</p>
        </div>
      </div>
      {/* <TransactionButton
          transaction={() => increment}
          onTransactionSent={() => console.log("incrementing...")}
          onTransactionConfirmed={() => refetch()}
        >
          +
        </TransactionButton> */}
      <div className="pt-5 flex gap-2">
        <button
          onClick={() => setOpenPokeballModal((prev) => !prev)}
          className="bg-white text-black font-semibold rounded-md px-5 py-3"
        >
          Buy some pokeballs here
        </button>
        <button
          onClick={() => setOpenPokeballModal((prev) => !prev)}
          className="bg-white text-black font-semibold rounded-md px-5 py-3"
        >
          Try to catch a pokemon!
        </button>
      </div>
      <PokeballModal open={openPokeballModal} setOpen={setOpenPokeballModal} />
    </div>
  );
}
