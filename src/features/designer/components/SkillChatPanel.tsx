import { useState, useRef, useEffect } from "react";
import type { DesignerWithRelations } from "@/api/schema";

/* ═══════════════════════════════════════════════════════════════
   パーソナライズされたモック応答を生成
   ═══════════════════════════════════════════════════════════════ */

function buildInitialMessage(d: DesignerWithRelations): string {
  const currentJob = d.workHistory.find((w) => w.isCurrent);
  const jobLabel = currentJob
    ? `${currentJob.company}で${currentJob.role ?? "デザイナー"}をされている`
    : "";
  const projCount = d.projects.length;

  return `${d.name}さん、こんにちは！

${jobLabel ? `${jobLabel}んですね。` : ""}${
    projCount > 0
      ? `現在${projCount}件のプロジェクトが登録されています。`
      : "まだプロジェクトが登録されていないようです。"
  }

あなたの資料と登録済みの情報をもとに、ポートフォリオの内容を一緒にブラッシュアップしましょう。`;
}

function buildInitialSuggestions(d: DesignerWithRelations): string[] {
  const suggestions: string[] = [];
  const firstProject = d.projects[0];

  if (firstProject) {
    suggestions.push(`「${firstProject.title}」の概要をもっと具体的にしたい`);
  } else {
    suggestions.push("最初のプロジェクトを追加したい");
  }

  const hasEmptyBackground = d.projects.some((p) => !p.background);
  if (hasEmptyBackground) {
    suggestions.push("背景・課題が空のプロジェクトを埋めたい");
  } else {
    suggestions.push("背景・課題の表現をブラッシュアップしたい");
  }

  const hasMetrics = d.projects.some((p) => p.metrics.length > 0);
  if (!hasMetrics) {
    suggestions.push("成果を数値で表現する方法を教えて");
  } else {
    suggestions.push("成果の表現をもっとインパクトのあるものにしたい");
  }

  if (!d.bio) {
    suggestions.push("自己紹介文を作ってほしい");
  } else {
    suggestions.push("自己紹介文をブラッシュアップしたい");
  }

  return suggestions;
}

interface MockResponse {
  text: string;
  followUps: string[];
}

