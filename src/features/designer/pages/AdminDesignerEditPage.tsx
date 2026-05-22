import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/shared/components/EmptyState";
import { getDesignerById, updateDesigner } from "@/api/supabase";
import type {
  Project,
  WorkHistory,
  Confidence,
  ReviewStatus,
  DesignerWithRelations,
} from "@/api/schema";
import {
  SourceType,
  EmploymentType,
  PhaseTag,
  DesignerStatus,
  AvailabilityStatus,
} from "@/api/schema";

type BasicDraft = {
  name: string;
  status: string;
  sourceUrl: string;
  sourceType: string;
  profileImageUrl: string;
  bio: string;
  availabilityStatus: string;
  availabilityNote: string;
  socialLinks: {
    x: string;
    note: string;
    linkedin: string;
    github: string;
    dribbble: string;
    behance: string;
    website: string;
  };
};

function initDraft(d: DesignerWithRelations): BasicDraft {
  return {
    name: d.name,
    status: d.status,
    sourceUrl: d.sourceUrl ?? "",
    sourceType: d.sourceType ?? "その他",
    profileImageUrl: d.profileImageUrl ?? "",
    bio: d.bio ?? "",
    availabilityStatus: d.availabilityStatus ?? "",
    availabilityNote: d.availabilityNote ?? "",
    socialLinks: {
      x: d.socialLinks?.x ?? "",
      note: d.socialLinks?.note ?? "",
      linkedin: d.socialLinks?.linkedin ?? "",
      github: d.socialLinks?.github ?? "",
      dribbble: d.socialLinks?.dribbble ?? "",
      behance: d.socialLinks?.behance ?? "",
      website: d.socialLinks?.website ?? "",
    },
  };
}

