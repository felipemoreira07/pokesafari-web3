"use client";

import { createThirdwebClient, getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID as string;

console.log(CLIENT_ID);

export const client = createThirdwebClient({
  clientId: CLIENT_ID,
});

export const contract = getContract({
  address: "0x489CEd290cB4731a514Fb802cc9AB3Ee999c69Cb",
  chain: sepolia,
  client,
});
