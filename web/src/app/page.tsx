"use client";

import { client, contract } from "@/utils/constants";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { sepolia } from "thirdweb/chains";
import {
  ConnectButton,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";

export default function Home() {
  const account = useActiveAccount();
  const router = useRouter();

  const { data: pokemons, isPending: isPendingPokemons } = useReadContract({
    contract,
    method:
      "function getAllPokemons() view returns ((uint256 id, string name, string nickname, uint256 captured_at, string[] types, string ability, uint256 weight, uint256 height, (string name, string moveType)[] moves)[])",
    params: [],
  });

  const { data: oakPokemons, isPending: isPendingOakPokemons } =
    useReadContract({
      contract,
      method:
        "function getAllOakPokemons() view returns ((uint256 id, string name, string nickname, uint256 captured_at, string[] types, string ability, uint256 weight, uint256 height, (string name, string moveType)[] moves)[])",
      params: [],
    });

  console.log(pokemons);

  // useEffect(() => {
  //   if (account) router.push("/safari");
  // }, [account]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16">
      <main className="flex flex-col gap-8 row-start-2 items-center justify-center">
        <div className="flex items-center gap-8">
          <Image
            src="/pokeball.svg"
            alt="Next.js logo"
            width={130}
            height={100}
          />
          <h2 className="text-6xl font-semibold">PokeSafari Web3</h2>
        </div>
        <p className="text-2xl font-semibold">
          Join now and start a beautiful adventure with your pokemons!
        </p>
        <ConnectButton
          client={client}
          chain={sepolia}
          connectModal={{ size: "wide" }}
          onConnect={() => router.push("/safari")}
        />
      </main>
    </div>
  );
}