function buildResponses(d: DesignerWithRelations): {
  responses: { keyword: string; response: MockResponse }[];
  fallback: MockResponse;
} {
  const currentJob = d.workHistory.find((w) => w.isCurrent);
  const allDomains = Array.from(new Set(d.projects.flatMap((p) => p.domainTags)));
  const allSkills = Array.from(new Set(d.projects.flatMap((p) => p.skillTags)));
  const firstProject = d.projects[0];
  const secondProject = d.projects[1];

  const responses: { keyword: string; response: MockResponse }[] = [
    {
      keyword: "概要",
      response: {
        text: firstProject
          ? `「${firstProject.title}」の概要を見てみましょう。\n\n${firstProject.overview ? `現在の記述：\n> ${firstProject.overview}` : "まだ概要が書かれていません。"}\n\n${allDomains.length > 0 ? `${d.name}さんは${allDomains.slice(0, 3).join("・")}の領域で活動されていますね。` : ""}${currentJob ? `${currentJob.company}での経験` : "これまでの経験"}を踏まえると、「誰の・どんな課題を・どう解決したか」を1〜2文で書くのが効果的です。\n\nどう進めますか？`
          : `まだプロジェクトが登録されていません。まずは1つ目のプロジェクトを追加しましょう。`,
        followUps: [
          firstProject ? `「${firstProject.title}」の概要を一緒に書いてみよう` : "新しいプロジェクトの概要を書きたい",
          secondProject ? `「${secondProject.title}」の概要も見てほしい` : "概要の長さはどのくらいがいい？",
          "ターゲットユーザーをもっと具体的にしたい",
          "ビジネスインパクトを冒頭に入れたい",
        ],
      },
    },
    {
      keyword: "背景",
      response: {
        text: `${d.name}さんのプロジェクトの背景・課題を整理しましょう。\n\n${d.projects.slice(0, 3).map((p) => `• ${p.title}: ${p.background ? "記述あり ✓" : "⚠️ まだ書かれていません"}`).join("\n")}\n\n${allDomains.length > 0 ? `${allDomains.join("・")}の領域では、業界特有の課題感を入れると説得力が増します。\n\n` : ""}読み手（採用担当やクライアント）が「なぜこのプロジェクトが必要だったのか」を理解できるよう、ビジネス背景 → ユーザー課題 → 解くべき問題の順で書くのがおすすめです。`,
        followUps: d.projects.slice(0, 3).map((p) =>
          p.background
            ? `「${p.title}」の背景をブラッシュアップ`
            : `「${p.title}」の背景を一緒に書く`
        ).concat(["業界特有の課題感の書き方を教えて"]).slice(0, 4),
      },
    },
    {
      keyword: "成果",
      response: {
        text: (() => {
          const withMetrics = d.projects.filter((p) => p.metrics.length > 0);
          const withoutMetrics = d.projects.filter((p) => p.metrics.length === 0);

          let text = `${d.name}さんのプロジェクトの成果表現を見てみます。\n\n`;

          if (withMetrics.length > 0) {
            text += `数値成果があるプロジェクト：\n`;
            withMetrics.forEach((p) => {
              text += `• **${p.title}**: ${p.metrics.slice(0, 2).join("、")}\n`;
            });
            text += `\nこれは良い素材です！さらに**比較対象**（前年比、業界平均比）を加えるとインパクトが増します。\n`;
          }

          if (withoutMetrics.length > 0) {
            text += `\n数値がまだないプロジェクト：\n`;
            withoutMetrics.forEach((p) => {
              text += `• **${p.title}**\n`;
            });
            text += `\n数値が思い出せなくても、**ビフォー/アフター**や**ステークホルダーの声**で表現できます。`;
          }

          return text;
        })(),
        followUps: [
          "KPI改善の数値を整理して書きたい",
          "数値がないプロジェクトの成果表現を考えたい",
          "ステークホルダーからのフィードバックを引用したい",
          "ビフォー/アフター形式で書きたい",
        ],
      },
    },
    {
      keyword: "役割",
      response: {
        text: `${d.name}さんのプロジェクトでの役割を確認しますね。\n\n${d.projects.slice(0, 4).map((p) => `• ${p.title}: ${p.role ?? "役割未記入 ⚠️"}${p.team ? `（${p.team}）` : ""}`).join("\n")}\n\n${allSkills.length > 0 ? `${allSkills.slice(0, 4).join("・")}などのスキルをお持ちなので、` : ""}単なる肩書きではなく「具体的に何を主導・担当したか」を書くと、スキルの深さが伝わります。\n\n例：「${allSkills[0] ?? "UI設計"}を担当」→「${allSkills[0] ?? "UI設計"}として、〇〇の設計・実装を主導し、チーム内のレビュー体制も構築」`,
        followUps: d.projects.slice(0, 3).map((p) =>
          `「${p.title}」の役割を具体化したい`
        ).concat(["複数の役割を兼任していた場合の書き方"]).slice(0, 4),
      },
    },
    {
      keyword: "自己紹介",
      response: {
        text: `${d.name}さんの自己紹介文を${d.bio ? "ブラッシュアップ" : "作成"}しましょう。\n\n${d.bio ? `現在の自己紹介：\n> ${d.bio}` : "まだ自己紹介が書かれていません。"}\n\n${currentJob ? `${currentJob.company}での${currentJob.role ?? ""}の経験` : ""}${allDomains.length > 0 ? `、${allDomains.slice(0, 3).join("・")}の領域での実績` : ""}を踏まえて、3〜5行で「何ができる人か」が伝わる文章にしましょう。\n\nポイント：\n• 1行目で専門性のサマリー\n• 中盤で得意な領域・アプローチ\n• 最後に今後の方向性や価値提供`,
        followUps: [
          "専門性を前面に出した自己紹介にしたい",
          "柔らかいトーンで書きたい",
          "経歴をベースに自動生成してほしい",
          "英語版も作りたい",
        ],
      },
    },
  ];

  const fallback: MockResponse = {
    text: `${d.name}さん、ありがとうございます！\n\n${d.projects.length > 0 ? `現在${d.projects.length}件のプロジェクト` : ""}${d.workHistory.length > 0 ? `と${d.workHistory.length}件の経歴` : ""}が登録されていますね。${allDomains.length > 0 ? `\n${allDomains.join("・")}領域でのご経験を活かして、` : ""}ポートフォリオの内容を充実させましょう。\n\nどのあたりを改善しますか？`,
    followUps: [
      d.projects[0] ? `「${d.projects[0].title}」を深掘りしたい` : "プロジェクトを追加したい",
      "全体的な見え方を改善したい",
      d.bio ? "自己紹介文をブラッシュアップしたい" : "自己紹介文を作りたい",
      "スキルの見せ方を相談したい",
    ],
  };

  return { responses, fallback };
}

