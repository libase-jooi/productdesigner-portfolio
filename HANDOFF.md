# JOOi デザイナーポートフォリオ — フロント実装概要

フロントエンド・デザインの主要画面がプロトタイプとして一通り揃いました。
各画面の概要と確認用URLをまとめます。

**ベースURL:** [https://jooi-designer-portfolio.vercel.app](https://jooi-designer-portfolio.vercel.app)

---

## 1. ランディングページ

サービス紹介のトップページです。

**確認URL:** [https://jooi-designer-portfolio.vercel.app/](https://jooi-designer-portfolio.vercel.app/)

---

## 2. オンボーディングガイド（モーダル）

3ステップのガイドモーダル。サービスの流れを案内し、最後にアップロード画面へ遷移します。
URLに`?guide`を付けるとどのページからでも開けます。

| ステップ | タイトル | 内容 | ビジュアル |
|----------|---------|------|-----------|
| STEP 01 | ポートフォリオをAIが自動生成 | 既存のポートフォリオやPDFをAIが読み取り、構造化されたポートフォリオを自動作成 | PDF・URLアイコン → AI分析アイコン |
| STEP 02 | AIが自動で構造化・整理 | 経歴・プロジェクト・スキルを自動抽出。信頼度スコア（高/中/低）付きで要確認箇所がひと目でわかる | 信頼度インジケーター（緑・黄・赤）のリスト |
| STEP 03 | 確認して公開するだけ | AI生成内容を確認・編集後、ワンクリックで公開。専用の公開URLが発行される | 「公開完了!」バッジ + URL表示 |

- 下部にプログレスバー（3段階）
- 「スキップ」で即座に閉じる / 「次へ」でステップ進行
- 最終ステップの「アップロードする」ボタンでアップロードフローへ遷移
- 背景: deep indigoグラデーション（#1a0066 → #2E02E9 → #5b3aff）

**確認URL:** [https://jooi-designer-portfolio.vercel.app/designers/d1?guide](https://jooi-designer-portfolio.vercel.app/designers/d1?guide)

---

## 3. デザイナー側ページ（閲覧 / 編集 / 確認）

ログイン後のデザイナー自身が使う管理画面です。
モードはURLクエリパラメータ（`?mode=edit` / `?mode=confirm`）で切り替わり、ブラウザの戻る/進むにも対応しています。

- **閲覧モード** — ポートフォリオのプレビュー、公開ステータスの切り替え、公開URLの設定
- **編集モード** — プロフィール・経歴・プロジェクトの各項目を直接編集
- **確認モード** — 編集内容を一覧で確認し、保存する
- **チャットアシスタント** — 編集モードで右下のFABからアクセス。デザイナーデータに基づいたパーソナライズ応答

| モード | 確認URL（水谷 彩花） |
|--------|----------------------|
| 閲覧 | [/designers/d1](https://jooi-designer-portfolio.vercel.app/designers/d1) |
| 編集 | [/designers/d1?mode=edit](https://jooi-designer-portfolio.vercel.app/designers/d1?mode=edit) |
| 確認 | [/designers/d1?mode=confirm](https://jooi-designer-portfolio.vercel.app/designers/d1?mode=confirm) |

**他のデザイナー:**

- [/designers/d2](https://jooi-designer-portfolio.vercel.app/designers/d2) （リュウ アレン — プロジェクト3件）
- [/designers/d3](https://jooi-designer-portfolio.vercel.app/designers/d3) （森本 奈々 — プロジェクト2件）
- [/designers/d4](https://jooi-designer-portfolio.vercel.app/designers/d4) （吉川 結衣 — 新規・空状態）

---

## 4. レビュー確認ページ

アップロードした資料からAIが抽出した内容を確認・編集する画面です。
プロジェクト情報、スキル、経歴などを一覧で確認し、修正してから保存します。

**確認URL:** [https://jooi-designer-portfolio.vercel.app/upload/review/d1](https://jooi-designer-portfolio.vercel.app/upload/review/d1)

---

## 5. 公開ポートフォリオページ

外部に公開されるポートフォリオ画面です。誰でもアクセスできます。

- プロフィール、経歴、プロジェクト一覧を表示
- プロジェクトカードをクリックするとモーダルで詳細表示（ホバーでリフトアニメーション付き）
- スキル診断レーダーチャート付き
- 2カラムのプロジェクトグリッドレイアウト

**確認URL:**

- [/p/mizutani-ayaka](https://jooi-designer-portfolio.vercel.app/p/mizutani-ayaka) （水谷 彩花）
- [/p/ryu-allen](https://jooi-designer-portfolio.vercel.app/p/ryu-allen) （リュウ アレン）
- [/p/morimoto-nana](https://jooi-designer-portfolio.vercel.app/p/morimoto-nana) （森本 奈々）

---

## 6. スキル診断ページ

5軸（ビジネス推進力・課題設定力・UX設計力・画面設計力・AI活用力）のスキルを自己診断する画面です。
各軸のサブスキルごとにレベルを選択します。

**確認URL:** [https://jooi-designer-portfolio.vercel.app/designers/d1/skill-check](https://jooi-designer-portfolio.vercel.app/designers/d1/skill-check)

---

## 7. 管理画面（Admin）

全デザイナーの一覧と編集ができる管理者向け画面です。
公開ステータス（公開中/非公開）の確認、公開サイトへの直リンク付き。

**確認URL:** [https://jooi-designer-portfolio.vercel.app/admin](https://jooi-designer-portfolio.vercel.app/admin)

---

## 技術スタック

- React + TypeScript + Vite
- Tailwind CSS（Material Design 3風のカスタムトークン）
- React Router v6
- モックデータによるプロトタイプ（API未接続）
