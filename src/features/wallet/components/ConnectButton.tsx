// src/features/wallet/components/ConnectButton.tsx
"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  if (isConnected) {
    return (
      <div>
        <Button onClick={() => disconnect()}>
          {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={() => connect({ connector: injected() })}>
      Connect Wallet
    </Button>
  );
}
