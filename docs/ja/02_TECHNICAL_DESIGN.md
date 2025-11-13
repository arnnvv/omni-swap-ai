# 技術設計書：Prompt Fusion Swap

## 1. プロジェクト概要

**Prompt Fusion Swap**は、リアルタイムのポートフォリオ分析ダッシュボードと、AIを活用した自然言語コマンドインターフェースを融合させた次世代のDeFi操作ターミナルである。ユーザーは自身の資産状況を瞬時に把握し、アシスタントに指示を出すかのように直感的かつ複雑な取引を、1inch APIを通じて実行できる。

## 2. 技術スタック

| カテゴリ | 技術 | 目的 |
| :--- | :--- | :--- |
| **フレームワーク** | Next.js 14+ (App Router) | フルスタック開発（フロントエンド、APIプロキシ） |
| **言語** | TypeScript | 型安全性と開発効率の向上 |
| **UIライブラリ** | shadcn/ui, Tailwind CSS | モダンで保守性の高いUIの迅速な構築 |
| **状態管理** | Zustand | シンプルで軽量なグローバル状態管理 |
| **ウォレット連携** | wagmi & Viem | EVMウォレットとの堅牢な接続と対話 |
| **LLM API** | Gemini API | Function Callingを利用した自然言語の意図解釈 |
| **デプロイ** | Vercel | Next.jsに最適化されたCI/CDとホスティング |

## 3. アーキテクチャ設計

### 3.1. 全体像

アプリケーションはNext.jsのApp Routerを基盤とし、フロントエンドコンポーネントとバックエンドAPI（API Routes）が共存する構成を取る。

1.  **フロントエンド (Client):** ユーザーインターフェースを提供。ウォレット接続後、バックエンドにリクエストを送信する。
2.  **バックエンド (Next.js API Routes):** フロントエンドからのリクエストを受け、外部API（1inch, Gemini）との通信を中継するセキュアなプロキシとして機能する。APIキーはサーバーサイドの環境変数で安全に管理する。
3.  **外部サービス (External APIs):** 1inch NetworkとGemini API。

### 3.2. LLM連携アーキテクチャ (Function Calling)

本プロジェクトの核心部分。`/api/command`エンドポイントが全ての自然言語処理を担う。

1.  ユーザーがコマンド（例：「ETHの半分をUSDCに」）を送信。
2.  フロントエンドは、コマンド文字列を`/api/command`にPOSTする。
3.  バックエンドは、受け取ったコマンドと、あらかじめ定義された関数スキーマ（`get_swap_quote`等）をGemini APIに送信する。
4.  Gemini APIは、ユーザーの意図を解釈し、呼び出すべき関数とその引数をJSON形式で返す（例：`{ name: "get_swap_quote", arguments: { ... } }`）。
5.  バックエンドは、返された関数名に基づき、対応する1inch APIを呼び出す。
6.  結果（見積もり情報など）をフロントエンドに返し、ユーザーに最終確認を促す。

### 3.3. レンダリング戦略

本アプリケーションでは、Next.js App Routerの特性を活かし、初期表示の高速化とインタラクティブ性の両立を図るため、以下の戦略を採用する。

* **SSR + Streaming (初期表示):**
    * アプリケーションの初回ロード時、静的なUIシェル（ヘッダー、フッターなど）はサーバーサイドでレンダリング（**SSR**）され、即座にクライアントに送信される。これにより、ユーザーは素早くページの骨格を認識できる (Fast FCP)。
    * `PortfolioDashboard`のようなデータ取得を伴う動的なコンポーネントは、`React.Suspense`でラップする。これにより、サーバーはデータの準備ができた部分から順次HTMLをクライアントに**ストリーミング**送信し、体感的な表示速度を向上させる。

* **CSR (インタラクション):**
    * 初期表示完了後、アプリケーションはクライアントサイドレンダリング（**CSR**）を基本とするSPAとして動作する。
    * ウォレット接続、コマンド入力、スワップ後のポートフォリオ更新など、すべてのユーザーインタラクションとそれに伴う動的なデータ更新はクライアントサイドで処理される。
    * `useState`, `useEffect`や`wagmi`のフックを使用するコンポーネントは、`"use client"`ディレクティブを付与し、Client Componentとして明確に区別する。

## 4. ディレクトリ構成

Feature-BasedとType-Basedのハイブリッド構成を採用し、関心事の分離と開発効率を両立させる。

