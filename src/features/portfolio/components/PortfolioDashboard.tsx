// src/features/portfolio/components/PortfolioDashboard.tsx
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AssetTable } from "./AssetTable";
import { usePortfolio } from "../hooks/usePortfolio";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";

export function PortfolioDashboard() {
  const { isConnected } = useAccount();
  const { data: assets, isLoading } = usePortfolio();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Portfolio</CardTitle>
        <CardDescription>
          {isConnected && isClient
            ? "A list of your assets in the connected wallet."
            : "Connect your wallet to see your asset portfolio."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AssetTable assets={assets || []} isLoading={isLoading} />
      </CardContent>
    </Card>
  );
}
