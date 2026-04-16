/**
 * Mock Data — バックエンド接続前の仮データ
 * API実装後に削除
 */

import type {
  DesignerWithRelations,
  Project,
  WorkHistory,
} from "./schema";

const projects: Project[] = [
  {
    id: "p1",
    designerId: "d1",
    title: "freee会計 モバイルアプリ リニューアル",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    overview:
      "中小企業の経理担当者向けに、月次決算業務の負担を減らすため、モバイルでの領収書処理フローを再設計した。",
    period: "2023年4月〜9月",
    team: "PdM 1・Des 2・Eng 4",
    role: "リードUIデザイナー / デザインシステム整備",
    background:
      "既存アプリは機能追加の繰り返しでIAが複雑化し、主要導線のCVRが低下していた。経営層からリニューアル指示があり、3ヶ月でMVPリリースが必要だった。",
    issues: [
      "IA複雑化で主要導線が見えない",
      "離脱率45%",
      "モバイル対応が後手",
    ],
    approach: [
      "競合5社のIA分析",
      "ユーザーインタビュー8名",
      "ジャーニーマップ作成",
      "ワイヤー3案レビュー",
      "UI・プロトタイプ作成",
      "ユーザビリティテスト6名",
    ],
    keyDecisions: [
      "タブUIではなくステップ型UIを採用（離脱率低減のため）",
      "MVP段階はモバイル優先",
    ],
    outputs:
      "iOS/Android向けネイティブUIデザイン一式、共通コンポーネント34種、Figmaプロトタイプ",
    figmaUrl: null,
    results:
      "リリース後3ヶ月で主要導線CVRが1.2%→3.4%に改善。App Store評価も3.2→4.5へ向上。",
    metrics: [
      "CVR: 1.2% → 3.4%（+183%）",
      "App Store: 3.2 → 4.5",
      "DAU: +28%",
    ],
    quote:
      "「画面を開いた瞬間に何をすればいいか分かる」（ユーザーインタビューより）",
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
    title: "SmartHR 年末調整機能の0→1設計",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    overview:
      "初めて年末調整を行う従業員でも迷わず完了できるよう、質問形式のステップUIをゼロから設計した。",
    period: "2022年10月〜2023年3月（約6ヶ月）",
    team: "Des 1・Eng 3",
    role: "UXリサーチからUIデザイン・プロトタイプまで一貫",
    background:
      "法改正により申告項目が倍増。従業員の問い合わせが殺到し、人事担当の運用負荷が限界に達していた。",
    issues: [
      "初見ユーザーが設問の意味を理解できない",
      "途中離脱率が高い",
      "問い合わせが人事部に集中",
    ],
    approach: [
      "過去問い合わせ100件を分類",
      "ペーパープロト検証",
      "設問ツリー設計",
      "ステップUI実装",
      "社内モニター30名テスト",
    ],
    keyDecisions: [
      "専門用語を平易な日本語に全面置換",
      "質問順は法定順ではなく心理負荷順で並べ替え",
    ],
    outputs:
      "質問フロー26画面、エラー/ヘルプUI、人事向け管理画面、ヘルプドキュメント",
    figmaUrl: null,
    results:
      "従業員の完遂率が62%→94%に改善、人事部への問い合わせ件数が月間300件→40件まで減少。",
    metrics: [
      "完遂率: 62% → 94%",
      "問い合わせ: 300件 → 40件/月",
      "運用工数: -75%",
    ],
    quote: "「今年初めて泣かずに終わった」（従業員アンケート自由記述）",
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
    title: "社内デザインシステム構築",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=600&fit=crop",
    overview:
      "プロダクト横断のUI一貫性と開発速度向上のため、Figmaコンポーネントライブラリとドキュメントを整備した。",
    period: "2023年10月〜2024年3月",
    team: "Des 2・Eng 2",
    role: "リードデザイナー / デザインシステムオーナー",
    background:
      "複数プロダクトで同じUIパターンが異なる実装になっており、デザインレビューに膨大な時間がかかっていた。",
    issues: [
      "同一パターンの実装が3種以上存在",
      "デザインレビュー1件あたり平均40分",
      "新メンバーのオンボーディングに2週間",
    ],
    approach: [
      "既存コンポーネント150種の棚卸し",
      "統合可能なパターンをグルーピング",
      "コアコンポーネント42種に集約",
      "Figma + Storybookで同期体制構築",
    ],
    keyDecisions: [
      "Atomic Designではなく用途別カテゴリを採用（チーム理解度を優先）",
      "カラートークンはセマンティック名のみ公開（primitive非公開）",
    ],
    outputs:
      "Figmaコンポーネントライブラリ（42種）、デザイントークン定義書、Storybookドキュメント",
    figmaUrl: null,
    results:
      "デザインレビュー時間が平均40分→12分に短縮。新メンバーのオンボーディング期間が2週間→3日に。",
    metrics: [
      "レビュー時間: 40分 → 12分（-70%）",
      "オンボーディング: 2週間 → 3日",
      "コンポーネント再利用率: 85%",
    ],
    quote: null,
    domainTags: ["toB", "SaaS"],
    phaseTags: ["デザインシステム"],
    skillTags: ["デザインシステム", "UIデザイン", "情報設計"],
    confidence: "中",
    reviewStatus: "未確認",
    notes: "定量成果がグラフ画像のみで数値テキスト無しのため一部推定",
    rawJson: null,
    createdAt: "2026-04-09T00:00:00Z",
    updatedAt: "2026-04-09T00:00:00Z",
  },
];

