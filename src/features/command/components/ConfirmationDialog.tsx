// src/features/command/components/ConfirmationDialog.tsx
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
import { formatUnits } from "viem";
import { type QuoteState } from "../hooks/useCommandHandler";

type ConfirmationDialogProps = {
  quoteState: QuoteState | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: () => void;
};

export function ConfirmationDialog({
  quoteState,
  isOpen,
  onOpenChange,
  onConfirm,
}: ConfirmationDialogProps) {
  if (
    !quoteState ||
    !quoteState.quote?.srcToken ||
    !quoteState.quote?.dstToken
  ) {
    return null;
  }

  const { quote, fromAmount, originalPrompt } = quoteState;

  const formattedFromAmount = fromAmount;

  const formattedToAmount = formatUnits(
    BigInt(quote.dstAmount),
    quote.dstToken.decimals,
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Swap</DialogTitle>
          <DialogDescription>
            Please review the details of your swap.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4 space-y-2">
          <p>
            <span className="font-semibold">Your command:</span> "
            {originalPrompt}"
          </p>
          <div className="p-4 bg-secondary rounded-md">
            <p className="text-lg font-bold">
              You are swapping{" "}
              <span className="text-primary">
                {formattedFromAmount} {quote.srcToken.symbol}
              </span>
            </p>
            <p className="text-lg font-bold">
              For approximately{" "}
              <span className="text-primary">
                {formattedToAmount} {quote.dstToken.symbol}
              </span>
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Confirm & Swap</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
