import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const bridgeRusdDeclaration = {
  name: "bridge_rusd",
  description: "Swaps, bridges, or sends RUSD testnet tokens from the current chain to a different supported testnet chain. Use for commands like 'bridge 1 RUSD to Fuji' or 'swap 0.5 RUSD to Base Sepolia'.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      amount: {
        type: Type.STRING,
        description: "The amount of RUSD to bridge, e.g., '1.5', '100'",
      },
      destinationChain: {
        type: Type.STRING,
        description: "The name of the destination chain. Must be one of: 'Fuji', 'Base Sepolia'.",
      },
    },
    required: ["amount", "destinationChain"],
  },
};

const chainNameToIdMap: { [key: string]: number } = {
  "fuji": 43113,
  "avalanche fuji": 43113,
  "base sepolia": 84532,
  "sepolia": 84532,
};

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
	config: {
        tools: [{ functionDeclarations: [bridgeRusdDeclaration] }],
	}
    });

    const functionCall = response.functionCalls?.[0];

    if (functionCall?.name === 'bridge_rusd') {
      const { amount, destinationChain } = functionCall.args;

      // @ts-ignore
      const destinationChainId = chainNameToIdMap[destinationChain.toLowerCase()];

      if (!destinationChainId) {
        return NextResponse.json({
          type: "error",
          message: `Destination chain '${destinationChain}' is not supported. Please use 'Fuji' or 'Base Sepolia'.`
        }, { status: 400 });
      }

      return NextResponse.json({
        type: "rusd_swap_intent",
        amount,
        destinationChainId,
      });
    }

    return NextResponse.json({
      type: "no_action",
      message: "I couldn't understand that command. Please try something like 'Swap 1 RUSD to Fuji'.",
    });

  } catch (error) {
    console.error("Error in /api/rusd-command:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
