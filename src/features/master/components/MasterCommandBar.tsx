"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

type MasterCommandBarProps = {
  onSubmitAction: (prompt: string) => void;
  isLoading: boolean;
};

export function MasterCommandBar({ onSubmitAction, isLoading }: MasterCommandBarProps) {
  const [prompt, setPrompt] = useState("Swap 0.0001 WETH for USDC");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmitAction(prompt);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., 'Swap 1 ETH for USDC' or 'Bridge 0.5 RUSD to Fuji'"
        className="flex-grow"
        disabled={isLoading}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Executing..." : "Send Command"}
      </Button>
    </form>
  );
}
