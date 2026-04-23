/**
 * Mock Data — バックエンド接続前の仮データ
 * API実装後に削除
 *
 * d1: 水谷 彩花 — toB SaaS特化のシニアプロダクトデザイナー。リサーチからDSまで一貫して担当。
 * d2: リュウ アレン — エージェンシー出身。大手toC案件のUX/ブランド戦略に強い。
 * d3: 森本 奈々 — ヘルスケア×教育ドメインのUXデザイナー。行動変容・習慣化設計が得意。
 * d4: 吉川 結衣 — 新規登録直後のempty state。
 */

import type {
  DesignerWithRelations,
  Project,
  WorkHistory,
} from "./schema";

/* ═══════════════════════════════════════════════════════════════
   d1 — 水谷 彩花
   toB SaaS プロダクトデザイナー（freee → SmartHR → フリーランス）
   ═══════════════════════════════════════════════════════════════ */

const d1Projects: Project[] = [
  {
    id: "p1",
    designerId: "d1",
    title: "クラウド会計アプリ モバイルリニューアル",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1661246627162-feb0269e0c07?w=800&h=600&fit=crop",
    overview:
      "中小企業の経理担当者が外出先でも経費精算できるよう、モバイルの領収書処理フローをゼロから再設計。タスクベースのステップUIに刷新し、主要導線のCVRを大幅改善した。",
    period: "2023年4月〜9月（6ヶ月）",
    team: "PdM 1・Des 2・Eng 4",
    role: "リードUIデザイナー / デザインシステム整備",
    background:
      "サービス開始から5年で機能が倍増し、IAが複雑化。領収書登録の完了率が55%まで低下し、カスタマーサポートへの問い合わせが月400件を超えていた。モバイル利用率が40%に達しているにもかかわらず、UIはデスクトップの縮小版でしかなく、ユーザー体験に大きな課題があった。",
    issues: [
      "領収書登録の完了率が55%と低迷",
      "IAが複雑化し主要導線が埋もれている",
      "モバイルUIがデスクトップの縮小版のまま",
      "月400件超のサポート問い合わせ",
    ],
    approach: [
      "競合5社のモバイルアプリIA分析と機能マッピング",
      "経理担当者8名へのコンテキストインタビュー（外出先での利用シーン観察）",
      "ジャーニーマップで離脱ポイントを4箇所特定",
      "ワイヤーフレーム3案を社内レビューで絞り込み",
      "Figmaプロトタイプで2ラウンドのユーザビリティテスト（計12名）",
      "デザインシステムに34種のモバイル専用コンポーネントを追加",
    ],
    keyDecisions: [
      "タブUIではなくステップ型UIを採用し、1画面1タスクで認知負荷を軽減",
      "OCR撮影→金額確認→カテゴリ選択の3ステップに集約し、最短10秒で完了",
      "デスクトップとの共通デザイントークンを定義し、クロスプラットフォームの一貫性を担保",
    ],
    outputs:
      "iOS/Android向けネイティブUIデザイン全86画面、共通コンポーネント34種、Figmaプロトタイプ、デザインガイドライン",
    figmaUrl: null,
    results:
      "リリース後3ヶ月で領収書登録完了率が55%→82%に改善。App Store評価が3.2→4.5に上昇。サポート問い合わせが月400件→150件に減少し、カスタマーサクセスチームの工数を大幅削減。",
    metrics: [
      "完了率: 55% → 82%（+49%）",
      "App Store: 3.2 → 4.5",
      "問い合わせ: -63%",
      "DAU: +28%",
    ],
    quote:
      "「撮るだけで終わるので、タクシーの中で経費精算が完結するようになった」（ユーザーインタビューより）",
    domainTags: ["toB", "SaaS", "フィンテック"],
    phaseTags: ["リニューアル", "改善"],
    skillTags: [
      "UXリサーチ",
      "情報設計",
      "UIデザイン",
      "デザインシステム",
      "ユーザビリティテスト",
    ],
    confidence: "高",
    reviewStatus: "確認済",
    notes: null,
    rawJson: null,
    createdAt: "2026-04-09T00:00:00Z",
    updatedAt: "2026-04-09T00:00:00Z",
  },
  {
    id: "p2",
    designerId: "d1",
    title: "HR SaaS 年末調整機能 0→1設計",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1763718528755-4bca23f82ac3?w=800&h=600&fit=crop",
    overview:
      "法改正で申告項目が倍増した年末調整を、初めての従業員でも迷わず完了できる質問形式のステップUIとしてゼロから設計。人事部の運用負荷を劇的に削減した。",
    period: "2022年10月〜2023年3月（6ヶ月）",
    team: "PdM 1・Des 1・Eng 3",
    role: "UXリサーチ〜UIデザイン・プロトタイプまで一貫担当",
    background:
      "法改正により申告項目が前年の2倍に増加。従来のフォーム型UIでは専門用語の壁が高く、従業員からの問い合わせが人事部に殺到していた。「年末調整の時期は毎年地獄」という人事担当者の声を受け、抜本的なUX改善が求められていた。",
    issues: [
      "従業員の完了率が62%で、未完了者への督促が人事部の大きな負担",
      "専門用語（配偶者特別控除、基礎控除等）が理解されず問い合わせが月300件",
      "途中離脱率が38%と高く、特に保険料控除の入力画面で顕著",
    ],
    approach: [
      "過去1年分の問い合わせ300件をカテゴリ分析し、つまずきポイントを定量把握",
      "人事担当者5名・従業員8名へのデプスインタビューで定性課題を抽出",
      "紙のペーパープロトで設問フロー3案を検証",
      "設問ツリーを心理負荷順に再設計（法定順序ではなく理解しやすい順）",
      "Figmaプロトタイプを社内モニター30名でテスト、3回のイテレーション",
    ],
    keyDecisions: [
      "全ての専門用語を平易な日本語に置換（例:「配偶者特別控除」→「配偶者の収入に応じた控除」）",
      "質問順は法定順ではなく心理負荷が軽い順に並べ、最初の成功体験を早くした",
      "入力途中の自動保存と再開機能を必須要件として設計",
    ],
    outputs:
      "質問フロー全26画面、エラーハンドリング・ヘルプUI、人事向けダッシュボード、操作マニュアル",
    figmaUrl: null,
    results:
      "従業員の完了率が62%→94%に改善。人事部への問い合わせが月300件→40件に87%減少。初年度で人事部の年末調整業務工数を75%削減し、残業時間を大幅に圧縮した。",
    metrics: [
      "完了率: 62% → 94%（+52%）",
      "問い合わせ: 300件 → 40件/月（-87%）",
      "人事部運用工数: -75%",
    ],
    quote:
      "「今年初めて残業なしで年末調整を終えられた。設問が分かりやすすぎて従業員から逆に感謝された」（人事担当者）",
    domainTags: ["toB", "SaaS", "HR"],
    phaseTags: ["0→1"],
    skillTags: ["UXリサーチ", "情報設計", "UIデザイン", "プロトタイピング"],
    confidence: "高",
    reviewStatus: "確認済",
    notes: null,
    rawJson: null,
    createdAt: "2026-04-09T00:00:00Z",
    updatedAt: "2026-04-09T00:00:00Z",
  },
  {
    id: "p3",
    designerId: "d1",
    title: "プロダクト横断デザインシステム構築",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1653647054667-c99dc7f914ef?w=800&h=600&fit=crop",
    overview:
      "5つのプロダクトで乱立していたUIパターンを統合し、42種のコアコンポーネントとセマンティックトークンで構成されるデザインシステムを構築。開発速度とUI品質を同時に向上させた。",
    period: "2023年10月〜2024年3月（6ヶ月）",
    team: "Des 2・Eng 2（専任チーム）",
    role: "リードデザイナー / デザインシステムオーナー",
    background:
      "5プロダクトで同一のUIパターンが最大4種類の異なる実装で存在していた。デザインレビューに1件平均40分かかり、新メンバーは「どのコンポーネントを使えばいいか分からない」と2週間以上オンボーディングに時間を要していた。",
    issues: [
      "同一パターンの実装が最大4種類存在し、見た目もインタラクションも不統一",
      "デザインレビューが1件あたり平均40分、週20時間をレビューに消費",
      "新メンバーのオンボーディングに平均2週間、「どれが正しいか分からない」が主因",
    ],
    approach: [
      "全5プロダクトから既存コンポーネント158種を棚卸しし、Spreadsheetで網羅的に整理",
      "使用頻度・重複度・カスタマイズ度の3軸でスコアリングし、統合優先度を決定",
      "158種を42種のコアコンポーネントに集約（用途別カテゴリで整理）",
      "Figmaコンポーネントライブラリ構築と同時に、StorybookでReact実装と同期",
      "全プロダクトチーム向けにワークショップを4回実施し、移行計画を合意",
    ],
    keyDecisions: [
      "Atomic Designではなく用途別カテゴリを採用（Navigation / Form / Feedback / Layout）— チームの理解度と検索性を優先",
      "カラートークンはセマンティック名のみ公開し、primitiveは非公開にして誤用を防止",
      "コントリビューションガイドラインを整備し、チーム横断での改善提案フローを標準化",
    ],
    outputs:
      "Figmaコンポーネントライブラリ（42種・全バリアント含め180+）、デザイントークン定義書（Color/Typography/Spacing/Shadow）、Storybookドキュメント、コントリビューションガイド",
    figmaUrl: null,
    results:
      "デザインレビュー時間が40分→12分に70%短縮。新メンバーのオンボーディングが2週間→3日に短縮。半年後のコンポーネント再利用率が85%に到達し、新機能の開発速度が平均30%向上。",
    metrics: [
      "レビュー時間: 40分 → 12分（-70%）",
      "オンボーディング: 2週間 → 3日",
      "再利用率: 85%",
      "開発速度: +30%",
    ],
    quote:
      "「もうFigmaで迷子にならない。必要なコンポーネントが3秒で見つかる」（ジュニアデザイナー）",
    domainTags: ["toB", "SaaS"],
    phaseTags: ["デザインシステム"],
    skillTags: ["デザインシステム", "UIデザイン", "情報設計", "チームビルディング"],
    confidence: "高",
    reviewStatus: "確認済",
    notes: null,
    rawJson: null,
    createdAt: "2026-04-09T00:00:00Z",
    updatedAt: "2026-04-09T00:00:00Z",
  },
];

