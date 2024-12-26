"use client";

import { createThirdwebClient, getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID as string;

console.log(CLIENT_ID);

export const client = createThirdwebClient({
  clientId: CLIENT_ID,
});

export const contract = getContract({
  address: "0xf86AE882C95206918D5498e822CEe9916FEfA94A",
  chain: sepolia,
  client,
});
