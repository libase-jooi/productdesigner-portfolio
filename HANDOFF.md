# JOOi デザイナーポートフォリオ — フロント実装概要

フロントエンド・デザインの主要画面がプロトタイプとして一通り揃いました。
各画面の概要と確認用URLをまとめます。

**ベースURL:** https://jooi-designer-portfolio.vercel.app

---

## 1. ランディングページ

サービス紹介のトップページです。

**確認URL:** https://jooi-designer-portfolio.vercel.app/

---

## 2. AI入力アシスタント（オンボーディング → チャットパネル）

初回アクセス時にオンボーディングモーダルを表示。
編集モードではチャットパネルがデザイナーのデータ（プロジェクト・経歴・スキル）を参照し、パーソナライズされた提案を返します。

- デザイナーの登録済みプロジェクト数・経歴を参照して初回メッセージを生成
- 各プロジェクトの概要・背景・成果の有無に応じてサジェストを出し分け
- 回答ごとに次のアクション候補（4択）が表示される

**確認URL:** https://jooi-designer-portfolio.vercel.app/designers/d1（編集モードでチャットアイコンをクリック）

---

## 3. レビュー確認ページ

アップロードした資料からAIが抽出した内容を確認・編集する画面です。
プロジェクト情報、スキル、経歴などを一覧で確認し、修正してから保存します。

**確認URL:** https://jooi-designer-portfolio.vercel.app/upload/review/d1

---

## 4. デザイナー側ページ（閲覧 / 編集）

ログイン後のデザイナー自身が使う管理画面です。

- **閲覧モード**: ポートフォリオのプレビュー、公開ステータスの切り替え、公開URLの設定
- **編集モード**: プロフィール・経歴・プロジェクトの各項目を直接編集
- **チャットアシスタント**: 編集モードで右下のFABからアクセス。デザイナーデータに基づいたパーソナライズ応答

**確認URL:**
- https://jooi-designer-portfolio.vercel.app/designers/d1 （水谷 彩花 — プロジェクト3件・経歴あり）
- https://jooi-designer-portfolio.vercel.app/designers/d2 （リュウ アレン — プロジェクト3件）
- https://jooi-designer-portfolio.vercel.app/designers/d3 （森本 奈々 — プロジェクト2件）
- https://jooi-designer-portfolio.vercel.app/designers/d4 （吉川 結衣 — 新規・空状態）

---

## 5. 公開ポートフォリオページ

外部に公開されるポートフォリオ画面です。誰でもアクセスできます。

- プロフィール、経歴、プロジェクト一覧を表示
- プロジェクトカードをクリックするとモーダルで詳細表示
- スキル診断レーダーチャート付き
- 2カラムのプロジェクトグリッドレイアウト

**確認URL:**
- https://jooi-designer-portfolio.vercel.app/p/mizutani-ayaka （水谷 彩花）
- https://jooi-designer-portfolio.vercel.app/p/ryu-allen （リュウ アレン）
- https://jooi-designer-portfolio.vercel.app/p/morimoto-nana （森本 奈々）

---

## 6. スキル診断ページ

5軸（ビジネス推進力・課題設定力・UX設計力・画面設計力・AI活用力）のスキルを自己診断する画面です。
各軸のサブスキルごとにレベルを選択します。

**確認URL:** https://jooi-designer-portfolio.vercel.app/designers/d1/skill-check

---

## 7. ダッシュボード

デザイナー一覧画面。ログイン後のホーム。

**確認URL:** https://jooi-designer-portfolio.vercel.app/dashboard

---

## 8. 管理画面（Admin）

全デザイナーの一覧と編集ができる管理者向け画面です。

**確認URL:** https://jooi-designer-portfolio.vercel.app/admin

---

## 技術スタック

- React + TypeScript + Vite
- Tailwind CSS（Material Design 3風のカスタムトークン）
- React Router v6
- モックデータによるプロトタイプ（API未接続）
