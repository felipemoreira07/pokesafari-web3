"use client";

import { createThirdwebClient, getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID as string;

console.log(CLIENT_ID);

export const client = createThirdwebClient({
  clientId: CLIENT_ID,
});

export const contract = getContract({
  address: "0x2F1ea3eaAa964b4e642ba7C006570dd24D6B83B4",
  chain: sepolia,
  client,
});
