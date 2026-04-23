import { useState, useRef, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════
   Skill-check context (from skill-check.md)
   ═══════════════════════════════════════════════════════════════ */

const SKILL_CONTEXT = `あなたはデザイナーのスキル診断をサポートするアシスタントです。
以下の5軸×各サブスキルについて、ユーザーが自分のレベルを正しく自己評価できるよう壁打ち相手になってください。

## 5つの軸
1. ビジネス推進力（戦略設計、意思決定設計、合意形成、仮説検証、KPIマネジメント）
2. 課題設定力（ドメイン理解、ユーザー理解、インサイト抽出、課題構造化、優先度設計）
3. UX設計力（体験コンセプト設計、情報設計、導線設計、インタラクション設計、ユーザビリティ改善、状態・例外設計、アクセシビリティ）
4. 画面設計・実装運用力（デザインシステム、構造設計、表層設計、実装連携、プロトタイピング、運用設計）
5. AI活用力（情報収集、ツール選定、プロンプト設計、業務プロセス統合）

各スキルはLv1〜Lv5の5段階で評価します。
ユーザーの具体的な経験や業務内容を聞き出し、適切なレベルを一緒に考えてください。`;

/* ═══════════════════════════════════════════════════════════════
   Mock AI responses
   ═══════════════════════════════════════════════════════════════ */

const INITIAL_MESSAGE = `こんにちは！スキル診断のお手伝いをします 🎯

各スキルについて「自分はどのレベルだろう？」と迷ったら、気軽に聞いてください。

例えば：
• 「戦略設計って何を基準に判断すればいい？」
• 「ユーザー理解はLv3とLv4の違いがわからない」
• 「私は○○な経験があるけど、何レベル？」

どのスキルから考えましょうか？`;

const MOCK_RESPONSES: Record<string, string> = {
  戦略: `**戦略設計**について考えてみましょう。

判断のポイントは「事業戦略とデザイン判断の接続度」です：

- **Lv2**: 事業戦略を理解して、自分の担当範囲で考えられる
- **Lv3**: 事業戦略→プロダクト方針への翻訳ができる
- **Lv4**: 事業インパクトから逆算して一貫性を担保できる

具体的には、直近のプロジェクトで事業目標をどう設計に反映しましたか？`,

  意思決定: `**意思決定設計**のポイントは「判断の構造化レベル」です：

- **Lv2**: 判断理由を説明できる
- **Lv3**: 情報不十分でも暫定判断＋根拠明示できる
- **Lv4**: リスク/リターンを踏まえて構造的に判断

最近、不確実な状況で判断を迫られた場面はありますか？`,

  ユーザー: `**ユーザー理解**のレベル判定ポイント：

- **Lv2**: インタビューやデータ分析でユーザー行動を捉えられる
- **Lv3**: 定性＋定量を組み合わせて文脈まで理解できる
- **Lv4**: 複数手法を使い分けて設計判断に活かせる

普段どんな手法でユーザーを理解していますか？`,

  ai: `**AI活用力**について：

この軸は比較的新しいので、素直に現状を評価するのがポイントです：

- **Lv2**: 指定ツールを使える
- **Lv3**: 目的別に複数ツールを使い分け
- **Lv4**: 業務フローに組み込んで活用

普段の業務でAIツールをどう使っていますか？`,
};

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, response] of Object.entries(MOCK_RESPONSES)) {
    if (lower.includes(key)) return response;
  }

  return `なるほど、ありがとうございます！

もう少し具体的に教えてください：
- その業務では、どこまで自分が主導していましたか？
- チームへの影響範囲はどのくらいでしたか？
- 仕組み化やルール整備まで踏み込みましたか？

これらが分かると、より正確なレベル判定ができます。`;
}

/* ═══════════════════════════════════════════════════════════════
   Chat Panel Component
   ═══════════════════════════════════════════════════════════════ */

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function SkillChatPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: INITIAL_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = getAIResponse(text);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
            <h3 className="type-label-md text-on-surface">スキル診断アシスタント</h3>
            <p className="type-body-sm text-on-surface-variant text-xs">壁打ちしながらレベルを考えよう</p>
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
          <span className="text-xs">skill-check.md を参照中</span>
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
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
            placeholder="スキルについて質問..."
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
      title="スキル診断アシスタント"
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
