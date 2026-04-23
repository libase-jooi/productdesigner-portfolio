import { useState, useRef, useEffect } from "react";


/* ═══════════════════════════════════════════════════════════════
   Suggestion chips — 具体的な4パターン
   ═══════════════════════════════════════════════════════════════ */

const INITIAL_SUGGESTIONS = [
  "プロジェクト概要を整理したい",
  "背景・課題の書き方を教えて",
  "成果を定量的に表現したい",
  "担当役割をわかりやすく書きたい",
];

/* ═══════════════════════════════════════════════════════════════
   Mock AI responses — 質問案＋回答選択肢付き
   ═══════════════════════════════════════════════════════════════ */

const INITIAL_MESSAGE = `こんにちは！ポートフォリオの入力をお手伝いします ✏️

アップロードした資料をもとに、各項目の書き方をサポートします。

下のボタンから選ぶか、自由に質問してください。`;

interface MockResponse {
  text: string;
  followUps: string[];
}

const MOCK_RESPONSES: { keyword: string; response: MockResponse }[] = [
  {
    keyword: "概要",
    response: {
      text: `**プロジェクト概要**の書き方のポイント：

以下の3点を含めると伝わりやすくなります：
1. **何を作ったか** — プロダクトやサービスの概要
2. **誰のために** — ターゲットユーザー
3. **なぜ** — ビジネス上の目的や課題

あなたの資料から読み取った内容をもとに整理できます。どの方向で進めますか？`,
      followUps: [
        "toB向けSaaSの概要を整理したい",
        "アプリリニューアル案件の概要を書きたい",
        "ターゲットユーザーの記述を深めたい",
        "概要の文字数はどのくらいがいい？",
      ],
    },
  },
  {
    keyword: "背景",
    response: {
      text: `**背景・課題**を書くコツ：

読み手が「なぜこのプロジェクトが必要だったのか」を理解できるように：
- **ビジネス背景**: 市場や競合の状況
- **ユーザー課題**: 具体的なペインポイント
- **既存の問題**: 現状のどこに課題があったか

あなたの資料にいくつか手がかりがあります。どの切り口で深掘りしますか？`,
      followUps: [
        "ビジネス背景から書き始めたい",
        "ユーザーインタビュー結果を整理したい",
        "競合との差別化ポイントを明確にしたい",
        "課題を箇条書きで簡潔にまとめたい",
      ],
    },
  },
  {
    keyword: "成果",
    response: {
      text: `**成果・インパクト**を効果的に書くには：

定量＋定性の組み合わせが理想です：
- **定量**: 「CVR 15%改善」「問い合わせ数 30%削減」
- **定性**: 「社内の意思決定フローが明確化された」

数字がない場合でも表現方法はあります。どのパターンが近いですか？`,
      followUps: [
        "KPI改善の数値がある",
        "数値はないが定性的な成果がある",
        "ビフォー/アフターで比較したい",
        "ステークホルダーの声を引用したい",
      ],
    },
  },
  {
    keyword: "役割",
    response: {
      text: `**担当役割**の書き方：

単なる肩書きではなく、実際にやったことが伝わる表現にしましょう：

例：
- ×「UIデザイナー」
- ○「UIデザイナーとして、デザインシステムの構築とプロトタイプ作成を主導」

どんな役割でしたか？`,
      followUps: [
        "リードデザイナーとして全体を主導した",
        "チームの一員として特定領域を担当した",
        "複数の役割を兼任していた",
        "役割が途中で変わった",
      ],
    },
  },
];

const DEFAULT_RESPONSE: MockResponse = {
  text: `なるほど、ありがとうございます！

あなたの資料を参考にしながら一緒に考えましょう。

もう少し教えてください：`,
  followUps: [
    "プロジェクトの概要を整理したい",
    "具体的な成果を書きたい",
    "担当した役割を明確にしたい",
    "アプローチの説明を追加したい",
  ],
};

function getAIResponse(input: string): MockResponse {
  const lower = input.toLowerCase();
  for (const { keyword, response } of MOCK_RESPONSES) {
    if (lower.includes(keyword)) return response;
  }
  return DEFAULT_RESPONSE;
}

/* ═══════════════════════════════════════════════════════════════
   Chat Panel Component
   ═══════════════════════════════════════════════════════════════ */

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  suggestions?: string[];
}

export function SkillChatPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: INITIAL_MESSAGE, suggestions: INITIAL_SUGGESTIONS },
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
            <p className="type-body-sm text-on-surface-variant text-xs">ポートフォリオの入力補助</p>
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
          <span className="text-xs">あなたの資料(.md)を参照中</span>
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