const d1WorkHistory: WorkHistory[] = [
  {
    id: "w1",
    designerId: "d1",
    company: "フリーランス",
    role: "シニアプロダクトデザイナー（業務委託）",
    periodStart: "2024-04-01",
    periodEnd: null,
    isCurrent: true,
    description:
      "SaaS系スタートアップ2社でプロダクトデザインを支援。0→1の機能設計からデザインシステム整備まで一貫して担当し、両社ともシリーズA後のプロダクト品質向上に貢献。",
    domainTags: ["toB", "SaaS", "HR"],
    employmentType: "フリーランス",
    confidence: "高",
    reviewStatus: "確認済",
    createdAt: "2026-04-09T00:00:00Z",
    updatedAt: "2026-04-09T00:00:00Z",
  },
  {
    id: "w2",
    designerId: "d1",
    company: "freee株式会社",
    role: "シニアプロダクトデザイナー",
    periodStart: "2020-04-01",
    periodEnd: "2024-03-31",
    isCurrent: false,
    description:
      "クラウド会計SaaSのプロダクトデザイン全般を担当。モバイルアプリリニューアルをリードし、主要KPIを大幅改善。後半2年間はデザインシステム専任チームを立ち上げ、5プロダクト横断のUI統一を実現。",
    domainTags: ["toB", "SaaS", "フィンテック"],
    employmentType: "正社員",
    confidence: "高",
    reviewStatus: "確認済",
    createdAt: "2026-04-09T00:00:00Z",
    updatedAt: "2026-04-09T00:00:00Z",
  },
  {
    id: "w3",
    designerId: "d1",
    company: "株式会社SmartHR",
    role: "UI/UXデザイナー",
    periodStart: "2018-06-01",
    periodEnd: "2020-03-31",
    isCurrent: false,
    description:
      "HR SaaSの年末調整・社会保険手続き機能のUX/UI設計を担当。0→1の機能設計からユーザーテストまで一貫して対応し、複雑な業務フローを直感的なUIに変換するスキルを磨いた。",
    domainTags: ["toB", "SaaS", "HR"],
    employmentType: "正社員",
    confidence: "高",
    reviewStatus: "確認済",
    createdAt: "2026-04-09T00:00:00Z",
    updatedAt: "2026-04-09T00:00:00Z",
  },
];