/* ═══════════════════════════════════════════════════════════════
   Chat Panel Component
   ═══════════════════════════════════════════════════════════════ */

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  suggestions?: string[];
}

interface SkillChatPanelProps {
  onClose: () => void;
  designer?: DesignerWithRelations | null;
}

export function SkillChatPanel({ onClose, designer }: SkillChatPanelProps) {
  const d = designer;
  const initialMessage = d ? buildInitialMessage(d) : "こんにちは！ポートフォリオの入力をお手伝いします。下のボタンから選ぶか、自由に質問してください。";
  const initialSuggestions = d ? buildInitialSuggestions(d) : [
    "プロジェクト概要を整理したい",
    "背景・課題の書き方を教えて",
    "成果を定量的に表現したい",
    "担当役割をわかりやすく書きたい",
  ];

  const { responses: mockResponses, fallback } = d
    ? buildResponses(d)
    : { responses: [], fallback: { text: "もう少し具体的に教えてください。", followUps: [] } };

  const getAIResponse = (input: string): MockResponse => {
    const lower = input.toLowerCase();
    for (const { keyword, response } of mockResponses) {
      if (lower.includes(keyword)) return response;
    }
    return fallback;
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: initialMessage, suggestions: initialSuggestions },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim() || isTyping) return;

    setMessages((prev) => [...prev, { role: "user", content: text.trim() }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getAIResponse(text);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.text, suggestions: response.followUps },
      ]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  const handleSend = () => sendMessage(input);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (text: string) => {
    sendMessage(text);
  };

  return (
    <div className="fixed right-0 top-0 h-full w-[380px] max-w-[90vw] z-50 flex flex-col bg-surface border-l border-outline-variant shadow-2xl">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-outline-variant bg-surface-container-low">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8V4H8" />
              <rect width="16" height="12" x="4" y="8" rx="2" />
              <path d="M2 14h2" />
              <path d="M20 14h2" />
              <path d="M15 13v2" />
              <path d="M9 13v2" />
            </svg>
          </div>
          <div>
            <h3 className="type-label-md text-on-surface">入力アシスタント</h3>
            {d && (
              <p className="type-body-sm text-on-surface-variant text-xs">{d.name}さんのポートフォリオ</p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="h-8 w-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
          title="閉じる"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      {/* Context badge */}
      <div className="shrink-0 px-4 py-2 border-b border-outline-variant/50 bg-primary/5">
        <p className="type-body-sm text-on-surface-variant flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span className="text-xs">
            {d
              ? `${d.projects.length}件のプロジェクト・${d.workHistory.length}件の経歴を参照中`
              : "あなたの資料(.md)を参照中"}
          </span>
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i}>
            <div
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 type-body-sm whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-primary text-white rounded-br-md"
                    : "bg-surface-container text-on-surface rounded-bl-md"
                }`}
              >
                {msg.content}
              </div>
            </div>
            {/* Suggestion chips */}
            {msg.role === "assistant" && msg.suggestions && msg.suggestions.length > 0 && !isTyping && i === messages.length - 1 && (
              <div className="flex flex-wrap gap-1.5 mt-2 ml-1">
                {msg.suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleSuggestionClick(s)}
                    className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 type-label-sm text-primary hover:bg-primary/10 transition-colors text-left"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-surface-container rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-on-surface-variant/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 rounded-full bg-on-surface-variant/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 rounded-full bg-on-surface-variant/40 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-outline-variant p-3 bg-surface">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="入力について質問..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-outline-variant bg-surface-container-low px-3 py-2.5 type-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary"
            style={{ maxHeight: "120px" }}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="shrink-0 h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center disabled:opacity-40 transition-opacity hover:bg-primary/90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m5 12 7-7 7 7" />
              <path d="M12 19V5" />
            </svg>
          </button>
        </div>
        <p className="type-body-sm text-on-surface-variant/50 text-xs text-center mt-1.5">
          Proto — モックレスポンス
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Toggle Button (FAB)
   ═══════════════════════════════════════════════════════════════ */

export function SkillChatToggle({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed right-6 bottom-24 z-40 h-12 w-12 rounded-full bg-primary text-white elevation-4 flex items-center justify-center hover:bg-primary/90 transition-colors"
      title="入力アシスタント"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8V4H8" />
        <rect width="16" height="12" x="4" y="8" rx="2" />
        <path d="M2 14h2" />
        <path d="M20 14h2" />
        <path d="M15 13v2" />
        <path d="M9 13v2" />
      </svg>
    </button>
  );
}
