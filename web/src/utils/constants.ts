"use client";

import { createThirdwebClient, getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";

export const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID as string;

export const client = createThirdwebClient({
  clientId: CLIENT_ID,
});

export const contract = getContract({
  address: "0x743e8d0A47fddC2E238cB22Bb22D563D57A989FA",
  chain: sepolia,
  client,
});