/* ═══════════════════════════════════════════════════════════════
   d2 — リュウ アレン
   エージェンシー出身 toC UX/ブランド戦略デザイナー（Yahoo → Goodpatch）
   ═══════════════════════════════════════════════════════════════ */

const d2Projects: Project[] = [
  {
    id: "p4",
    designerId: "d2",
    title: "大手キャッシュレス決済アプリ UX再設計",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1765226410758-9ae3d34cd791?w=800&h=600&fit=crop",
    overview:
      "MAU 3,000万超のキャッシュレス決済アプリにおいて、2年間の長期パートナーシップでUX戦略策定からUIリニューアルまでを一貫してリード。ユーザー体験の統一とブランド価値の再定義を実現した。",
    period: "2021年4月〜2023年3月（2年間）",
    team: "PdM 2・Des 3・Eng 8・マーケ 2",
    role: "リードプロダクトデザイナー（UX戦略 / 情報設計 / UIデザイン / ブランディング）",
    background:
      "決済アプリ戦国時代の中、後発サービスとの差別化が急務だった。サービス開始から4年で機能が急増し、ボトムナビゲーションに収まらないほどの機能がカオスに並んでいた。ユーザーからは「何ができるアプリか分からない」という声が頻出。ブランドチームとプロダクトチームの連携も取れておらず、タッチポイントごとにトーンが異なる状態だった。",
    issues: [
      "ボトムナビに8機能が押し込まれ、主要動線のタップ到達率が42%に低下",
      "3つの事業部が独立してUIを設計しており、デザインの統一感がない",
      "NPS -12で、ユーザーの1/3が「使いにくい」と回答",
    ],
    approach: [
      "既存150画面を2つのペルソナ視点で全画面ウォークスルーし、構造的課題をマッピング",
      "ユーザー行動ログ分析で利用頻度Top10機能を特定し、80/20ルールで導線を再設計",
      "カードソーティング（N=40）で情報カテゴリを再定義し、IA刷新案を3案作成",
      "プロトタイプA/Bテスト（N=200）で最適案を選定",
      "ブランドガイドラインを策定し、全タッチポイントのトーン＆マナーを統一",
      "段階的リリース計画を策定し、6フェーズに分けてリスクを最小化",
    ],
    keyDecisions: [
      "ボトムナビを4つに集約し、サブ機能はタスクベースのホーム画面カードで動的表示",
      "ブランドカラーを活用したステータス表現（成功=グリーン、処理中=ブランドブルー）で視認性を統一",
      "段階的リリースを提案し、コア機能から3ヶ月ごとに刷新（ビッグバンリリースのリスクを回避）",
    ],
    outputs:
      "UX戦略ロードマップ、全150画面のIA再設計、UIデザイン一式、ブランドガイドライン、デザイン品質チェックリスト",
    figmaUrl: null,
    results:
      "リニューアル後6ヶ月でNPSが-12→+18に改善。主要導線のタップ到達率が42%→78%に向上。CVRが52.5%向上し、決済回数が前年比140%に成長。クライアントから「自社以上にサービスを理解している」と評価され、3年目の契約延長が決定。",
    metrics: [
      "NPS: -12 → +18",
      "タップ到達率: 42% → 78%",
      "CVR: +52.5%",
      "決済回数: 前年比140%",
    ],
    quote:
      "「自社以上にサービスと顧客を理解してくれている。ここまで深く入り込んでくれるパートナーは初めて」（クライアント事業部長）",
    domainTags: ["toC", "フィンテック"],
    phaseTags: ["改善", "リニューアル"],
    skillTags: [
      "UX戦略",
      "情報設計",
      "UIデザイン",
      "ブランディング",
      "データ分析",
    ],
    confidence: "高",
    reviewStatus: "確認済",
    notes: null,
    rawJson: null,
    createdAt: "2026-04-08T00:00:00Z",
    updatedAt: "2026-04-08T00:00:00Z",
  },
  {
    id: "p5",
    designerId: "d2",
    title: "大手不動産 コーポレートサイト 全面リニューアル",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1648134859179-ed0c98f54519?w=800&h=600&fit=crop",
    overview:
      "5万ページ超の大規模コーポレートサイトを、ユーザー中心設計で全面リニューアル。6事業部にまたがる情報構造を抜本的に再設計し、回遊率とコンバージョンを大幅に改善した。",
    period: "2022年4月〜2023年9月（18ヶ月）",
    team: "PdM 1・Des 2・Eng 6・コンテンツ 3",
    role: "UX/UIデザイナー / 情報設計リード",
    background:
      "6事業部がそれぞれ独自にページを追加し続けた結果、サイト構造が5万ページ超に肥大化。ユーザーが必要な物件情報にたどり着けず、問い合わせフォームへの到達率が2.1%と極端に低かった。モバイルからのアクセスが60%を超えているにもかかわらず、レスポンシブ対応は不十分だった。",
    issues: [
      "5万ページ超で全体構造を誰も把握できていない",
      "6事業部がバラバラにデザイン・情報設計しており統一感がゼロ",
      "問い合わせフォームへの到達率が2.1%と低迷",
      "モバイルアクセス60%超だがレスポンシブ対応が不完全",
    ],
    approach: [
      "Google Analytics 2年分のデータからアクセス上位500ページを特定し、主要導線を可視化",
      "社内6事業部のステークホルダー12名にインタビューし、事業目標と掲載コンテンツの関係を整理",
      "カードソーティング（N=30）でユーザー視点の情報分類を再定義",
      "ワイヤーフレーム段階で6事業部合同レビューを3回実施し、合意形成",
      "モバイルファーストでUIを設計し、デスクトップは拡張版として対応",
      "テンプレートシステムを設計し、事業部単独でページ追加しても品質が維持される仕組みを構築",
    ],
    keyDecisions: [
      "メガメニューからユーザーの目的ベースナビゲーションへ移行（「住まいを買う」「オフィスを探す」等）",
      "6事業部共通のページテンプレート（5種）を設計し、運用負荷を軽減しつつデザイン統一",
      "段階的な旧ページリダイレクト計画でSEOインパクトを最小化",
    ],
    outputs:
      "サイト全体のIA設計書、5種のページテンプレートUIデザイン、コンポーネントライブラリ（60種）、運用ガイドライン、移行計画書",
    figmaUrl: null,
    results:
      "リニューアル後、サイト内回遊率が35%向上。問い合わせフォームへの到達率が2.1%→5.8%に176%改善。テンプレート化により新ページ制作工数が1/3に削減され、運用コストを年間30%削減。",
    metrics: [
      "回遊率: +35%",
      "フォーム到達率: 2.1% → 5.8%（+176%）",
      "運用コスト: -30%/年",
      "ページ制作工数: 1/3に削減",
    ],
    quote:
      "「事業部間の壁をデザインの力で越えてくれた。全社で統一感のあるサイトは創業以来初めて」（デジタル推進部長）",
    domainTags: ["toC", "toB", "不動産"],
    phaseTags: ["リニューアル"],
    skillTags: ["情報設計", "UIデザイン", "UXリサーチ", "デザインシステム", "ステークホルダーマネジメント"],
    confidence: "高",
    reviewStatus: "確認済",
    notes: null,
    rawJson: null,
    createdAt: "2026-04-08T00:00:00Z",
    updatedAt: "2026-04-08T00:00:00Z",
  },
  {
    id: "p8",
    designerId: "d2",
    title: "ECアプリ 商品検索UX改善",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1757301714935-c8127a21abc6?w=800&h=600&fit=crop",
    overview:
      "国内大手ECアプリの商品検索・詳細閲覧フローを改善。検索結果のフィルタリングUXとパーソナライズ表示を再設計し、購買転換率を大幅に向上させた。",
    period: "2019年6月〜12月（7ヶ月）",
    team: "PdM 1・Des 1・Eng 4・データサイエンティスト 1",
    role: "UIデザイナー / UXリサーチャー",
    background:
      "検索結果ページからの離脱率が65%と高く、「欲しい商品が見つからない」がユーザー不満の1位。フィルタ機能は存在するが、カテゴリごとに異なるUIで使い方が直感的でなかった。",
    issues: [
      "検索結果ページの離脱率65%",
      "フィルタUIがカテゴリごとに不統一で使いにくい",
      "パーソナライズが弱く、過去の購買履歴が活かされていない",
    ],
    approach: [
      "検索ログ1ヶ月分を分析し、ゼロ結果検索・絞り込み放棄のパターンを特定",
      "ユーザーテスト10名で検索〜購入タスクを観察し、つまずきポイントを記録",
      "フィルタUIを全カテゴリ共通のボトムシート方式に統一",
      "データサイエンティストと連携し、パーソナライズロジックのUI表現を設計",
    ],
    keyDecisions: [
      "フィルタをサイドバーからボトムシートに変更し、モバイルでの操作性を優先",
      "「あなたへのおすすめ」セクションを検索結果上部に配置し、パーソナライズの価値を明示",
    ],
    outputs:
      "検索結果・フィルタ・商品詳細の全画面リデザイン（42画面）、パーソナライズUIコンポーネント、A/Bテスト設計書",
    figmaUrl: null,
    results:
      "検索結果ページの離脱率が65%→41%に改善。商品詳細への遷移率が28%向上し、購買CVRが18%向上。パーソナライズ経由の購買が全体の22%を占めるようになった。",
    metrics: [
      "検索離脱率: 65% → 41%（-37%）",
      "詳細遷移率: +28%",
      "購買CVR: +18%",
    ],
    quote: null,
    domainTags: ["toC", "EC"],
    phaseTags: ["改善"],
    skillTags: ["UIデザイン", "UXリサーチ", "データ分析", "プロトタイピング"],
    confidence: "高",
    reviewStatus: "確認済",
    notes: null,
    rawJson: null,
    createdAt: "2026-04-08T00:00:00Z",
    updatedAt: "2026-04-08T00:00:00Z",
  },
];

