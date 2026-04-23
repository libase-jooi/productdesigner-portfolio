import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getMockDesigner } from "@/api/mock";
import type { SkillScores } from "@/api/schema";

/* ═══════════════════════════════════════════════════════════════
   Sub-skill definitions with level descriptions
   ═══════════════════════════════════════════════════════════════ */

interface SubSkillDef {
  key: string;
  name: string;
  question: string;
  levels: [string, string, string, string, string];
}

interface AxisDef {
  key: keyof SkillScores;
  label: string;
  subSkills: SubSkillDef[];
}

const SKILL_AXES: AxisDef[] = [
  {
    key: "strategyDesign",
    label: "ビジネス推進力",
    subSkills: [
      {
        key: "strategyPlanning",
        name: "戦略設計",
        question: "事業の方向性を、プロダクトの設計判断にどのくらい反映できていますか？",
        levels: [
          "戦略設計に関わっていない",
          "事業戦略を理解し、自分の担当範囲に照らして考えられる",
          "事業戦略をプロダクト方針に翻訳できる",
          "事業インパクトから逆算し、戦略と施策の一貫性を担保できる",
          "事業戦略の立案に関与し、チーム全体に浸透させられる",
        ],
      },
      {
        key: "decisionDesign",
        name: "意思決定設計",
        question: "業務上の意思決定を、どのくらい根拠を持って下せていますか？",
        levels: [
          "指示や既存ルールに従って判断できる",
          "判断の理由を自分の言葉で説明できる",
          "情報不十分でも暫定判断でき、根拠と前提を明示できる",
          "リスクとリターンを踏まえて構造的に判断できる",
          "判断の仕組み自体を設計し、チームに適用できる",
        ],
      },
      {
        key: "stakeholderMgmt",
        name: "合意形成",
        question: "どのように関係者を巻き込んで、合意形成しながら前に進められていますか？",
        levels: [
          "指示された内容を共有できる",
          "必要な相手に状況を説明できる",
          "関係者の状況を把握し、判断材料を構造化して提示できる",
          "対立する要件を整理し、落としどころを見つけられる",
          "複雑な利害関係を整理し、意思決定の場を設計できる",
        ],
      },
      {
        key: "hypothesisTesting",
        name: "仮説検証",
        question: "仮説を立てて検証し、学びをどのくらい次のアクションに活かせていますか？",
        levels: [
          "指示された検証を実行できる",
          "シンプルな仮説を立てて試せる",
          "検証から学びを得て次に進められる",
          "検証を回し続けて改善を進められる",
          "検証サイクルの仕組みを設計し、チームの学習速度を高められる",
        ],
      },
      {
        key: "kpiMgmt",
        name: "KPIマネジメント",
        question: "KPIの設計から計測・改善まで、どのくらい自分で担えていますか？",
        levels: [
          "KPI設計に関わっていない",
          "設定されたKPIをもとに自分の範囲で動ける",
          "KPIと施策を接続して考え、実行可能な形に分解できる",
          "実行結果を定量的に計測し、改善を回せる",
          "KPI設計から改善サイクルまで一貫して設計できる",
        ],
      },
    ],
  },
  {
    key: "research",
    label: "課題設定力",
    subSkills: [
      {
        key: "domainUnderstanding",
        name: "ドメイン理解",
        question: "自身が参画している事業や市場をどのくらい理解できていますか？",
        levels: [
          "与えられた情報を理解できる",
          "事業や競合を整理できる",
          "プロダクトの立ち位置を説明できる",
          "機会とリスクを見極められる",
          "事業の方向性に提案できる",
        ],
      },
      {
        key: "userUnderstanding",
        name: "ユーザー理解",
        question: "ユーザーの実態をどのような手段で把握していますか？",
        levels: [
          "共有されたユーザー情報を受け取って理解できる",
          "インタビューやデータ分析でユーザーの行動を捉えられる",
          "定性・定量を組み合わせ、ユーザーの文脈まで理解できる",
          "複数の手法を使い分けて設計判断に活かせる",
          "ユーザー理解の計画を設計し、チーム全体に還元できる",
        ],
      },
      {
        key: "insightExtraction",
        name: "インサイト抽出",
        question: "観察やデータから課題につながる仮説をどのくらい立てられていますか？",
        levels: [
          "事実を整理できる",
          "仮説を言葉にできる",
          "行動の裏にある動機を解釈し、背景を掘り下げられる",
          "複数の情報源から構造として課題を理解できる",
          "課題の構造を描いてチームの判断に活かせる",
        ],
      },
      {
        key: "problemStructuring",
        name: "課題構造化",
        question: "解くべき課題をどのように定義できていますか？",
        levels: [
          "課題定義に関わっていない",
          "与えられた課題に対応できる",
          "仮説をもとに課題を定義できる",
          "課題の関係を踏まえて定義できる",
          "本質課題を特定し、チームが共有できる形で構造化できる",
        ],
      },
      {
        key: "priorityDesign",
        name: "優先度設計",
        question: "取り組む課題の優先順位をどのように決めていますか？",
        levels: [
          "決められた優先度に沿って進められる",
          "複数の選択肢から優先度を判断し、理由を説明できる",
          "ユーザー価値と事業価値の両方を踏まえて判断できる",
          "実現性・リソースも含めた多角的な観点で判断できる",
          "優先度の前提を問い直し、事業の意思決定に影響を与えられる",
        ],
      },
    ],
  },
  {
    key: "uxDesign",
    label: "UX設計力",
    subSkills: [
      {
        key: "experienceConcept",
        name: "体験コンセプト設計",
        question: "ユーザーにどんな体験を届けるかを、どれくらい自分で構想・言語化できていますか？",
        levels: [
          "体験コンセプトの設計に関わっていない",
          "提示されたコンセプト案にフィードバックや修正ができる",
          "利用シナリオを設計し、体験の方向性を定義できる",
          "理想的な体験を描き、事業・ユーザー両面で一貫性を担保できる",
          "複数タッチポイントの体験の一貫性を設計できる",
        ],
      },
      {
        key: "informationDesign",
        name: "情報設計",
        question: "情報や機能の構造設計にどのように関わっていますか？",
        levels: [
          "情報設計を主導した経験がない",
          "基本的な構造や分類を設計できる",
          "ユーザーに合わせて構造を設計できる",
          "複雑な構造を整理して設計できる",
          "構造設計の考え方を横断的に適用できる",
        ],
      },
      {
        key: "flowDesign",
        name: "導線設計",
        question: "ユーザーが目的を達成するまでの操作の流れを、どのくらい設計できていますか？",
        levels: [
          "導線設計を主導した経験がない",
          "単一のフローを設計できる",
          "複数の導線を整合して設計できる",
          "状態や分岐を踏まえて設計できる",
          "プロダクト全体の導線構造を設計できる",
        ],
      },
      {
        key: "interactionDesign",
        name: "インタラクション設計",
        question: "ユーザーが迷わず目的を達成できるよう、操作の流れやフィードバックをどのくらい設計できていますか？",
        levels: [
          "基本的なUIパターンを参照して画面を作れる",
          "認知負荷を意識し、シンプルなインタラクションを設計できる",
          "フィードバックや状態変化を適切に設計できる",
          "複雑な操作でも直感的に使えるフローを設計できる",
          "インタラクション設計の原則をプロダクト全体に適用できる",
        ],
      },
      {
        key: "usabilityImprovement",
        name: "ユーザビリティ改善",
        question: "どれくらい実際の操作上の問題を発見し、改善につなげられていますか？",
        levels: [
          "ユーザビリティ評価や改善提案に関わっていない",
          "指摘された問題に対して改善案を出せる",
          "自分でユーザビリティ上の問題を発見し、改善提案できる",
          "問題の根本原因を特定し、再発を防げる",
          "ユーザビリティ評価の仕組みをプロセスに組み込める",
        ],
      },
      {
        key: "stateDesign",
        name: "状態・例外設計",
        question: "状態や例外をどのように設計していますか？",
        levels: [
          "状態設計を主導した経験がない",
          "基本的な状態（空・エラー）を設計できる",
          "主要な状態を整理して設計できる",
          "分岐や例外を含めて設計できる",
          "状態設計のルールを定義できる",
        ],
      },
      {
        key: "accessibilityDesign",
        name: "アクセシビリティ",
        question: "多様なユーザーや利用環境を考慮した設計に、どのように取り組んでいますか？",
        levels: [
          "アクセシビリティ設計に関わっていない",
          "基本的な配慮（色・サイズ）を反映できる",
          "多様な利用環境を考慮して設計できる",
          "課題を見つけて改善できる",
          "基準として設計に組み込める",
        ],
      },
    ],
  },
  {
    key: "uiImplementation",
    label: "画面設計・実装運用力",
    subSkills: [
      {
        key: "designSystem",
        name: "デザインシステム",
        question: "デザインシステムにどのように関わっていますか？",
        levels: [
          "デザインシステムの設計や運用に関わっていない",
          "既存のコンポーネントを使って画面を作れる",
          "コンポーネントの作成や整理を自分で行える",
          "運用ルールを定め、チームに浸透させられる",
          "プロダクトの成長に合わせてデザインシステムを進化させられる",
        ],
      },
      {
        key: "structuralDesign",
        name: "構造設計",
        question: "画面の構造や配置をどのように設計していますか？",
        levels: [
          "構造設計を主導した経験がない",
          "基本的な画面構造や遷移を設計できる",
          "情報の優先度を踏まえて構造を設計できる",
          "複数の条件を踏まえて設計できる",
          "構造設計の考え方を横断的に適用できる",
        ],
      },
      {
        key: "visualDesign",
        name: "表層設計",
        question: "画面の見た目や細かい表現をどのように作り込めますか？",
        levels: [
          "ビジュアル設計を主導した経験がない",
          "ガイドラインに沿って画面を作れる",
          "細かい表現まで自分で作り込める",
          "プロダクト全体で一貫した見た目にできる",
          "ビジュアルの方向性とルールを定義し適用できる",
        ],
      },
      {
        key: "devCollaboration",
        name: "実装連携",
        question: "エンジニアとの実装連携をどのように行いますか？",
        levels: [
          "実装連携を主導した経験がない",
          "デザインを共有し、必要な情報を渡せる",
          "制約を踏まえて調整しながら連携できる",
          "実装結果を見て改善提案ができる",
          "デザインと実装の進め方を設計できる",
        ],
      },
      {
        key: "prototyping",
        name: "プロトタイピング",
        question: "どこまで自分で手を動かして検証できますか？",
        levels: [
          "プロトタイピングや実装にほとんど関わっていない",
          "基本的なプロトタイプを作れる",
          "動きのあるプロトタイプや簡単な実装ができる",
          "実装に近い形で検証できる",
          "実装を踏まえて設計をリードできる",
        ],
      },
      {
        key: "operationDesign",
        name: "運用設計",
        question: "リリース後の改善をどのように進めていますか？",
        levels: [
          "改善プロセスの設計や運用に関わっていない",
          "改善タスクを整理・管理できる",
          "改善サイクルを自分で回せる",
          "チームで改善を回せる状態を作れる",
          "継続的に改善が回る仕組みを設計できる",
        ],
      },
    ],
  },
  {
    key: "aiUtilization",
    label: "AI活用力",
    subSkills: [
      {
        key: "aiInfoGathering",
        name: "情報収集",
        question: "AI技術の動向をどれくらい追い、業務に活かしていますか？",
        levels: [
          "ほとんど追っていない",
          "主要なツールやトレンドを把握している",
          "継続的に情報を追い、自分の業務に取り入れている",
          "活用の可能性を評価し、業務フローに取り入れている",
          "チームやプロダクトに影響する形で活用を広げている",
        ],
      },
      {
        key: "aiToolSelection",
        name: "ツール選定",
        question: "目的に応じてAIツールをどのように使い分けていますか？",
        levels: [
          "ツールをうまく使えない",
          "指定されたツールを使って作業できる",
          "目的に応じて複数ツールを使い分けられる",
          "業務フローに組み込んで活用できる",
          "最適なツール構成を設計し、活用を広げられる",
        ],
      },
      {
        key: "promptDesign",
        name: "プロンプト設計",
        question: "AIの出力品質をどのように高め・管理していますか？",
        levels: [
          "出力が安定せず、使いこなせていない",
          "基本的な指示で意図した出力を得られる",
          "目的に応じてプロンプトを調整できる",
          "安定した品質で出力をコントロールできる",
          "再現性のあるプロンプト設計ができる",
        ],
      },
      {
        key: "aiProcessIntegration",
        name: "業務プロセス統合",
        question: "AI活用をどの程度業務プロセスに組み込めていますか？",
        levels: [
          "ほとんど業務に組み込めていない",
          "一部の作業で補助的に使っている",
          "複数の工程で活用している",
          "業務フローに組み込んでいる",
          "チーム全体の生産性を変えるレベルで活用している",
        ],
      },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════
   SkillCheckPage Component
   ═══════════════════════════════════════════════════════════════ */

export function SkillCheckPage() {
  const { designerId } = useParams<{ designerId: string }>();
  const navigate = useNavigate();
  const data = getMockDesigner(designerId ?? "");

  // Initialize sub-skill scores from existing data or default to 0 (unselected)
  const [scores, setScores] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    for (const axis of SKILL_AXES) {
      for (const sub of axis.subSkills) {
        initial[sub.key] = data?.subSkillScores?.[sub.key] ?? 0;
      }
    }
    return initial;
  });

  const setScore = (key: string, level: number) => {
    setScores((prev) => ({ ...prev, [key]: level }));
  };

  const allAnswered = Object.values(scores).every((v) => v > 0);

  const handleSave = () => {
    // Compute axis averages
    const axisScores: Record<string, number> = {};
    for (const axis of SKILL_AXES) {
      const subValues = axis.subSkills.map((s) => scores[s.key]);
      const avg = subValues.reduce((a, b) => a + b, 0) / subValues.length;
      axisScores[axis.key] = Math.round(avg * 10) / 10;
    }

    // For now, log the result and navigate back
    console.log("skillScores:", axisScores);
    console.log("subSkillScores:", scores);

    navigate(`/designers/${designerId}`);
  };

  if (!data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <p className="type-body-md text-on-surface-variant">
          デザイナーが見つかりませんでした。
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="type-headline-lg sm:type-display-sm text-on-surface">
          スキル診断
        </h1>
        <p className="type-body-md text-on-surface-variant">
          各スキルについて、自分に最も近いレベルを選択してください。
        </p>
      </div>

      {SKILL_AXES.map((axis, axisIndex) => (
        <section key={axis.key} className="space-y-8">
          <div className="space-y-8">
            {axis.subSkills.map((sub, subIndex) => (
              <div key={sub.key} className="space-y-3">
                {subIndex === 0 && (
                  <h2 className="type-headline-md text-on-surface border-b border-outline-variant pb-2 mb-2">
                    {axisIndex + 1}. {axis.label}
                  </h2>
                )}
                <div>
                  <h3 className="type-label-lg text-on-surface">
                    {axisIndex + 1}-{subIndex + 1}. {sub.name}
                  </h3>
                  <p className="type-body-sm text-on-surface-variant mt-0.5">{sub.question}</p>
                </div>
                <div className="grid gap-2">
                  {sub.levels.map((desc, i) => {
                    const level = i + 1;
                    const selected = scores[sub.key] === level;
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setScore(sub.key, level)}
                        className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                          selected
                            ? "border-primary bg-primary/8 ring-1 ring-primary"
                            : "border-outline-variant bg-surface hover:bg-surface-container-low"
                        }`}
                      >
                        <span
                          className={`shrink-0 type-label-md mt-0.5 rounded-md px-2 py-0.5 ${
                            selected
                              ? "bg-primary text-on-primary"
                              : "bg-surface-container-high text-on-surface-variant"
                          }`}
                        >
                          Lv.{level}
                        </span>
                        <span
                          className={`type-body-sm ${
                            selected
                              ? "text-primary font-medium"
                              : "text-on-surface-variant"
                          }`}
                        >
                          {desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="sticky bottom-0 bg-surface/80 backdrop-blur-sm border-t border-outline-variant py-4 -mx-4 px-4">
        <Button
          onClick={handleSave}
          disabled={!allAnswered}
          className="w-full rounded-full bg-primary text-on-primary hover:bg-primary/90 disabled:opacity-50 type-label-lg py-3"
        >
          保存する
        </Button>
        {!allAnswered && (
          <p className="type-body-sm text-on-surface-variant text-center mt-2">
            すべてのスキルを選択すると保存できます
          </p>
        )}
      </div>
    </div>
  );
}
