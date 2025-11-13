# 1. Project Overview

**Prompt Fusion Swap** is a next-generation DeFi terminal that merges a real-time, analytical portfolio dashboard with an AI-powered, natural language command interface. It allows users to instantly grasp their asset allocation and execute complex trades as easily as talking to an assistant.

## 2. Target Audience

Tech-savvy DeFi users and power traders looking for the most efficient and intuitive way to interact with protocols, minimizing clicks and maximizing speed.

## 3. Core Features & Requirements

### 3.1. Feature: Real-Time Portfolio Dashboard 📊

The visual foundation of the application, providing users with the context needed to make informed decisions.

* **FR-1 (Functional Requirement): Wallet Connection**
    * Users must be able to connect their EVM-compatible wallet.
* **FR-2: Asset & Value Display**
    * The dashboard must display a list of all user-held tokens with their balances, current USD prices, and total USD value per holding. A total portfolio value must be prominently displayed.
* **NFR-1 (Non-Functional Requirement): Performance**
    * All portfolio data should load within 5 seconds of wallet connection.

### 3.2. Feature: AI Command Interface 🤖

The primary interaction method, replacing complex forms with natural language.

* **FR-3: Natural Language Input**
    * Users must be able to type commands in a dedicated input bar (e.g., "swap 1 ETH for USDC," "sell half of my LINK for DAI").
* **FR-4: Intent Parsing**
    * The system's AI backend must parse the user's intent to identify the desired action (e.g., swap, limit order) and its parameters (tokens, amounts). The system must use the live portfolio data as context for relative amounts (e.g., "half," "20%").
* **FR-5: User Confirmation**
    * Before generating a transaction, the system must present a clear, human-readable confirmation message to the user (e.g., "You are about to swap 1.5 WETH for 3,000 USDC. Do you wish to proceed?").
* **FR-6 (Stretch Goal): Limit Order Intent**
    * Support advanced commands for creating limit orders (e.g., "create a limit order to sell 1 ETH for 4000 USDC").
* **NFR-2: Responsiveness**
    * The AI's confirmation response should appear within 7 seconds of the user submitting a command.

## 4. Technical Stack 🛠️

* **Framework:** Next.js (App Router)
* **UI Library:** shadcn/ui
* **Wallet Integration:** wagmi & Viem
* **AI Backend:** LLM API (e.g., Gemini API, OpenAI API) via Next.js API Routes
* **Deployment:** Vercel

## 5. High-Level Development Roadmap 🗺️

1.  **Phase 1: Foundation & Portfolio View (MVP):** Setup project, implement wallet connection, and build the portfolio dashboard.
2.  **Phase 2: Backend & LLM Integration:** Set up the proxy for the LLM API. Create the logic to take a string, send it to the LLM, and get a structured JSON object back.
3.  **Phase 3: Connecting LLM to 1inch Swap APIs:** Use the JSON object from the LLM to make calls to the **Classic Swap** or **Fusion API** and generate the user confirmation prompt.
4.  **Phase 4 (Stretch Goal):** Implement the **Limit Order Protocol API** for advanced commands.
5.  **Phase 5: Polish & Demo Prep:** Focus on UI/UX refinement, error handling, and preparing the final presentation.

## 6. 1inch API Dependencies ✅

* `Wallet Balances API`
* `Token Prices API`
* `Classic Swap API`
* `Fusion API`
* `Limit Order Protocol API` (Stretch Goal)