const d2WorkHistory: WorkHistory[] = [
  {
    id: "w4",
    designerId: "d2",
    company: "株式会社グッドパッチ",
    role: "シニアプロダクトデザイナー",
    periodStart: "2020-01-01",
    periodEnd: null,
    isCurrent: true,
    description:
      "大手クライアント向けのUX/UIデザイン支援をリード。決済アプリ・不動産サイト等の長期プロジェクトで、UX戦略策定からUI実装支援まで一貫して担当。チーム内のデザインレビュー文化の構築にも貢献。",
    domainTags: ["toC", "toB", "フィンテック", "不動産"],
    employmentType: "正社員",
    confidence: "高",
    reviewStatus: "確認済",
    createdAt: "2026-04-08T00:00:00Z",
    updatedAt: "2026-04-08T00:00:00Z",
  },
  {
    id: "w5",
    designerId: "d2",
    company: "ヤフー株式会社",
    role: "UIデザイナー",
    periodStart: "2017-04-01",
    periodEnd: "2019-12-31",
    isCurrent: false,
    description:
      "ECアプリのモバイルUI設計を担当。検索・商品詳細・カート画面の改善プロジェクトをリードし、購買CVR向上に貢献。大規模プロダクトにおけるA/Bテスト駆動のデザインプロセスを経験。",
    domainTags: ["toC", "EC"],
    employmentType: "正社員",
    confidence: "高",
    reviewStatus: "確認済",
    createdAt: "2026-04-08T00:00:00Z",
    updatedAt: "2026-04-08T00:00:00Z",
  },
];

