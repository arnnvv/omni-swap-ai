// src/features/command/components/SuccessDialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAccount } from "wagmi";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

type SuccessDialogProps = {
  txHash: string | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

const BLOCK_EXPLORER_URLS: { [chainId: number]: string } = {
  1: "https://etherscan.io",
  137: "https://polygonscan.com",
  10: "https://optimistic.etherscan.io",
  42161: "https://arbiscan.io",
};

export function SuccessDialog({
  txHash,
  isOpen,
  onOpenChange,
}: SuccessDialogProps) {
  const { chainId } = useAccount();

  if (!isOpen || !txHash) {
    return null;
  }

  const explorerUrl = chainId ? BLOCK_EXPLORER_URLS[chainId] : undefined;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex flex-col items-center text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <DialogTitle className="text-2xl">Swap Successful!</DialogTitle>
            <DialogDescription className="mt-2">
              Your transaction has been confirmed.
            </DialogDescription>
          </div>
        </DialogHeader>
        <div className="my-4 text-center">
          {explorerUrl && (
            <Link
              href={`${explorerUrl}/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline text-sm break-all"
            >
              View on Block Explorer
            </Link>
          )}
        </div>
        <DialogFooter className="sm:justify-center">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
