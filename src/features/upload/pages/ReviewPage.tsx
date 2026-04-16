import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { getMockDesigner } from "@/api/mock";
import type {
  Project,
  WorkHistory,
  Confidence,
} from "@/api/schema";
import { EmploymentType, PhaseTag } from "@/api/schema";

export function ReviewPage() {
  const { designerId } = useParams<{ designerId: string }>();
  const navigate = useNavigate();
  const data = getMockDesigner(designerId ?? "d1");
  const [isPublished, setIsPublished] = useState(data?.publishedAt !== null);

  if (!data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="type-body-md text-on-surface-variant">
          データが見つかりません
        </p>
      </div>
    );
  }

  const allItems = [
    ...data.projects.map((p) => ({ confidence: p.confidence, review: p.reviewStatus })),
    ...data.workHistory.map((w) => ({ confidence: w.confidence, review: w.reviewStatus })),
  ];
  const highCount = allItems.filter((i) => i.confidence === "高").length;
  const total = allItems.length;
  const confidenceRate = total > 0 ? Math.round((highCount / total) * 100) : 0;

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaving(true);
    // TODO: API call to save — simulate for now
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      navigate(`/portfolio/${data.slug}`);
    }, 600);
  };

  const handleTogglePublish = () => {
    setIsPublished((prev) => !prev);
    // TODO: API call to publish/unpublish
  };

  const handleViewPublic = () => {
    navigate(`/portfolio/${data.slug}`);
  };

  return (
    <div className="space-y-8 pb-24">
      {/* ── Success Header ── */}
      <section className="pt-8 sm:pt-12 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-tertiary-fixed">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-on-tertiary-container">
              <path d="m9 12 2 2 4-4" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
          <div>
            <h1 className="type-headline-lg sm:type-display-sm text-on-surface">
              AI分析が完了しました
            </h1>
          </div>
        </div>
        <p className="type-body-md sm:type-body-lg text-on-surface-variant max-w-2xl">
          抽出された情報を確認・編集してください。
          <span className="inline-flex items-center gap-1 ml-1">
            <ConfidenceDot confidence="低" />
            <span className="type-label-sm">低信頼度</span>
          </span>
          の項目は特にご確認ください。
        </p>
      </section>

      {/* ── Summary Cards ── */}
      <div className="grid gap-4 sm:grid-cols-4">
        <SummaryCard
          label="プロジェクト"
          value={String(data.projects.length)}
          sub="件 抽出"
        />
        <SummaryCard
          label="職務経歴"
          value={String(data.workHistory.length)}
          sub="件 抽出"
        />
        <SummaryCard
          label="AI信頼度"
          value={`${confidenceRate}%`}
          sub="高信頼度"
          progress={confidenceRate}
        />
        <SummaryCard
          label="要確認"
          value={String(allItems.filter((i) => i.confidence === "低" || i.confidence === "中").length)}
          sub="件"
          alert={allItems.some((i) => i.confidence === "低")}
        />
      </div>

      {/* ── Projects ── */}
      <section className="space-y-4">
        <h2 className="type-headline-sm text-on-surface">
          プロジェクト ({data.projects.length})
        </h2>
        {data.projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </section>

      {/* ── Work History ── */}
      <section className="space-y-4">
        <h2 className="type-headline-sm text-on-surface">
          職務経歴 ({data.workHistory.length})
        </h2>
        {data.workHistory.map((w) => (
          <WorkHistoryCard key={w.id} item={w} />
        ))}
      </section>

      {/* ── Sticky Bottom Bar ── */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-outline-variant/30 bg-surface/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <ConfidenceSummaryDots projects={data.projects} workHistory={data.workHistory} />
            <span className="type-body-sm text-on-surface-variant hidden sm:inline">
              {total}件中{highCount}件が高信頼度
            </span>
          </div>
          <div className="flex items-center gap-3">
            {isPublished && (
              <Button
                variant="ghost"
                onClick={handleViewPublic}
                className="rounded-xl px-4 type-label-md text-on-surface-variant hover:bg-surface-container"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" x2="21" y1="14" y2="3" />
                </svg>
                公開ページを見る
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleTogglePublish}
              className={`rounded-xl px-5 type-label-md ${
                isPublished
                  ? "border-outline-variant text-on-surface-variant hover:bg-surface-container"
                  : "border-tertiary text-tertiary hover:bg-tertiary-fixed/30"
              }`}
            >
              {isPublished ? "非公開にする" : "公開する"}
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl px-6 type-label-md gradient-primary text-white border-none disabled:opacity-60"
            >
              {saving ? "保存中..." : saved ? "保存しました" : "保存"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Summary Card
   ═══════════════════════════════════════════════════════════════ */

function SummaryCard({
  label,
  value,
  sub,
  progress: progressVal,
  alert,
}: {
  label: string;
  value: string;
  sub: string;
  progress?: number;
  alert?: boolean;
}) {
  return (
    <div className="rounded-2xl bg-surface-container-low p-5 space-y-2">
      <p className="type-label-md text-on-surface-variant">{label}</p>
      <div className="flex items-baseline gap-1">
        <p className={`type-headline-md ${alert ? "text-error" : "text-on-surface"}`}>
          {value}
        </p>
        <span className="type-body-sm text-on-surface-variant">{sub}</span>
      </div>
      {progressVal !== undefined && (
        <Progress
          value={progressVal}
          className="h-1.5 bg-surface-container-high [&>div]:bg-primary"
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Project Card
   ═══════════════════════════════════════════════════════════════ */

function ProjectCard({ project: p }: { project: Project }) {
  const [expanded, setExpanded] = useState(false);

  const fields = buildProjectFields(p);
  const filledCount = fields.filter((f) => f.filled).length;
  const rate = Math.round((filledCount / fields.length) * 100);

  return (
    <div className="rounded-2xl bg-surface-container-low overflow-hidden">
      {/* Thumbnail */}
      {p.thumbnailUrl && (
        <div className="w-full max-h-64 overflow-hidden bg-surface-container-high">
          <img
            src={p.thumbnailUrl}
            alt={p.title}
            className="w-full object-cover"
          />
        </div>
      )}

      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-surface-container transition-colors"
      >
        <div className="flex items-center gap-4 min-w-0">
          <ConfidenceDot confidence={p.confidence} />
          <div className="min-w-0">
            <h3 className="type-title-md text-on-surface truncate">{p.title}</h3>
            <p className="type-body-sm text-on-surface-variant mt-0.5">
              {p.period ?? "期間不明"} — {p.role ?? "役割不明"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <ConfidenceBadge confidence={p.confidence} />
          <div className="flex items-center gap-2 w-24">
            <Progress
              value={rate}
              className="h-1.5 bg-surface-container-high [&>div]:bg-primary"
            />
            <span className="type-label-sm text-on-surface-variant">{rate}%</span>
          </div>
          <ChevronIcon open={expanded} />
        </div>
      </button>

      {/* Expanded form */}
      {expanded && (
        <div className="px-6 pb-8 space-y-6">
          {/* AI notes */}
          {p.notes && (
            <div className="rounded-xl bg-error-container/50 p-4 type-body-sm text-on-error-container">
              <span className="font-medium">AI メモ: </span>
              {p.notes}
            </div>
          )}

          {/* Field completeness */}
          <div className="flex flex-wrap gap-1.5">
            {fields.map((f) => (
              <span
                key={f.name}
                className={`rounded-full px-2.5 py-0.5 type-label-sm ${
                  f.filled
                    ? "bg-tertiary-fixed/50 text-on-tertiary-container"
                    : "bg-error-container/50 text-on-error-container"
                }`}
              >
                {f.filled ? "✓" : "!"} {f.name}
              </span>
            ))}
          </div>

          {/* ── Required Fields ── */}
          <SectionTitle>必須項目</SectionTitle>

          <div className="grid gap-6 sm:grid-cols-2">
            <FormField label="プロジェクト名" required className="sm:col-span-2">
              <Input
                defaultValue={p.title}
                className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface"
              />
            </FormField>

            <FormField label="概要" required className="sm:col-span-2" method="AI生成">
              <Textarea
                defaultValue={p.overview ?? ""}
                placeholder="何を・誰のために・なぜ（2〜3行）"
                className="bg-surface-container-high border-none rounded-lg type-body-md text-on-surface min-h-20"
              />
            </FormField>

            <FormField label="担当役割" required method="AI生成">
              <Input
                defaultValue={p.role ?? ""}
                placeholder="リードUIデザイナー / デザインシステム整備"
                className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface"
              />
            </FormField>

            <FormField label="期間" required>
              <Input
                defaultValue={p.period ?? ""}
                placeholder="2023年4月〜9月"
                className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface"
              />
            </FormField>

            <FormField label="背景・課題" required className="sm:col-span-2" method="AI生成">
              <Textarea
                defaultValue={p.background ?? ""}
                placeholder="プロジェクトの背景と解決すべき課題（2〜5文）"
                className="bg-surface-container-high border-none rounded-lg type-body-md text-on-surface min-h-24"
              />
            </FormField>
          </div>

          {/* ── Tags ── */}
          <SectionTitle>タグ</SectionTitle>

          <div className="grid gap-6 sm:grid-cols-3">
            <FormField label="ドメインタグ" required method="AI推定">
              <TagInput defaultValue={p.domainTags} placeholder="toB, SaaS, フィンテック..." />
            </FormField>
            <FormField label="フェーズタグ" required method="AI推定">
              <TagInput defaultValue={p.phaseTags} placeholder="0→1, グロース, 改善..." suggestions={[...PhaseTag]} />
            </FormField>
            <FormField label="スキルタグ" required method="AI推定">
              <TagInput defaultValue={p.skillTags} placeholder="UXリサーチ, UIデザイン..." />
            </FormField>
          </div>

          {/* ── Optional Fields ── */}
          <SectionTitle>任意項目</SectionTitle>

          <div className="grid gap-6 sm:grid-cols-2">
            <FormField label="チーム構成">
              <Input
                defaultValue={p.team ?? ""}
                placeholder="PdM 1・Des 2・Eng 4"
                className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface"
              />
            </FormField>

            <FormField label="Figma URL">
              <Input
                defaultValue={p.figmaUrl ?? ""}
                placeholder="https://www.figma.com/file/..."
                type="url"
                className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface"
              />
            </FormField>

            <FormField label="課題リスト（箇条書き）" className="sm:col-span-2">
              <ListInput defaultValue={p.issues} placeholder="課題を1行ずつ入力" />
            </FormField>

            <FormField label="アプローチ（箇条書き）" className="sm:col-span-2">
              <ListInput defaultValue={p.approach} placeholder="手順を1行ずつ入力" />
            </FormField>

            <FormField label="主要な判断（箇条書き）">
              <ListInput defaultValue={p.keyDecisions} placeholder="判断を1行ずつ入力" />
            </FormField>

            <FormField label="成果物">
              <Textarea
                defaultValue={p.outputs ?? ""}
                placeholder="成果物の説明"
                className="bg-surface-container-high border-none rounded-lg type-body-md text-on-surface min-h-16"
              />
            </FormField>

            <FormField label="結果・インパクト" className="sm:col-span-2">
              <Textarea
                defaultValue={p.results ?? ""}
                placeholder="定量＋定性の結果"
                className="bg-surface-container-high border-none rounded-lg type-body-md text-on-surface min-h-16"
              />
            </FormField>

            <FormField label="定量成果（箇条書き）">
              <ListInput defaultValue={p.metrics} placeholder="指標: before→after（変化率）" />
            </FormField>

            <FormField label="引用・声">
              <Textarea
                defaultValue={p.quote ?? ""}
                placeholder="ユーザーやクライアントの声"
                className="bg-surface-container-high border-none rounded-lg type-body-md text-on-surface min-h-16"
              />
            </FormField>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Work History Card
   ═══════════════════════════════════════════════════════════════ */

function WorkHistoryCard({ item: w }: { item: WorkHistory }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-2xl bg-surface-container-low overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-surface-container transition-colors"
      >
        <div className="flex items-center gap-4">
          <ConfidenceDot confidence={w.confidence} />
          <div>
            <h3 className="type-title-md text-on-surface">{w.company}</h3>
            <p className="type-body-sm text-on-surface-variant mt-0.5">
              {w.role} — {w.employmentType ?? ""}
              {w.isCurrent && (
                <span className="ml-2 text-tertiary font-medium">現職</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <ConfidenceBadge confidence={w.confidence} />
          <ChevronIcon open={expanded} />
        </div>
      </button>

      {expanded && (
        <div className="px-6 pb-8 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField label="会社名" required>
              <Input
                defaultValue={w.company}
                className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface"
              />
            </FormField>

            <FormField label="役職" required>
              <Input
                defaultValue={w.role ?? ""}
                placeholder="シニアプロダクトデザイナー"
                className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface"
              />
            </FormField>

            <FormField label="在籍開始" required>
              <Input
                defaultValue={w.periodStart ?? ""}
                type="date"
                className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface"
              />
            </FormField>

            <FormField label="在籍終了">
              <div className="space-y-2">
                <Input
                  defaultValue={w.periodEnd ?? ""}
                  type="date"
                  disabled={w.isCurrent}
                  className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface disabled:opacity-50"
                />
                <label className="flex items-center gap-2 type-label-sm text-on-surface-variant cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={w.isCurrent}
                    className="rounded accent-[var(--primary)]"
                  />
                  現職
                </label>
              </div>
            </FormField>

            <FormField label="雇用形態" required>
              <NativeSelect
                defaultValue={w.employmentType ?? ""}
                options={["", ...EmploymentType]}
                placeholder="選択してください"
              />
            </FormField>

            <FormField label="ドメインタグ" method="AI推定">
              <TagInput defaultValue={w.domainTags} placeholder="toB, SaaS..." />
            </FormField>

            <FormField label="業務内容" className="sm:col-span-2">
              <Textarea
                defaultValue={w.description ?? ""}
                placeholder="2〜4文で「何を担当し、どんな成果を出したか」を要約"
                className="bg-surface-container-high border-none rounded-lg type-body-md text-on-surface min-h-20"
              />
            </FormField>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Shared Form Components
   ═══════════════════════════════════════════════════════════════ */

function FormField({
  label,
  required,
  method,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  method?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <div className="flex items-center gap-2">
        <label className="type-label-md text-on-surface-variant">
          {label}
          {required && <span className="text-error ml-0.5">*</span>}
        </label>
        {method && <MethodBadge method={method} />}
      </div>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <h3 className="type-title-sm text-on-surface shrink-0">{children}</h3>
      <div className="h-px flex-1 bg-outline-variant/30" />
    </div>
  );
}

function MethodBadge({ method }: { method: string }) {
  const isAuto = method.includes("AI") || method.includes("自動");
  return (
    <Badge
      className={`rounded-full border-none type-label-sm ${
        isAuto
          ? "bg-primary-fixed text-on-primary-fixed"
          : "bg-surface-container-high text-on-surface-variant"
      }`}
    >
      {method}
    </Badge>
  );
}

function NativeSelect({
  defaultValue,
  options,
  placeholder,
}: {
  defaultValue: string;
  options: string[];
  placeholder?: string;
}) {
  return (
    <select
      defaultValue={defaultValue}
      className="w-full bg-surface-container-high border-none rounded-lg h-10 px-3 type-body-md text-on-surface outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt || "—"}
        </option>
      ))}
    </select>
  );
}

function TagInput({
  defaultValue,
  placeholder,
  suggestions: _suggestions,
}: {
  defaultValue: string[];
  placeholder: string;
  suggestions?: string[];
}) {
  const [tags, setTags] = useState(defaultValue);
  const [input, setInput] = useState("");

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <Badge
            key={tag}
            className="rounded-full bg-primary-fixed text-on-primary-fixed border-none type-label-sm px-2.5 py-0.5 gap-1 cursor-pointer hover:opacity-80"
            onClick={() => removeTag(tag)}
          >
            {tag}
            <span className="text-on-primary-fixed/60">×</span>
          </Badge>
        ))}
      </div>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addTag();
          }
        }}
        onBlur={addTag}
        placeholder={placeholder}
        className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface"
      />
    </div>
  );
}

function ListInput({
  defaultValue,
  placeholder,
}: {
  defaultValue: string[];
  placeholder: string;
}) {
  const [items, setItems] = useState(defaultValue);

  const updateItem = (index: number, value: string) => {
    const updated = [...items];
    updated[index] = value;
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, ""]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="type-label-sm text-on-surface-variant w-6 text-right shrink-0">
            {i + 1}.
          </span>
          <Input
            value={item}
            onChange={(e) => updateItem(i, e.target.value)}
            placeholder={placeholder}
            className="bg-surface-container-high border-none rounded-lg h-9 type-body-sm text-on-surface flex-1"
          />
          <button
            onClick={() => removeItem(i)}
            className="text-on-surface-variant hover:text-error transition-colors shrink-0 p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      ))}
      <button
        onClick={addItem}
        className="type-label-sm text-primary hover:text-primary/80 transition-colors pl-8"
      >
        + 追加
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Shared UI
   ═══════════════════════════════════════════════════════════════ */

function buildProjectFields(p: Project) {
  return [
    { name: "タイトル", filled: true },
    { name: "概要", filled: !!p.overview },
    { name: "期間", filled: !!p.period },
    { name: "担当役割", filled: !!p.role },
    { name: "背景・課題", filled: !!p.background },
    { name: "課題リスト", filled: p.issues.length > 0 },
    { name: "アプローチ", filled: p.approach.length > 0 },
    { name: "成果物", filled: !!p.outputs },
    { name: "結果", filled: !!p.results },
    { name: "ドメインタグ", filled: p.domainTags.length > 0 },
    { name: "フェーズタグ", filled: p.phaseTags.length > 0 },
    { name: "スキルタグ", filled: p.skillTags.length > 0 },
  ];
}

function ConfidenceDot({ confidence }: { confidence: Confidence }) {
  const color =
    confidence === "高"
      ? "bg-tertiary"
      : confidence === "中"
        ? "bg-secondary-base"
        : "bg-error";
  return (
    <div className="relative">
      <span className={`block h-3 w-3 rounded-full ${color}`} />
      {confidence === "低" && (
        <span className="absolute inset-0 h-3 w-3 rounded-full bg-error animate-ping opacity-40" />
      )}
    </div>
  );
}

function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  const variants: Record<Confidence, string> = {
    高: "bg-tertiary-fixed text-on-tertiary-container",
    中: "bg-secondary-container text-on-secondary-container",
    低: "bg-error-container text-on-error-container",
  };
  return (
    <Badge className={`rounded-full border-none type-label-sm ${variants[confidence]}`}>
      信頼度: {confidence}
    </Badge>
  );
}

function ConfidenceSummaryDots({
  projects,
  workHistory,
}: {
  projects: Project[];
  workHistory: WorkHistory[];
}) {
  const items = [
    ...projects.map((p) => p.confidence),
    ...workHistory.map((w) => w.confidence),
  ];
  return (
    <div className="flex items-center gap-1">
      {items.map((c, i) => {
        const color =
          c === "高" ? "bg-tertiary" : c === "中" ? "bg-secondary-base" : "bg-error";
        return <span key={i} className={`block h-2 w-2 rounded-full ${color}`} />;
      })}
    </div>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`text-on-surface-variant transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
