# JOOi デザイナーポートフォリオ — フロント実装概要

フロントエンド・デザインの主要画面がプロトタイプとして一通り揃いました。
各画面の概要と確認用URLをまとめます。

---

## 1. AI入力アシスタント（オンボーディングモーダル）

初回アクセス時に表示されるAIアシスタント付きのモーダルです。
ポートフォリオの各項目の入力を対話形式でサポートします。

- サジェストチップから質問を選べる
- 回答ごとに次のアクション候補（4択）が表示される

**確認URL:** https://jooi-designer-portfolio.vercel.app/designers/d4

---

## 2. レビュー確認ページ

アップロードした資料からAIが抽出した内容を確認・編集する画面です。
プロジェクト情報、スキル、経歴などを一覧で確認し、修正してから保存します。

**確認URL:** https://jooi-designer-portfolio.vercel.app/upload/review/d1

---

## 3. デザイナー側ページ（閲覧 / 編集）

ログイン後のデザイナー自身が使う管理画面です。

- **閲覧モード**: ポートフォリオのプレビュー、公開ステータスの切り替え、公開URLの設定
- **編集モード**: プロフィール・経歴・プロジェクトの各項目を直接編集

**確認URL:** https://jooi-designer-portfolio.vercel.app/portfolio/hirose-saori

---

## 4. 公開ポートフォリオページ

外部に公開されるポートフォリオ画面です。誰でもアクセスできます。

- プロフィール、経歴、プロジェクト一覧を表示
- プロジェクトカードをクリックするとモーダルで詳細表示
- スキル診断レーダーチャート付き
- 2カラムのプロジェクトグリッドレイアウト

**確認URL:** https://jooi-designer-portfolio.vercel.app/p/hirose-saori

---

## 5. スキル診断ページ

5軸（ビジネス推進力・課題設定力・UX設計力・画面設計力・AI活用力）のスキルを自己診断する画面です。
各軸のサブスキルごとにレベルを選択します。

**確認URL:** https://jooi-designer-portfolio.vercel.app/designers/d1/skill-check

---

## 6. 管理画面（Admin）

全デザイナーの一覧と編集ができる管理者向け画面です。

**確認URL:** https://jooi-designer-portfolio.vercel.app/admin

---

## 技術スタック

- React + TypeScript + Vite
- Tailwind CSS（Material Design 3風のカスタムトークン）
- React Router v6
- モックデータによるプロトタイプ（API未接続）