/* ═══════════════════════════════════════════════════════════════
   d3 — 森本 奈々
   ヘルスケア × 教育ドメイン UXデザイナー（Schoo → メドレー）
   ═══════════════════════════════════════════════════════════════ */

const d3Projects: Project[] = [
  {
    id: "p6",
    designerId: "d3",
    title: "オンライン診療サービス 予約UX改善",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1706509511838-4b101f379ef3?w=800&h=600&fit=crop",
    overview:
      "オンライン診療サービスの予約〜診療〜決済までのエンドツーエンド体験を再設計。患者視点の「症状ベース」導線に転換し、初回利用の予約完了率を大幅に改善した。",
    period: "2024年1月〜6月（6ヶ月）",
    team: "PdM 1・Des 1・Eng 3・医療アドバイザー 1",
    role: "UX/UIデザイナー（リサーチから実装支援まで一貫）",
    background:
      "コロナ禍で急増したオンライン診療の需要が定着フェーズに入る中、初回ユーザーの予約完了率が38%と低迷。特に「診療科選択」画面での離脱が顕著で、患者は自分の症状がどの診療科に該当するか分からないまま離脱していた。決済画面でのドロップオフも多く、初回のハードルの高さが課題だった。",
    issues: [
      "初回予約完了率が38%と低く、特に診療科選択画面で26%が離脱",
      "患者が自分の症状と診療科の対応関係を理解できない",
      "決済情報の事前登録が必須で、初回利用のハードルが高い",
      "医師のプロフィール情報が不十分で、患者が医師を選べない",
    ],
    approach: [
      "患者12名・医師4名へのデプスインタビューで、予約〜診療〜決済の各フェーズの体験を調査",
      "既存フローのファネル分析で離脱ポイントを定量的に特定",
      "競合3サービス（国内1・海外2）のベンチマーク分析",
      "症状ベースの導線プロトタイプをFigmaで作成し、患者8名でA/Bテスト",
      "医療アドバイザーと連携し、症状→診療科のマッピングロジックを設計",
    ],
    keyDecisions: [
      "診療科選択を廃止し「症状から探す」導線に全面転換（患者は診療科名を知らないという調査結果に基づく）",
      "決済情報の事前登録を任意化し、診療後の後払いオプションを追加して初回ハードルを低減",
      "医師プロフィールに「得意な症状」「患者の声」を追加し、選択の判断材料を強化",
    ],
    outputs:
      "予約フロー全画面リデザイン（32画面）、症状→診療科マッピングUI、医師プロフィールカードコンポーネント、決済フロー改善、患者向けオンボーディングフロー",
    figmaUrl: null,
    results:
      "初回予約完了率が38%→67%に76%改善。診療科選択画面の離脱率が26%→8%に大幅減。患者NPS +22pt向上し、「こんなに簡単に予約できると思わなかった」という声が増加。リピート率も15%向上。",
    metrics: [
      "予約完了率: 38% → 67%（+76%）",
      "NPS: +22pt",
      "初回予約リードタイム: -45%",
      "リピート率: +15%",
    ],
    quote:
      "「症状を選ぶだけで適切な先生が見つかる。病院選びのストレスがなくなった」（30代・初回利用患者）",
    domainTags: ["toC", "ヘルスケア", "SaaS"],
    phaseTags: ["改善"],
    skillTags: ["UXリサーチ", "UIデザイン", "プロトタイピング", "ユーザビリティテスト"],
    confidence: "高",
    reviewStatus: "確認済",
    notes: null,
    rawJson: null,
    createdAt: "2026-04-10T00:00:00Z",
    updatedAt: "2026-04-10T00:00:00Z",
  },
  {
    id: "p7",
    designerId: "d3",
    title: "社会人学習プラットフォーム 習慣化UX設計",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1771923082503-0a3381c46cef?w=800&h=600&fit=crop",
    overview:
      "社会人向けオンライン学習サービスで、学習継続率の低さを行動経済学のナッジ理論を応用したUXで解決。ストリーク・目標設定・ピアラーニングの3機能を0→1で設計し、3ヶ月継続率を3倍に改善した。",
    period: "2023年4月〜10月（7ヶ月）",
    team: "PdM 1・Des 2・Eng 5・データアナリスト 1",
    role: "リードUXデザイナー / ユーザーリサーチ",
    background:
      "動画視聴型のオンライン学習サービスで、登録1ヶ月後の利用率が45%、3ヶ月後には15%まで低下。学習は「始める」より「続ける」が難しく、モチベーション維持の仕組みがプロダクトに欠けていた。競合は学習管理機能を強化し始めており、差別化が急務だった。",
    issues: [
      "3ヶ月後の利用率が15%まで低下（登録時から85%減）",
      "学習進捗が可視化されておらず、達成感が得られない",
      "個人学習のみで孤独感があり、仲間と学ぶモチベーションが生まれない",
      "学習目標が曖昧なまま始まり、何をどこまでやればいいか分からない",
    ],
    approach: [
      "継続ユーザー10名・離脱ユーザー10名へのデプスインタビューで継続/離脱の分岐点を特定",
      "行動経済学の文献リサーチ（ナッジ理論・習慣ループ・自己決定理論）を設計原則に変換",
      "Duolingo・Nike Run Club等の習慣化に成功しているアプリ5つをベンチマーク",
      "ジャーニーマップで「学習モチベーションの波」を可視化し、介入ポイントを設計",
      "MVP3機能のプロトタイプを作成し、社内β版で2週間のフィールドテスト（N=50）",
    ],
    keyDecisions: [
      "オンボーディングに「今週の学習目標」設定を組み込み、コミットメントデバイスとして活用",
      "ストリーク表示（連続学習日数）でロスアバージョン心理を活用し、習慣形成を促進",
      "ピアラーニング機能は「学習メモの公開」に絞り、SNS疲れを避けるミニマル設計",
    ],
    outputs:
      "学習コース機能一式（30画面）、進捗ダッシュボード、ストリーク＆目標設定UI、ピアラーニングフィード、リマインド通知設計、行動変容デザインガイドライン",
    figmaUrl: null,
    results:
      "3ヶ月継続率が15%→42%に180%改善。週間アクティブ学習時間が平均2.1時間→4.3時間に倍増。有料プラン転換率が18%向上し、ARPUも12%増加。「学習が生活の一部になった」という声が急増。",
    metrics: [
      "3ヶ月継続率: 15% → 42%（+180%）",
      "週間学習時間: 2.1h → 4.3h",
      "有料転換率: +18%",
      "DAU: +35%",
    ],
    quote:
      "「ストリークを切りたくなくて、毎朝15分の学習が歯磨きと同じ習慣になった」（28歳・マーケター）",
    domainTags: ["toC", "教育"],
    phaseTags: ["0→1"],
    skillTags: ["UXリサーチ", "情報設計", "UIデザイン", "プロトタイピング", "行動変容デザイン"],
    confidence: "高",
    reviewStatus: "確認済",
    notes: null,
    rawJson: null,
    createdAt: "2026-04-10T00:00:00Z",
    updatedAt: "2026-04-10T00:00:00Z",
  },
];

