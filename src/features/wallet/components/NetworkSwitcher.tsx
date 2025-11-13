"use client";

import { useAccount, useSwitchChain } from "wagmi";

const SUPPORTED_CHAIN_IDS = [84532, 43113];

export function NetworkSwitcher() {
  const { chain } = useAccount();
  const { chains, switchChain } = useSwitchChain();

  if (!chain || !switchChain) {
    return null;
  }

  return (
    <div>
      <select
        value={chain.id}
        onChange={(e) => switchChain({ chainId: Number(e.target.value) })}
        className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      >
        {chains
          .filter(c => SUPPORTED_CHAIN_IDS.includes(c.id))
          .map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