const workHistory: WorkHistory[] = [
  {
    id: "w1",
    designerId: "d1",
    company: "freee株式会社",
    role: "シニアプロダクトデザイナー",
    periodStart: "2020-04-01",
    periodEnd: "2024-03-31",
    isCurrent: false,
    description:
      "会計SaaSのプロダクトデザイン全般を担当。モバイルリニューアルをリードし、主要KPIを大幅改善。デザインシステム運用チームの立ち上げにも参画。",
    domainTags: ["toB", "SaaS", "フィンテック"],
    employmentType: "正社員",
    confidence: "高",
    reviewStatus: "確認済",
    createdAt: "2026-04-09T00:00:00Z",
    updatedAt: "2026-04-09T00:00:00Z",
  },
  {
    id: "w2",
    designerId: "d1",
    company: "株式会社SmartHR",
    role: "UI/UXデザイナー",
    periodStart: "2018-06-01",
    periodEnd: "2020-03-31",
    isCurrent: false,
    description:
      "HR系SaaSの年末調整・社会保険機能のUX/UI設計を担当。0→1の機能設計からユーザーテストまで一貫して対応。",
    domainTags: ["toB", "SaaS", "HR"],
    employmentType: "正社員",
    confidence: "高",
    reviewStatus: "確認済",
    createdAt: "2026-04-09T00:00:00Z",
    updatedAt: "2026-04-09T00:00:00Z",
  },
  {
    id: "w3",
    designerId: "d1",
    company: "フリーランス",
    role: "UI/UXデザイナー（業務委託）",
    periodStart: "2024-04-01",
    periodEnd: null,
    isCurrent: true,
    description:
      "HR系スタートアップ2社でUI/UX支援。0→1の機能設計からユーザーテストまで一貫して担当。",
    domainTags: ["toB", "SaaS", "HR"],
    employmentType: "フリーランス",
    confidence: "中",
    reviewStatus: "未確認",
    createdAt: "2026-04-09T00:00:00Z",
    updatedAt: "2026-04-09T00:00:00Z",
  },
];

