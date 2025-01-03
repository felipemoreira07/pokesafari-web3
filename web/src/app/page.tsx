"use client";

import { client } from "@/utils/constants";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { sepolia } from "thirdweb/chains";
import { ConnectButton, useActiveAccount } from "thirdweb/react";

export default function Home() {
  const account = useActiveAccount();
  const router = useRouter();

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
          // onConnect={() => router.push("/safari")}
        />
        {account && (
          <button onClick={() => router.push("/safari")}>Go to Safari</button>
        )}
      </main>
    </div>
  );
}