const d3WorkHistory: WorkHistory[] = [
  {
    id: "w6",
    designerId: "d3",
    company: "株式会社メドレー",
    role: "プロダクトデザイナー",
    periodStart: "2023-10-01",
    periodEnd: null,
    isCurrent: true,
    description:
      "オンライン診療サービスのUX/UI改善を担当。患者と医師双方の体験設計に従事し、予約フローの全面リデザインで主要KPIを大幅改善。ヘルスケアドメインの専門知識を活かし、医療アドバイザーとの協業もリード。",
    domainTags: ["toC", "ヘルスケア", "SaaS"],
    employmentType: "正社員",
    confidence: "高",
    reviewStatus: "確認済",
    createdAt: "2026-04-10T00:00:00Z",
    updatedAt: "2026-04-10T00:00:00Z",
  },
  {
    id: "w7",
    designerId: "d3",
    company: "株式会社Schoo",
    role: "UXデザイナー",
    periodStart: "2021-04-01",
    periodEnd: "2023-09-30",
    isCurrent: false,
    description:
      "社会人向けオンライン学習プラットフォームの新機能設計・UXリサーチを担当。行動経済学を応用した学習継続UXの設計で3ヶ月継続率を3倍に改善。データアナリストとの協業でデータドリブンなUX改善プロセスを確立。",
    domainTags: ["toC", "教育"],
    employmentType: "正社員",
    confidence: "高",
    reviewStatus: "確認済",
    createdAt: "2026-04-10T00:00:00Z",
    updatedAt: "2026-04-10T00:00:00Z",
  },
];

