"use client";

import { client } from "@/utils/constants";
import { sepolia } from "thirdweb/chains";
import { ConnectButton, useActiveAccount } from "thirdweb/react";

export const Login: React.FC = () => {
  const account = useActiveAccount();
  return (
    <div>
      {account ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ConnectButton
            client={client}
            chain={sepolia}
            connectModal={{ size: "wide" }}
          />
          {/* <Counter /> */}
        </div>
      ) : (
        <ConnectButton
          client={client}
          chain={sepolia}
          connectModal={{ size: "wide" }}
        />
      )}
    </div>
  );
};