```
src/
├── app/
│   ├── api/
│   │   └── command/
│   │       └── route.ts       # Backend: 全てのLLMコマンドを処理するAPIルート
│   ├── layout.tsx             # ルートレイアウト
│   └── page.tsx               # アプリケーションのメインページコンポーネント
│
├── components/
│   └── ui/                    # shadcn/uiによって自動生成されるUIコンポーネント
│
├── features/                  # ✨機能ベースのディレクトリ
│   │
│   ├── portfolio/             # ポートフォリオ機能
│   │   ├── components/        #   - UIコンポーネント
│   │   │   ├── PortfolioDashboard.tsx
│   │   │   └── AssetTable.tsx
│   │   └── hooks/             #   - ロジックフック
│   │       └── usePortfolio.ts
│   │
│   ├── command/               # コマンド機能
│   │   ├── components/
│   │   │   ├── CommandBar.tsx
│   │   │   └── ConfirmationDialog.tsx
│   │   └── hooks/
│   │       └── useCommandHandler.ts
│   │
│   └── wallet/                # ウォレット接続機能
│       ├── components/
│       │   └── ConnectButton.tsx
│       └── providers/
│           └── Web3Provider.tsx   # wagmiの設定とProvider
│
├── lib/                         # 共通ライブラリ・SDKラッパー
│   ├── 1inch/
│   │   └── sdk.ts             # 1inch APIを呼び出す関数群
│   ├── llm/
│   │   └── client.ts          # Gemini APIを呼び出すクライアント
│   └── utils.ts               # プロジェクト共通の便利関数
│
├── store/
│   └── useAppStore.ts         # Zustandによるグローバル状態管理ストア
│
└── styles/
└── globals.css            # グローバルCSS
```

## 5. 主要な機能と実装方針

### 5.1. ポートフォリオ機能 (`features/portfolio`)

* **`PortfolioDashboard.tsx`**: メインのダッシュボード。`usePortfolio`フックから取得したデータを表示する。**このコンポーネントは`<Suspense>`でラップされ、サーバーサイドでのデータ取得中にローディングスケルトンを表示し、ストリーミングされる。**
* **`usePortfolio.ts`**: `wagmi`で接続されたウォレットアドレスを取得し、バックエンド経由で`1inch Wallet Balances API`と`Token Prices API`を呼び出し、整形された資産データを返すカスタムフック。

### 5.2. コマンド機能 (`features/command`)

* **`CommandBar.tsx`**: ユーザーが自然言語コマンドを入力するUI。入力された文字列を`useCommandHandler`に渡す。
* **`useCommandHandler.ts`**: コマンド文字列を`/api/command`に送信し、返ってきた結果（見積もり、エラー等）を状態として管理し、確認ダイアログの表示を制御するカスタムフック。
* **`/api/command/route.ts`**:
    * リクエストボディからコマンド文字列を取得。
    * `lib/llm/client.ts`を呼び出し、Gemini APIに意図の解釈を依頼。
    * 返ってきた関数呼び出し情報に基づき、`lib/1inch/sdk.ts`の該当する関数を実行。
    * 結果をフロントエンドに返す。

### 5.3. Gemini Function Calling定義

`/api/command/route.ts`内で、以下の関数をGeminiに提示する。

| 関数名 | パラメータ | 説明 | 内部API |
| :--- | :--- | :--- | :--- |
| **`get_swap_quote`** | `from: string`, `to: string`, `amount: number` | スワップの見積もりを取得する | 1inch Swap API |
| **`create_limit_order` (Stretch Goal)** | `from: string`, `to: string`, `amount: number`, `rate: number` | 指値注文を作成する | 1inch Limit Order API |
| **`get_token_balance`** | `token: string` | 特定トークンの残高を取得する | 1inch Wallet API |

## 6. 開発ロードマップ

1.  **Sprint 1: 基盤構築**
    * Next.jsプロジェクト作成、shadcn/ui, wagmiのセットアップ。
    * `Web3Provider`と`ConnectButton`を実装し、ウォレット接続を確立する。
2.  **Sprint 2: ポートフォリオ表示**
    * 1inch APIプロキシと`usePortfolio`フックを実装。
    * `PortfolioDashboard`を完成させ、資産表示を実現する。
3.  **Sprint 3: LLMバックエンド**
    * Gemini APIとの連携部分(`lib/llm/client.ts`)を実装。
    * `/api/command`ルートで、Function Callingが動作し、意図したJSONが返ることを確認する。
4.  **Sprint 4: E2Eスワップフロー**
    * LLMのレスポンスと1inch SDKを連携。
    * `CommandBar`から`get_swap_quote`を呼び出し、`ConfirmationDialog`に見積もりを表示する一連の流れを完成させる。
5.  **Sprint 5: 仕上げとストレッチゴール**
    * UI/UXの改善、エラーハンドリングの強化。
    * **ストレッチゴール:** `create_limit_order`のフローを実装する。