export function AdminDesignerEditPage() {
  const { designerId } = useParams<{ designerId: string }>();
  const [data, setData] = useState<DesignerWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<BasicDraft | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    if (!designerId) return;
    getDesignerById(designerId).then((d) => {
      setData(d);
      if (d) setDraft(initDraft(d));
    }).finally(() => setLoading(false));
  }, [designerId]);

  const handleSave = async () => {
    if (!draft || !designerId) return;
    setSaving(true);
    const socialLinks = Object.fromEntries(
      Object.entries(draft.socialLinks).filter(([, v]) => v !== "")
    );
    const result = await updateDesigner(designerId, {
      name: draft.name,
      status: draft.status,
      sourceUrl: draft.sourceUrl || null,
      sourceType: draft.sourceType || null,
      profileImageUrl: draft.profileImageUrl || null,
      bio: draft.bio || null,
      availabilityStatus: draft.availabilityStatus || null,
      availabilityNote: draft.availabilityNote || null,
      socialLinks: Object.keys(socialLinks).length > 0 ? socialLinks : null,
    });
    setSaving(false);
    setSaveMsg(result ? "success" : "error");
    setTimeout(() => setSaveMsg(null), 3000);
  };

  if (loading) return <div className="p-8 text-on-surface-variant">読み込み中...</div>;

  if (!data || !draft) {
    return (
      <div className="py-20">
        <EmptyState
          icon={<UserIcon />}
          title="デザイナーが見つかりません"
          description="URLが正しいか確認してください。"
          action={{ label: "管理一覧に戻る" }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 type-label-sm text-on-surface-variant">
        <Link to="/admin" className="hover:text-primary transition-colors">
          デザイナー管理
        </Link>
        <span>/</span>
        <span className="text-on-surface">{data.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h1 className="type-headline-lg text-on-surface">{data.name}</h1>
          <div className="flex items-center gap-3">
            <StatusBadge status={data.status} />
            <span className="type-body-sm text-on-surface-variant">
              {data.sourceType} — 取り込み:{" "}
              {new Date(data.importedAt).toLocaleDateString("ja-JP")}
            </span>
          </div>
        </div>
        <Link to={`/designers/${data.id}`}>
          <Button
            variant="ghost"
            className="type-label-md text-on-surface-variant hover:bg-surface-container rounded-lg"
          >
            プレビュー
          </Button>
        </Link>
      </div>

      {/* Floating Save Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-outline-variant/30">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-end gap-3">
          {saveMsg === "success" && (
            <span className="type-label-sm text-tertiary">保存しました</span>
          )}
          {saveMsg === "error" && (
            <span className="type-label-sm text-error">保存に失敗しました</span>
          )}
          <Link to="/admin">
            <Button
              variant="ghost"
              className="type-label-md text-on-surface-variant hover:bg-surface-container rounded-lg"
            >
              キャンセル
            </Button>
          </Link>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="gradient-primary text-on-primary rounded-2xl px-6 disabled:opacity-60"
          >
            {saving ? "保存中..." : "保存"}
          </Button>
        </div>
      </div>

      {/* Validation Summary */}
      <ValidationSummary projects={data.projects} workHistory={data.workHistory} />

      {/* Sections */}
      <div className="space-y-8">
        {/* Basic Info */}
        <BasicInfoForm draft={draft} onDraftChange={setDraft} />

        {/* Projects */}
        <div className="space-y-6">
          <h2 className="type-headline-sm text-on-surface">プロジェクト ({data.projects.length})</h2>
          {data.projects.length === 0 ? (
            <EmptyState
              icon={<FolderIcon />}
              title="プロジェクトがまだありません"
              description="AI取り込みを実行するか、手動でプロジェクトを追加してください。"
              action={{ label: "+ プロジェクトを追加" }}
            />
          ) : (
            <>
              {data.projects.map((p) => (
                <ProjectForm key={p.id} project={p} />
              ))}
              <Button
                variant="ghost"
                className="w-full rounded-2xl border-2 border-dashed border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary py-6"
              >
                + プロジェクトを追加
              </Button>
            </>
          )}
        </div>

        {/* Work History */}
        <div className="space-y-6">
          <h2 className="type-headline-sm text-on-surface">職務経歴 ({data.workHistory.length})</h2>
          {data.workHistory.length === 0 ? (
            <EmptyState
              icon={<BriefcaseIcon />}
              title="職務経歴がまだありません"
              description="AI取り込みを実行するか、手動で経歴を追加してください。"
              action={{ label: "+ 経歴を追加" }}
            />
          ) : (
            <>
              {data.workHistory.map((w) => (
                <WorkHistoryForm key={w.id} item={w} />
              ))}
              <Button
                variant="ghost"
                className="w-full rounded-2xl border-2 border-dashed border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary py-6"
              >
                + 経歴を追加
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Basic Info Form (controlled)
   ═══════════════════════════════════════════════════════════════ */

function BasicInfoForm({
  draft,
  onDraftChange,
}: {
  draft: BasicDraft;
  onDraftChange: (d: BasicDraft) => void;
}) {
  const set = (key: keyof Omit<BasicDraft, "socialLinks">, value: string) =>
    onDraftChange({ ...draft, [key]: value });
  const setSocial = (key: keyof BasicDraft["socialLinks"], value: string) =>
    onDraftChange({ ...draft, socialLinks: { ...draft.socialLinks, [key]: value } });

  return (
    <div className="rounded-2xl bg-surface-container-low p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="type-headline-sm text-on-surface">基本情報</h2>
        <MethodBadge method="手入力" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="氏名" required>
          <Input
            value={draft.name}
            onChange={(e) => set("name", e.target.value)}
            className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface"
          />
        </FormField>

        <FormField label="ステータス" required>
          <NativeSelect
            value={draft.status}
            onChange={(v) => set("status", v)}
            options={[...DesignerStatus]}
          />
        </FormField>

        <FormField label="ソースURL" className="sm:col-span-2">
          <Input
            value={draft.sourceUrl}
            onChange={(e) => set("sourceUrl", e.target.value)}
            type="url"
            className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface"
          />
        </FormField>

        <FormField label="ソースタイプ">
          <NativeSelect
            value={draft.sourceType}
            onChange={(v) => set("sourceType", v)}
            options={[...SourceType]}
          />
        </FormField>

        <FormField label="プロフィール画像URL" className="sm:col-span-2">
          <div className="flex gap-3">
            <Input
              value={draft.profileImageUrl}
              onChange={(e) => set("profileImageUrl", e.target.value)}
              placeholder="https://..."
              className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface flex-1"
            />
            {draft.profileImageUrl && (
              <img
                src={draft.profileImageUrl}
                alt=""
                className="h-10 w-10 rounded-lg object-cover"
              />
            )}
          </div>
        </FormField>

        <FormField label="自己紹介" className="sm:col-span-2">
          <Textarea
            value={draft.bio}
            onChange={(e) => set("bio", e.target.value)}
            placeholder="3〜5行で自己紹介を記入"
            className="bg-surface-container-high border-none rounded-lg type-body-md text-on-surface min-h-24"
          />
        </FormField>

        <FormField label="稼働状況">
          <NativeSelect
            value={draft.availabilityStatus}
            onChange={(v) => set("availabilityStatus", v)}
            options={["", ...AvailabilityStatus]}
            placeholder="選択してください"
          />
        </FormField>

        <FormField label="稼働状況の補足">
          <Input
            value={draft.availabilityNote}
            onChange={(e) => set("availabilityNote", e.target.value)}
            placeholder="例: 2025年7月〜稼働可能"
            className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface"
          />
        </FormField>
      </div>

      {/* SNSリンク */}
      <div className="flex items-center gap-3 pt-4">
        <h3 className="type-title-sm text-on-surface shrink-0">SNSリンク</h3>
        <div className="h-px flex-1 bg-outline-variant/30" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="X (Twitter)">
          <Input value={draft.socialLinks.x} onChange={(e) => setSocial("x", e.target.value)} placeholder="https://x.com/..." type="url" className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface" />
        </FormField>
        <FormField label="note">
          <Input value={draft.socialLinks.note} onChange={(e) => setSocial("note", e.target.value)} placeholder="https://note.com/..." type="url" className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface" />
        </FormField>
        <FormField label="LinkedIn">
          <Input value={draft.socialLinks.linkedin} onChange={(e) => setSocial("linkedin", e.target.value)} placeholder="https://linkedin.com/in/..." type="url" className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface" />
        </FormField>
        <FormField label="GitHub">
          <Input value={draft.socialLinks.github} onChange={(e) => setSocial("github", e.target.value)} placeholder="https://github.com/..." type="url" className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface" />
        </FormField>
        <FormField label="Dribbble">
          <Input value={draft.socialLinks.dribbble} onChange={(e) => setSocial("dribbble", e.target.value)} placeholder="https://dribbble.com/..." type="url" className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface" />
        </FormField>
        <FormField label="Behance">
          <Input value={draft.socialLinks.behance} onChange={(e) => setSocial("behance", e.target.value)} placeholder="https://behance.net/..." type="url" className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface" />
        </FormField>
        <FormField label="個人サイト" className="sm:col-span-2">
          <Input value={draft.socialLinks.website} onChange={(e) => setSocial("website", e.target.value)} placeholder="https://..." type="url" className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface" />
        </FormField>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Project Form
   ═══════════════════════════════════════════════════════════════ */

function ProjectForm({ project: p }: { project: Project }) {
  const [expanded, setExpanded] = useState(false);

  const fields = buildProjectFields(p);
  const filledCount = fields.filter((f) => f.filled).length;
  const rate = Math.round((filledCount / fields.length) * 100);

  return (
    <div className="rounded-2xl bg-surface-container-low overflow-hidden">
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
          <div className="flex items-center gap-2 w-24">
            <Progress value={rate} className="h-1.5 bg-surface-container-high [&>div]:bg-primary" />
            <span className="type-label-sm text-on-surface-variant">{rate}%</span>
          </div>
          <ReviewBadge status={p.reviewStatus} />
          <span className="type-body-sm text-on-surface-variant">{expanded ? "▲" : "▼"}</span>
        </div>
      </button>

      {expanded && (
        <div className="px-6 pb-8 space-y-6">
          {p.notes && (
            <div className="rounded-xl bg-error-container/50 p-4 type-body-sm text-on-error-container">
              <span className="font-medium">AI メモ: </span>{p.notes}
            </div>
          )}

          <SectionTitle>必須項目</SectionTitle>
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField label="プロジェクト名" required className="sm:col-span-2">
              <Input defaultValue={p.title} className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface" />
            </FormField>
            <FormField label="概要" required className="sm:col-span-2" method="AI生成">
              <Textarea defaultValue={p.overview ?? ""} placeholder="何を・誰のために・なぜ（2〜3行）" className="bg-surface-container-high border-none rounded-lg type-body-md text-on-surface min-h-20" />
            </FormField>
            <FormField label="担当役割" required method="AI生成">
              <Input defaultValue={p.role ?? ""} placeholder="リードUIデザイナー / デザインシステム整備" className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface" />
            </FormField>
            <FormField label="期間" required>
              <Input defaultValue={p.period ?? ""} placeholder="2023年4月〜9月" className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface" />
            </FormField>
            <FormField label="背景・課題" required className="sm:col-span-2" method="AI生成">
              <Textarea defaultValue={p.background ?? ""} placeholder="プロジェクトの背景と解決すべき課題（2〜5文）" className="bg-surface-container-high border-none rounded-lg type-body-md text-on-surface min-h-24" />
            </FormField>
          </div>

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

          <SectionTitle>任意項目</SectionTitle>
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField label="チーム構成">
              <Input defaultValue={p.team ?? ""} placeholder="PdM 1・Des 2・Eng 4" className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface" />
            </FormField>
            <FormField label="Figma URL">
              <Input defaultValue={p.figmaUrl ?? ""} placeholder="https://www.figma.com/file/..." type="url" className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface" />
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
              <Textarea defaultValue={p.outputs ?? ""} placeholder="成果物の説明" className="bg-surface-container-high border-none rounded-lg type-body-md text-on-surface min-h-16" />
            </FormField>
            <FormField label="結果・インパクト" className="sm:col-span-2">
              <Textarea defaultValue={p.results ?? ""} placeholder="定量＋定性の結果" className="bg-surface-container-high border-none rounded-lg type-body-md text-on-surface min-h-16" />
            </FormField>
            <FormField label="定量成果（箇条書き）">
              <ListInput defaultValue={p.metrics} placeholder="指標: before→after（変化率）" />
            </FormField>
            <FormField label="引用・声">
              <Textarea defaultValue={p.quote ?? ""} placeholder="ユーザーやクライアントの声" className="bg-surface-container-high border-none rounded-lg type-body-md text-on-surface min-h-16" />
            </FormField>
          </div>

          <div className="flex gap-2 pt-4" style={{ borderTop: "1px solid var(--surface-container-high)" }}>
            <Button variant="ghost" size="sm" className="type-label-md text-primary hover:bg-primary-fixed rounded-lg">確認済みにする</Button>
            <Button variant="ghost" size="sm" className="type-label-md text-error hover:bg-error-container rounded-lg">要修正にする</Button>
            <div className="flex-1" />
            <Button variant="ghost" size="sm" className="type-label-md text-error hover:bg-error-container rounded-lg">削除</Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Work History Form
   ═══════════════════════════════════════════════════════════════ */

function WorkHistoryForm({ item: w }: { item: WorkHistory }) {
  const [expanded, setExpanded] = useState(false);
  const filledFields = [w.company, w.role, w.periodStart, w.description, w.employmentType].filter(Boolean).length;
  const rate = Math.round((filledFields / 7) * 100);

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
            <p className="type-body-sm text-on-surface-variant mt-0.5">{w.role} — {w.employmentType ?? ""}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2 w-24">
            <Progress value={rate} className="h-1.5 bg-surface-container-high [&>div]:bg-primary" />
            <span className="type-label-sm text-on-surface-variant">{rate}%</span>
          </div>
          <ReviewBadge status={w.reviewStatus} />
          <span className="type-body-sm text-on-surface-variant">{expanded ? "▲" : "▼"}</span>
        </div>
      </button>

      {expanded && (
        <div className="px-6 pb-8 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField label="会社名" required>
              <Input defaultValue={w.company} className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface" />
            </FormField>
            <FormField label="役職" required>
              <Input defaultValue={w.role ?? ""} placeholder="シニアプロダクトデザイナー" className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface" />
            </FormField>
            <FormField label="在籍開始" required>
              <Input defaultValue={w.periodStart ?? ""} type="date" className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface" />
            </FormField>
            <FormField label="在籍終了">
              <div className="space-y-2">
                <Input defaultValue={w.periodEnd ?? ""} type="date" disabled={w.isCurrent} className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface disabled:opacity-50" />
                <label className="flex items-center gap-2 type-label-sm text-on-surface-variant cursor-pointer">
                  <input type="checkbox" defaultChecked={w.isCurrent} className="rounded accent-[var(--primary)]" />
                  現職
                </label>
              </div>
            </FormField>
            <FormField label="雇用形態" required>
              <NativeSelect value={w.employmentType ?? ""} onChange={() => {}} options={["", ...EmploymentType]} placeholder="選択してください" />
            </FormField>
            <FormField label="ドメインタグ" method="AI推定">
              <TagInput defaultValue={w.domainTags} placeholder="toB, SaaS..." />
            </FormField>
            <FormField label="業務内容" className="sm:col-span-2">
              <Textarea defaultValue={w.description ?? ""} placeholder="2〜4文で「何を担当し、どんな成果を出したか」を要約" className="bg-surface-container-high border-none rounded-lg type-body-md text-on-surface min-h-20" />
            </FormField>
          </div>
          <div className="flex gap-2 pt-4" style={{ borderTop: "1px solid var(--surface-container-high)" }}>
            <Button variant="ghost" size="sm" className="type-label-md text-primary hover:bg-primary-fixed rounded-lg">確認済みにする</Button>
            <div className="flex-1" />
            <Button variant="ghost" size="sm" className="type-label-md text-error hover:bg-error-container rounded-lg">削除</Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Shared Form Components
   ═══════════════════════════════════════════════════════════════ */

function FormField({ label, required, method, className, children }: {
  label: string; required?: boolean; method?: string; className?: string; children: React.ReactNode;
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <div className="flex items-center gap-2">
        <label className="type-label-md text-on-surface-variant">
          {label}{required && <span className="text-error ml-0.5">*</span>}
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
    <Badge className={`rounded-full border-none type-label-sm ${isAuto ? "bg-primary-fixed text-on-primary-fixed" : "bg-surface-container-high text-on-surface-variant"}`}>
      {method}
    </Badge>
  );
}

function NativeSelect({ value, onChange, options, placeholder }: {
  value: string; onChange: (v: string) => void; options: string[]; placeholder?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-surface-container-high border-none rounded-lg h-10 px-3 type-body-md text-on-surface outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
    >
      {placeholder && <option value="" disabled>{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt || "—"}</option>
      ))}
    </select>
  );
}

function TagInput({ defaultValue, placeholder, suggestions: _suggestions }: {
  defaultValue: string[]; placeholder: string; suggestions?: string[];
}) {
  const [tags, setTags] = useState(defaultValue);
  const [input, setInput] = useState("");

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) { setTags([...tags, trimmed]); setInput(""); }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <Badge key={tag} className="rounded-full bg-primary-fixed text-on-primary-fixed border-none type-label-sm px-2.5 py-0.5 gap-1 cursor-pointer hover:opacity-80" onClick={() => setTags(tags.filter((t) => t !== tag))}>
            {tag}<span className="text-on-primary-fixed/60">×</span>
          </Badge>
        ))}
      </div>
      <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} onBlur={addTag} placeholder={placeholder} className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface" />
    </div>
  );
}

function ListInput({ defaultValue, placeholder }: { defaultValue: string[]; placeholder: string }) {
  const [items, setItems] = useState(defaultValue);
  const updateItem = (i: number, v: string) => { const u = [...items]; u[i] = v; setItems(u); };

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="type-label-sm text-on-surface-variant w-6 text-right shrink-0">{i + 1}.</span>
          <Input value={item} onChange={(e) => updateItem(i, e.target.value)} placeholder={placeholder} className="bg-surface-container-high border-none rounded-lg h-9 type-body-sm text-on-surface flex-1" />
          <button onClick={() => setItems(items.filter((_, j) => j !== i))} className="text-on-surface-variant hover:text-error transition-colors shrink-0 p-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
          </button>
        </div>
      ))}
      <button onClick={() => setItems([...items, ""])} className="type-label-sm text-primary hover:text-primary/80 transition-colors pl-8">+ 追加</button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Validation Summary
   ═══════════════════════════════════════════════════════════════ */

function ValidationSummary({ projects, workHistory }: { projects: Project[]; workHistory: WorkHistory[] }) {
  const allItems = [
    ...projects.map((p) => ({ confidence: p.confidence, review: p.reviewStatus })),
    ...workHistory.map((w) => ({ confidence: w.confidence, review: w.reviewStatus })),
  ];
  const total = allItems.length;

  if (total === 0) {
    return (
      <div className="rounded-2xl bg-surface-container-low p-8 text-center">
        <div className="space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container text-on-surface-variant">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16h5v5" /></svg>
          </div>
          <p className="type-title-md text-on-surface">AI取り込み待ち</p>
          <p className="type-body-sm text-on-surface-variant">まだデータがありません。AI取り込みを実行するか、手動で情報を入力してください。</p>
        </div>
      </div>
    );
  }

  const highCount = allItems.filter((i) => i.confidence === "高").length;
  const confirmedCount = allItems.filter((i) => i.review === "確認済").length;
  const needsReview = allItems.filter((i) => i.review === "未確認").length;
  const hasIssue = allItems.filter((i) => i.review === "要修正" || i.confidence === "低").length;

  return (
    <div className="rounded-2xl bg-surface-container-low p-6 space-y-5">
      <h2 className="type-title-md text-on-surface">バリデーション サマリー</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MiniStat label="AI信頼度 高" value={`${Math.round((highCount / total) * 100)}%`} progress={Math.round((highCount / total) * 100)} />
        <MiniStat label="確認済み" value={`${Math.round((confirmedCount / total) * 100)}%`} progress={Math.round((confirmedCount / total) * 100)} />
        <MiniStat label="未確認" value={String(needsReview)} alert={needsReview > 0} />
        <MiniStat label="要修正 / 低信頼度" value={String(hasIssue)} alert={hasIssue > 0} />
      </div>
    </div>
  );
}

function MiniStat({ label, value, progress, alert }: { label: string; value: string; progress?: number; alert?: boolean }) {
  return (
    <div className="space-y-2">
      <p className="type-label-md text-on-surface-variant">{label}</p>
      <p className={`type-headline-sm ${alert ? "text-error" : "text-on-surface"}`}>{value}</p>
      {progress !== undefined && <Progress value={progress} className="h-1.5 bg-surface-container-high [&>div]:bg-primary" />}
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
    { name: "主要な判断", filled: p.keyDecisions.length > 0 },
    { name: "成果物", filled: !!p.outputs },
    { name: "結果", filled: !!p.results },
    { name: "定量成果", filled: p.metrics.length > 0 },
    { name: "引用/声", filled: !!p.quote },
    { name: "ドメインタグ", filled: p.domainTags.length > 0 },
    { name: "フェーズタグ", filled: p.phaseTags.length > 0 },
    { name: "スキルタグ", filled: p.skillTags.length > 0 },
  ];
}

function ConfidenceDot({ confidence }: { confidence: Confidence }) {
  const color = confidence === "高" ? "bg-tertiary" : confidence === "中" ? "bg-secondary-base" : "bg-error";
  return (
    <div className="relative">
      <span className={`block h-3 w-3 rounded-full ${color}`} />
      {confidence === "低" && <span className="absolute inset-0 h-3 w-3 rounded-full bg-error animate-ping opacity-40" />}
    </div>
  );
}

function ReviewBadge({ status }: { status: ReviewStatus }) {
  const variants: Record<ReviewStatus, string> = {
    確認済: "bg-tertiary-fixed text-on-tertiary-container",
    未確認: "bg-surface-container-high text-on-surface-variant",
    要修正: "bg-error-container text-on-error-container",
  };
  return <Badge className={`rounded-full border-none type-label-sm ${variants[status]}`}>{status}</Badge>;
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    完了: "bg-tertiary-fixed text-on-tertiary-container",
    要確認: "bg-error-container text-on-error-container",
    処理中: "bg-surface-container-high text-on-surface-variant",
  };
  return <Badge className={`rounded-full px-3 py-0.5 type-label-sm border-none ${variants[status] ?? variants["処理中"]}`}>{status}</Badge>;
}

function UserIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
}
function FolderIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" /></svg>;
}
function BriefcaseIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /><rect width="20" height="14" x="2" y="6" rx="2" /></svg>;
}
