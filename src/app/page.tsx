"use client";

import { PortfolioDashboard } from "@/features/portfolio/components/PortfolioDashboard";
import { ConnectButton } from "@/features/wallet/components/ConnectButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmationDialog } from "@/features/command/components/ConfirmationDialog";
import Image from "next/image";
import { SuccessDialog } from "@/features/command/components/SuccessDialog";
import { useMasterCommandHandler } from "@/features/master/useMasterCommandHandler";
import { NetworkSwitcher } from "@/features/wallet/components/NetworkSwitcher";
import { RusdBridge } from "@/features/cross-chain/components/RusdBridge";
import { MasterCommandBar } from "@/features/master/components/MasterCommandBar";

export default function Home() {
  const {
    sendMasterCommand,
    isLoading,
    statusMessage,
    quoteState,
    isDialogOpen,
    setIsDialogOpen,
    handleConfirmSwap,
    isSuccessDialogOpen,
    setIsSuccessDialogOpen,
    successTxHash,
  } = useMasterCommandHandler();

  return (
    <main className="flex min-h-screen flex-col items-center px-4 pt-8 md:px-24 md:pt-12">
      <header className="w-full max-w-5xl flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Image
            src="/logo.png"
            alt="Prompt Fusion Swap Logo"
            width={40}
            height={40}
            className="rounded-md"
          />
          <h1 className="text-2xl font-bold">OmniSwap AI</h1>
        </div>
        <div className="flex items-center gap-4">
          <NetworkSwitcher />
          <ConnectButton />
        </div>
      </header>

      <div className="w-full max-w-4xl flex flex-col gap-8 mt-12">
        <PortfolioDashboard />

        <RusdBridge />

        <Card>
          <CardHeader>
            <CardTitle>AI Command Bar</CardTitle>
          </CardHeader>
          <CardContent>
            <MasterCommandBar onSubmitAction={sendMasterCommand} isLoading={isLoading} />
            {isLoading && statusMessage && (
              <div className="mt-4 text-center text-muted-foreground animate-pulse">
                <p>{statusMessage}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ConfirmationDialog
        quoteState={quoteState}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={handleConfirmSwap}
      />

      <SuccessDialog
        txHash={successTxHash}
        isOpen={isSuccessDialogOpen}
        onOpenChange={setIsSuccessDialogOpen}
      />
    </main>
  );
}
