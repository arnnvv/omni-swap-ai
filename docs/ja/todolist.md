# To-Do List: Prompt Fusion Swap

これは、Prompt Fusion Swapプロジェクトの開発ロードマップに基づくタスクリストです。

## Sprint 1: 基盤構築

- [x] **プロジェクト初期化**
    - [x] `npx create-next-app` でNext.jsプロジェクトを作成
    - [x] TypeScriptとTailwind CSSの設定を完了
    - [x] Gitリポジトリを初期化し、最初のコミットを行う
- [x] **UIセットアップ**
    - [x] `npx shadcn-ui@latest init` を実行
    - [x] 共通で使用する`shadcn/ui`コンポーネントをインストール (Button, Card, Table, Input, Dialog)
- [x] **ウォレット連携**
    - [x] `wagmi` と `viem` をインストール
    - [x] `features/wallet/providers/Web3Provider.tsx` を作成し、wagmiの初期設定を記述
    - [x] ルートレイアウト (`layout.tsx`) を`Web3Provider`でラップする
    - [x] `features/wallet/components/ConnectButton.tsx` を作成
    - [x] ヘッダーに`ConnectButton`を配置し、ウォレットの接続・切断ができることを確認
- [x] **ドキュメントとディレクトリ構成**
    - [x] `docs/` フォルダを作成し、設計書・要件定義書を配置
    - [x] 設計書に基づき、`features`, `lib`, `store` などのディレクトリを作成

---

## Sprint 2: ポートフォリオ表示

- [x] **バックエンド (APIプロキシ)**
    - [x] `app/api/portfolio/route.ts` を作成
    - [x] `.env.local` に1inchのAPIキーを追加
    - [x] `lib/1inch/sdk.ts` を作成
    - [x] `sdk.ts` に `1inch Wallet Balances API` を呼び出す関数を実装
    - [x] `sdk.ts` に `1inch Token Prices API` を呼び出す関数を実装
    - [x] APIルート内で、上記2つの関数を呼び出し、残高と価格を結合したデータを返すロジックを実装
- [x] **フロントエンド**
    - [x] `PortfolioDashboard.tsx` と `AssetTable.tsx` のひな形を作成
    - [x] `features/portfolio/hooks/usePortfolio.ts` を作成
    - [x] `usePortfolio`フック内で、`/api/portfolio`エンドポイントを呼び出すロジックを実装
    - [x] `AssetTable`にローディングスケルトンUIを実装
    * [x] `page.tsx` で`PortfolioDashboard`を`React.Suspense`でラップする
    - [x] 取得したポートフォリオデータをテーブルに正しく表示する

---

## Sprint 3: LLMバックエンド

- [x] **LLM APIセットアップ**
    - [x] `.env.local` にGeminiのAPIキーを追加
    - [x] `lib/llm/client.ts` を作成し、Gemini APIを呼び出すクライアント関数を実装
- [x] **Function Calling実装**
    - [x] `lib/llm/functions.ts` のようなファイルに、`get_token_balance`と`get_swap_quote`の関数スキーマを定義
    * [x] `app/api/command/route.ts` を作成
    - [x] `route.ts`で、ユーザープロンプトと関数スキーマをGemini APIに送信するロジックを実装
    - [x] Gemini APIからのレスポンス（Function CallingのJSON）をコンソールに出力し、動作を確認
- [x] **フロントエンド連携 (初期)**
    - [x] `features/command/components/CommandBar.tsx` を作成
    - [x] `features/command/hooks/useCommandHandler.ts` を作成
    - [x] `CommandBar`から`useCommandHandler`を呼び出し、`/api/command`にPOSTリクエストを送信する
    - [x] バックエンドからのレスポンスをブラウザのコンソールに出力し、連携を確認

---

## Sprint 4: E2Eスワップフロー

- [x] **バックエンド オーケストレーション**
    - [x] `execute_swap`の関数スキーマを定義
    - [x] `/api/command/route.ts`で、LLMからの`get_swap_quote`呼び出しに応じて1inchに見積もりを依頼するロジックを実装
    - [x] 見積もり結果をフロントエンドに返す
- [x] **フロントエンド 確認フロー**
    - [x] `features/command/components/ConfirmationDialog.tsx` を作成
    - [x] `useCommandHandler`を更新し、見積もりデータを状態として保持し、ダイアログの表示を制御する
    - [x] ユーザーがダイアログで「確認」を押したら、スワップ実行の意図を再度`/api/command`に送信する
- [x] **実行ロジック**
    - [x] `/api/command/route.ts`で、スワップ実行リクエストを処理するロジックを実装
    - [x] 1inch Swap APIからトランザクションデータを取得する
    - [x] トランザクションデータをフロントエンドに返す
    - [x] フロントエンドで`wagmi`の`useSendTransaction`を使い、ユーザーに署名を要求する

---

## Sprint 5: 仕上げとストレッチゴール

- [ ] **UI/UX改善**
    - [x] ポートフォリオ表示の改善 (新規追加)
        - [x] 1inch Token Details APIなどを利用して、トークンのシンボル、ロゴ、小数点以下の桁数を取得するバックエンドロジックを追加
        - [x] AssetTableでアドレスの代わりにシンボルとロゴを表示
        - [x] 正しい小数点以下の桁数を使って価値を再計算
    - [x] 全体的なデザイン（マージン、フォント、配色）を調整
    - [ ] レスポンシブ対応を強化し、モバイル表示を改善
    - [ ] ローディングスピナーや状態変化時のトランジションを追加
- [ ] **エラーハンドリング**
    - [ ] API呼び出し（1inch, Gemini）の失敗時のエラー処理を実装
    - [ ] ウォレットの接続エラーやトランザクション拒否時のエラーメッセージをUIに表示
- [ ] **ストレッチゴール: 指値注文 (`create_limit_order`)**
    - [ ] `create_limit_order`の関数スキーマを追加
    - [ ] `/api/command/route.ts`で、`create_limit_order`の関数呼び出しを処理するロジックを実装
    - [ ] `lib/1inch/sdk.ts`で`1inch Limit Order Protocol API`を呼び出す関数を実装
    - [ ] `ConfirmationDialog`で指値注文の確認UIに対応