export const mockDesigners: DesignerWithRelations[] = [
  {
    id: "d1",
    name: "廣瀬 紗央里",
    slug: "hirose-saori",
    status: "完了",
    sourceUrl: "https://www.behance.net/saori-hirose",
    sourceType: "PDF",
    importedAt: "2026-04-09T00:00:00Z",
    publishedAt: "2026-04-09T12:00:00Z",
    profileImageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face",
    rawText: null,
    projects,
    workHistory,
    createdAt: "2026-04-09T00:00:00Z",
    updatedAt: "2026-04-09T00:00:00Z",
  },
  {
    id: "d2",
    name: "ヤオ ケビン",
    slug: "yao-kevin",
    status: "要確認",
    sourceUrl: "https://www.behance.net/kevin-yao",
    sourceType: "Behance",
    importedAt: "2026-04-08T00:00:00Z",
    publishedAt: null,
    profileImageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    rawText: null,
    projects: [
      {
        id: "p4",
        designerId: "d2",
        title: "NTTドコモ d払い 長期サービス改善",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
        overview:
          "スマホバーコード決済アプリ業界の競争激化を背景に、d払いの顧客体験向上とリポジショニングを図る長期パートナーシップ。",
        period: "2021年〜2023年",
        team: "PdM 2・Des 3・Eng 8",
        role: "リードプロダクトデザイナー（UX/情報設計/UIデザイン/ブランディング）",
        background:
          "複数の決済アプリが乱立する中、d払いはユーザー体験の差別化が急務だった。UIの統一感が欠如し、機能追加のたびにナビゲーションが複雑化していた。",
        issues: [
          "部門ごとに異なるUX/UI設計",
          "5万ページ超のWeb構造が未統合",
          "顧客体験の一貫性が欠如",
        ],
        approach: [
          "既存150画面を2ロールから実機で確認",
          "業務フロー・状態遷移の観点から構造的課題を整理",
          "4ステップの業務プロセスに再定義",
          "デザインガイドライン策定・浸透",
        ],
        keyDecisions: [
          "ボトムナビを廃止しタスクベースのホーム画面に統合",
          "ブランドカラーを活用したステータス表現で視認性を向上",
        ],
        outputs:
          "サービス全体のUX再設計、情報設計、権限構造に基づくナビゲーション設計、デザインガイドライン",
        figmaUrl: null,
        results:
          "サイトトラフィック400%増加、CVR52.5%向上を達成。クライアントから長期パートナーとして継続契約。",
        metrics: ["サイトトラフィック: +400%", "CVR: +52.5%"],
        quote:
          "「自社以上にサービスと顧客を理解している」（クライアント評価）",
        domainTags: ["toC", "フィンテック", "モビリティ"],
        phaseTags: ["改善", "リニューアル"],
        skillTags: [
          "UXリサーチ",
          "情報設計",
          "UIデザイン",
          "ビジュアルデザイン",
        ],
        confidence: "中",
        reviewStatus: "未確認",
        notes: "Teamの人数記載なし。定量成果は一部画像からの読み取り。",
        rawJson: null,
        createdAt: "2026-04-08T00:00:00Z",
        updatedAt: "2026-04-08T00:00:00Z",
      },
      {
        id: "p5",
        designerId: "d2",
        title: "住友不動産 コーポレートサイト リニューアル",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
        overview:
          "5万ページ超の大規模コーポレートサイトを、ユーザー中心設計で全面リニューアル。情報構造の抜本的な再設計を行った。",
        period: "2022年4月〜2023年9月",
        team: "PdM 1・Des 2・Eng 6",
        role: "UX/UIデザイナー / 情報設計リード",
        background:
          "複数事業部が独自にページを追加し続けた結果、サイト構造が肥大化。ユーザーが必要な情報にたどり着けず、問い合わせが増加していた。",
        issues: [
          "5万ページ超で全体構造を把握できない",
          "事業部ごとにデザインが統一されていない",
          "モバイル対応が不十分",
        ],
        approach: [
          "アクセスログ分析で主要導線を特定",
          "カードソーティングで情報分類を再定義",
          "プロトタイプでステークホルダーと合意形成",
          "デザインシステムで全事業部のUI統一",
        ],
        keyDecisions: [
          "メガメニューからタスクベースナビゲーションへ移行",
          "各事業部ページのテンプレート化で運用負荷を軽減",
        ],
        outputs:
          "サイト全体のIA設計書、UIデザイン一式、コンポーネントライブラリ、運用ガイドライン",
        figmaUrl: null,
        results:
          "サイト内回遊率35%向上、問い合わせ転換率20%改善。運用コストの年間30%削減を実現。",
        metrics: [
          "回遊率: +35%",
          "問い合わせ転換率: +20%",
          "運用コスト: -30%/年",
        ],
        quote: null,
        domainTags: ["toB", "不動産"],
        phaseTags: ["リニューアル"],
        skillTags: ["情報設計", "UIデザイン", "UXリサーチ", "デザインシステム"],
        confidence: "中",
        reviewStatus: "未確認",
        notes: null,
        rawJson: null,
        createdAt: "2026-04-08T00:00:00Z",
        updatedAt: "2026-04-08T00:00:00Z",
      },
    ],
    workHistory: [
      {
        id: "w4",
        designerId: "d2",
        company: "株式会社グッドパッチ",
        role: "プロダクトデザイナー",
        periodStart: "2020-01-01",
        periodEnd: null,
        isCurrent: true,
        description:
          "大手クライアント向けのUX/UIデザイン支援。d払い、住友不動産等の長期プロジェクトをリード。",
        domainTags: ["toC", "toB"],
        employmentType: "正社員",
        confidence: "中",
        reviewStatus: "未確認",
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
          "Yahoo!ショッピングのモバイルアプリUIデザインを担当。検索・商品詳細画面の改善でCVR向上に貢献。",
        domainTags: ["toC", "EC"],
        employmentType: "正社員",
        confidence: "中",
        reviewStatus: "未確認",
        createdAt: "2026-04-08T00:00:00Z",
        updatedAt: "2026-04-08T00:00:00Z",
      },
    ],
    createdAt: "2026-04-08T00:00:00Z",
    updatedAt: "2026-04-08T00:00:00Z",
  },
  {
    id: "d3",
    name: "砂田 祐佳",
    slug: "sunada-yuka",
    status: "完了",
    sourceUrl: "https://www.notion.so/sunada-portfolio",
    sourceType: "Notion",
    importedAt: "2026-04-10T00:00:00Z",
    publishedAt: "2026-04-10T15:00:00Z",
    profileImageUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    rawText: null,
    projects: [
      {
        id: "p6",
        designerId: "d3",
        title: "メドレー CLINICS オンライン診療UX改善",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop",
        overview:
          "患者の予約〜診療〜決済までのオンライン体験を一貫して設計し直し、初回利用の離脱率を大幅に改善した。",
        period: "2024年1月〜6月",
        team: "PdM 1・Des 1・Eng 3",
        role: "UX/UIデザイナー（リサーチからUI実装まで一貫）",
        background:
          "コロナ禍で急増したオンライン診療の需要に対し、既存UIが複雑で初回ユーザーの予約完了率が低かった。",
        issues: [
          "初回予約完了率が38%と低い",
          "診療科選択〜医師選択の導線が分かりにくい",
          "決済画面での離脱が多い",
        ],
        approach: [
          "ユーザーインタビュー12名（患者・医師双方）",
          "既存フローのファネル分析",
          "競合3サービスのベンチマーク",
          "プロトタイプA/Bテスト",
        ],
        keyDecisions: [
          "診療科→症状ベースの導線に変更（患者は診療科名を知らない）",
          "決済情報の事前登録を任意化して初回ハードルを下げた",
        ],
        outputs: "予約フロー全画面リデザイン、医師プロフィールカード、決済フロー改善",
        figmaUrl: null,
        results: "初回予約完了率38%→67%に改善。患者NPS +22pt向上。",
        metrics: [
          "予約完了率: 38% → 67%",
          "NPS: +22pt",
          "初回予約リードタイム: -45%",
        ],
        quote: "「こんなに簡単に予約できると思わなかった」（ユーザーテスト参加者）",
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
        title: "Schoo 学習プラットフォーム 0→1設計",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=600&fit=crop",
        overview:
          "社会人向けオンライン学習サービスの新規学習コース機能を0から設計。習慣化を促すUXを追求した。",
        period: "2023年4月〜10月",
        team: "PdM 1・Des 2・Eng 5",
        role: "リードUXデザイナー / ユーザーリサーチ",
        background:
          "既存の動画視聴型学習では継続率が低く、3ヶ月後の利用率が15%まで低下していた。",
        issues: [
          "学習継続率が3ヶ月で85%低下",
          "学習進捗が可視化されていない",
          "コミュニティ機能がなく孤独感がある",
        ],
        approach: [
          "行動経済学のナッジ理論をUXに応用",
          "学習者20名へのデプスインタビュー",
          "ジャーニーマップで離脱ポイントを特定",
          "MVP機能のプロトタイプ検証",
        ],
        keyDecisions: [
          "週次の学習目標設定をオンボーディングに組み込み",
          "ストリーク表示で習慣化を促進",
        ],
        outputs: "学習コース機能一式（30画面）、進捗ダッシュボード、通知設計",
        figmaUrl: null,
        results: "3ヶ月継続率が15%→42%に改善。有料プラン転換率18%向上。",
        metrics: [
          "3ヶ月継続率: 15% → 42%",
          "有料転換率: +18%",
          "DAU: +35%",
        ],
        quote: null,
        domainTags: ["toC", "教育"],
        phaseTags: ["0→1"],
        skillTags: ["UXリサーチ", "情報設計", "UIデザイン", "プロトタイピング"],
        confidence: "高",
        reviewStatus: "確認済",
        notes: null,
        rawJson: null,
        createdAt: "2026-04-10T00:00:00Z",
        updatedAt: "2026-04-10T00:00:00Z",
      },
    ],
    workHistory: [
      {
        id: "w6",
        designerId: "d3",
        company: "株式会社メドレー",
        role: "プロダクトデザイナー",
        periodStart: "2023-10-01",
        periodEnd: null,
        isCurrent: true,
        description:
          "オンライン診療サービスCLINICSのUX/UI改善を担当。患者・医師双方の体験設計に従事。",
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
          "社会人向けオンライン学習プラットフォームの新機能設計・UXリサーチを担当。学習継続率の改善に注力。",
        domainTags: ["toC", "教育"],
        employmentType: "正社員",
        confidence: "高",
        reviewStatus: "確認済",
        createdAt: "2026-04-10T00:00:00Z",
        updatedAt: "2026-04-10T00:00:00Z",
      },
    ],
    createdAt: "2026-04-10T00:00:00Z",
    updatedAt: "2026-04-10T00:00:00Z",
  },
  {
    id: "d4",
    name: "田中 美咲",
    slug: null,
    status: "処理中",
    sourceUrl: "https://www.notion.so/tanaka-portfolio",
    sourceType: "Notion",
    importedAt: "2026-04-15T00:00:00Z",
    publishedAt: null,
    profileImageUrl: null,
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