/* ═══════════════════════════════════════════════════════════════
   Designers
   ═══════════════════════════════════════════════════════════════ */

export const mockDesigners: DesignerWithRelations[] = [
  {
    id: "d1",
    name: "水谷 彩花",
    slug: "mizutani-ayaka",
    status: "完了",
    sourceUrl: "/data/designers/mizutani-ayaka.md",
    sourceType: "その他",
    importedAt: "2026-04-09T00:00:00Z",
    publishedAt: "2026-04-09T12:00:00Z",
    profileImageUrl: "/profile-mizutani-ayaka.png",
    bio: "「複雑をシンプルに、シンプルを心地よく」をモットーに、toB SaaSプロダクトのUX/UIデザインに取り組んでいます。リサーチからデザインシステム構築まで一貫して担当できることが強みです。ユーザーが「考えずに使える」体験を目指して、日々デザインしています。",
    socialLinks: {
      x: "https://x.com/ayaka_mizutani",
      note: "https://note.com/ayaka_mizutani",
      linkedin: "https://linkedin.com/in/ayaka-mizutani",
    },
    availabilityStatus: "募集中",
    availabilityNote: null,
    skillScores: {
      strategyDesign: 4,
      research: 5,
      uxDesign: 4,
      uiImplementation: 5,
      aiUtilization: 3,
    },
    subSkillScores: {
      strategyPlanning: 4,
      decisionDesign: 4,
      stakeholderMgmt: 3,
      hypothesisTesting: 4,
      kpiMgmt: 4,
      domainUnderstanding: 5,
      userUnderstanding: 5,
      insightExtraction: 5,
      problemStructuring: 4,
      priorityDesign: 5,
      experienceConcept: 4,
      informationDesign: 5,
      flowDesign: 4,
      interactionDesign: 4,
      usabilityImprovement: 4,
      stateDesign: 3,
      accessibilityDesign: 3,
      designSystem: 5,
      structuralDesign: 5,
      visualDesign: 4,
      devCollaboration: 5,
      prototyping: 5,
      operationDesign: 4,
      aiInfoGathering: 3,
      aiToolSelection: 3,
      promptDesign: 3,
      aiProcessIntegration: 2,
    },
    rawText: null,
    projects: d1Projects,
    workHistory: d1WorkHistory,
    createdAt: "2026-04-09T00:00:00Z",
    updatedAt: "2026-04-09T00:00:00Z",
  },
  {
    id: "d2",
    name: "リュウ アレン",
    slug: "ryu-allen",
    status: "完了",
    sourceUrl: "/data/designers/ryu-allen.md",
    sourceType: "その他",
    importedAt: "2026-04-08T00:00:00Z",
    publishedAt: "2026-04-08T18:00:00Z",
    profileImageUrl: "/profile-ryu-allen.png",
    bio: "エージェンシーで培った「ビジネス視点×ユーザー視点」の両立が強みです。大規模toCプロダクトのUX戦略策定から、ブランド体験の設計までを一気通貫で手がけています。クライアントの事業を深く理解し、デザインで成果を出すことにこだわっています。",
    socialLinks: {
      x: "https://x.com/allen_ryu_design",
      linkedin: "https://linkedin.com/in/allen-ryu",
      behance: "https://behance.net/allenryu",
    },
    availabilityStatus: "稼働中",
    availabilityNote: null,
    skillScores: {
      strategyDesign: 5,
      research: 4,
      uxDesign: 5,
      uiImplementation: 4,
      aiUtilization: 3,
    },
    subSkillScores: {
      strategyPlanning: 5,
      decisionDesign: 5,
      stakeholderMgmt: 5,
      hypothesisTesting: 4,
      kpiMgmt: 4,
      domainUnderstanding: 4,
      userUnderstanding: 5,
      insightExtraction: 4,
      problemStructuring: 4,
      priorityDesign: 3,
      experienceConcept: 5,
      informationDesign: 5,
      flowDesign: 5,
      interactionDesign: 4,
      usabilityImprovement: 4,
      stateDesign: 4,
      accessibilityDesign: 3,
      designSystem: 4,
      structuralDesign: 5,
      visualDesign: 5,
      devCollaboration: 3,
      prototyping: 3,
      operationDesign: 3,
      aiInfoGathering: 3,
      aiToolSelection: 3,
      promptDesign: 2,
      aiProcessIntegration: 2,
    },
    rawText: null,
    projects: d2Projects,
    workHistory: d2WorkHistory,
    createdAt: "2026-04-08T00:00:00Z",
    updatedAt: "2026-04-08T00:00:00Z",
  },
  {
    id: "d3",
    name: "森本 奈々",
    slug: "morimoto-nana",
    status: "完了",
    sourceUrl: "/data/designers/morimoto-nana.md",
    sourceType: "その他",
    importedAt: "2026-04-10T00:00:00Z",
    publishedAt: "2026-04-10T15:00:00Z",
    profileImageUrl: "/profile-morimoto-nana.png",
    bio: "ヘルスケアと教育という「人の行動を変える」領域に情熱を持っています。行動経済学やナッジ理論をデザインに応用し、ユーザーが自然と良い習慣を身につけられる体験を設計することが得意です。",
    socialLinks: {
      x: "https://x.com/nana_morimoto",
      note: "https://note.com/nana_morimoto",
    },
    availabilityStatus: "相談可",
    availabilityNote: "2025年7月〜稼働可能",
    skillScores: {
      strategyDesign: 3,
      research: 5,
      uxDesign: 4,
      uiImplementation: 3,
      aiUtilization: 4,
    },
    subSkillScores: {
      strategyPlanning: 3,
      decisionDesign: 3,
      stakeholderMgmt: 2,
      hypothesisTesting: 4,
      kpiMgmt: 3,
      domainUnderstanding: 5,
      userUnderstanding: 5,
      insightExtraction: 5,
      problemStructuring: 5,
      priorityDesign: 4,
      experienceConcept: 4,
      informationDesign: 4,
      flowDesign: 4,
      interactionDesign: 3,
      usabilityImprovement: 5,
      stateDesign: 3,
      accessibilityDesign: 3,
      designSystem: 2,
      structuralDesign: 3,
      visualDesign: 3,
      devCollaboration: 3,
      prototyping: 4,
      operationDesign: 3,
      aiInfoGathering: 4,
      aiToolSelection: 4,
      promptDesign: 4,
      aiProcessIntegration: 3,
    },
    rawText: null,
    projects: d3Projects,
    workHistory: d3WorkHistory,
    createdAt: "2026-04-10T00:00:00Z",
    updatedAt: "2026-04-10T00:00:00Z",
  },
  {
    id: "d4",
    name: "吉川 結衣",
    slug: null,
    status: "処理中",
    sourceUrl: "/data/designers/yoshikawa-yui.md",
    sourceType: "その他",
    importedAt: "2026-04-15T00:00:00Z",
    publishedAt: null,
    profileImageUrl: null,
    bio: null,
    socialLinks: null,
    availabilityStatus: null,
    availabilityNote: null,
    skillScores: null,
    subSkillScores: null,
    rawText: null,
    projects: [],
    workHistory: [],
    createdAt: "2026-04-15T00:00:00Z",
    updatedAt: "2026-04-15T00:00:00Z",
  },
];

/** ID → Designer lookup */
export function getMockDesigner(id: string) {
  return mockDesigners.find((d) => d.id === id) ?? null;
}

/** slug → Designer lookup */
export function getMockDesignerBySlug(slug: string) {
  return mockDesigners.find((d) => d.slug !== null && d.slug === slug) ?? null;
}

/** ID → Project lookup */
export function getMockProject(id: string) {
  for (const d of mockDesigners) {
    const p = d.projects.find((p) => p.id === id);
    if (p) return { project: p, designer: d };
  }
  return null;
}
