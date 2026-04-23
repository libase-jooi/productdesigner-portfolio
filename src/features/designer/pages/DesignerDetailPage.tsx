import { useState } from "react";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { EmptyState } from "@/shared/components/EmptyState";
import { UploadDialog } from "@/features/upload/components/UploadDialog";
import { getMockDesigner, getMockDesignerBySlug } from "@/api/mock";
import type { Project, WorkHistory } from "@/api/schema";
import { EmploymentType, PhaseTag } from "@/api/schema";

type PageMode = "view" | "edit" | "confirm";

export function DesignerDetailPage() {
  const { designerId, slug } = useParams<{
    designerId?: string;
    slug?: string;
  }>();
  const data = slug
    ? getMockDesignerBySlug(slug)
    : getMockDesigner(designerId ?? "");

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [mode, setMode] = useState<PageMode>("view");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [isPublished, setIsPublished] = useState(data?.publishedAt !== null);
  const [editingSlug, setEditingSlug] = useState(false);
  const [slugValue, setSlugValue] = useState(data?.slug ?? "");
  const [workHistoryList, setWorkHistoryList] = useState<WorkHistory[]>(data?.workHistory ?? []);
  const [projectList, setProjectList] = useState<Project[]>(data?.projects ?? []);

  const addWorkHistory = () => {
    const now = new Date().toISOString();
    const newItem: WorkHistory = {
      id: `wh-new-${Date.now()}`,
      designerId: data?.id ?? "",
      company: "",
      role: null,
      periodStart: null,
      periodEnd: null,
      isCurrent: false,
      description: null,
      domainTags: [],
      employmentType: null,
      confidence: "低",
      reviewStatus: "未確認",
      createdAt: now,
      updatedAt: now,
    };
    setWorkHistoryList((prev) => [...prev, newItem]);
  };

  const addProject = () => {
    const now = new Date().toISOString();
    const newItem: Project = {
      id: `pj-new-${Date.now()}`,
      designerId: data?.id ?? "",
      title: "",
      thumbnailUrl: null,
      overview: null,
      period: null,
      team: null,
      role: null,
      background: null,
      issues: [],
      approach: [],
      keyDecisions: [],
      outputs: null,
      figmaUrl: null,
      results: null,
      metrics: [],
      quote: null,
      domainTags: [],
      phaseTags: [],
      skillTags: [],
      confidence: "低",
      reviewStatus: "未確認",
      notes: null,
      rawJson: null,
      createdAt: now,
      updatedAt: now,
    };
    setProjectList((prev) => [...prev, newItem]);
  };

  if (!data) {
    return (
      <div className="py-20">
        <EmptyState
          icon={<UserIcon />}
          title="デザイナーが見つかりません"
          description="URLが正しいか確認してください。"
          action={{ label: "一覧に戻る" }}
        />
      </div>
    );
  }

  const currentJob = data.workHistory.find((w) => w.isCurrent);
  const allSkills = Array.from(
    new Set(data.projects.flatMap((p) => p.skillTags))
  );
  const allDomains = Array.from(
    new Set(data.projects.flatMap((p) => p.domainTags))
  );

  return (
    <div className="space-y-12 sm:space-y-20 pb-24 sm:pb-28">
      {/* ── Edit Toggle ─────────────────────────────────── */}
      {mode === "view" && (
        <div className="flex items-center justify-end gap-2 pt-4">
          <Button
            size="sm"
            onClick={() => setUploadOpen(true)}
            className="rounded-lg gradient-primary text-white border-none"
          >
            <UploadIcon />
            更新する
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMode("edit")}
            className="rounded-lg"
          >
            <PencilIcon />
            編集する
          </Button>
        </div>
      )}

      {/* ── Publish Status & URL ────────────────────────── */}
      {mode === "view" && (
        <div className="rounded-xl bg-surface-container-low p-4 space-y-3">
          {/* Publish toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`h-2.5 w-2.5 rounded-full ${isPublished ? "bg-tertiary" : "bg-outline-variant"}`} />
              <span className="type-label-md text-on-surface">
                {isPublished ? "公開中" : "非公開"}
              </span>
              {isPublished && slugValue && (
                <a
                  href={`/p/${slugValue}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 type-label-sm text-primary hover:text-primary/80 transition-colors"
                >
                  公開ページを見る
                  <ExternalLinkIcon />
                </a>
              )}
            </div>
            <button
              onClick={() => setIsPublished(!isPublished)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isPublished ? "bg-tertiary" : "bg-outline-variant"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                  isPublished ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* URL */}
          <div className="flex items-center gap-2">
            <span className="type-body-sm text-on-surface-variant shrink-0">公開URL:</span>
            {editingSlug ? (
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="type-body-sm text-on-surface-variant shrink-0">
                  {window.location.origin}/p/
                </span>
                <Input
                  value={slugValue}
                  onChange={(e) => setSlugValue(e.target.value.replace(/[^a-z0-9-]/g, ""))}
                  placeholder="your-name"
                  className="bg-surface-container-high border-none rounded-lg h-8 type-body-sm text-on-surface flex-1 max-w-48"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setEditingSlug(false);
                    if (e.key === "Escape") {
                      setSlugValue(data?.slug ?? "");
                      setEditingSlug(false);
                    }
                  }}
                />
                <Button
                  size="sm"
                  onClick={() => setEditingSlug(false)}
                  className="rounded-lg h-8 px-3 gradient-primary text-white border-none type-label-sm"
                >
                  保存
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSlugValue(data?.slug ?? "");
                    setEditingSlug(false);
                  }}
                  className="rounded-lg h-8 px-3 type-label-sm"
                >
                  取消
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {slugValue ? (
                  <a
                    href={`/p/${slugValue}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="type-body-sm text-primary hover:underline truncate"
                  >
                    {window.location.origin}/p/{slugValue}
                  </a>
                ) : (
                  <span className="type-body-sm text-on-surface-variant italic">
                    未設定
                  </span>
                )}
                <button
                  onClick={() => setEditingSlug(true)}
                  className="shrink-0 text-on-surface-variant hover:text-primary transition-colors"
                >
                  <PencilIcon />
                </button>
                {slugValue && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/p/${slugValue}`);
                    }}
                    className="shrink-0 text-on-surface-variant hover:text-primary transition-colors"
                    title="URLをコピー"
                  >
                    <CopyIcon />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════
         VIEW MODE
         ════════════════════════════════════════════════════ */}
      {mode === "view" && (
        <>
          {/* ── Hero ─────────────────────────────────────── */}
          <section className="space-y-6 sm:space-y-8">
            <div className="flex items-start gap-4 sm:gap-8">
              <Avatar className="h-16 w-16 sm:h-24 sm:w-24 rounded-xl sm:rounded-2xl shrink-0">
                <AvatarImage src={data.profileImageUrl ?? undefined} />
                <AvatarFallback className="rounded-xl sm:rounded-2xl bg-primary-container text-on-primary-container type-title-lg sm:type-display-sm">
                  {data.name[0]}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-2 sm:space-y-3 min-w-0">
                <h1 className="type-headline-lg sm:type-display-md text-on-surface">
                  {data.name}
                </h1>
                {currentJob && (
                  <p className="type-body-md sm:type-title-lg text-on-surface-variant">
                    {currentJob.role}
                    {currentJob.company !== "フリーランス"
                      ? ` — ${currentJob.company}`
                      : ""}
                  </p>
                )}
                {allDomains.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {allDomains.map((tag) => (
                      <Badge
                        key={tag}
                        className="rounded-full bg-surface-container-high text-on-surface-variant border-none type-label-sm"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {allSkills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-2">
                {allSkills.map((tag) => (
                  <Badge
                    key={tag}
                    className="rounded-full bg-primary-fixed text-on-primary-fixed border-none type-label-md px-3 py-1"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </section>

          {/* ── Full Empty State ──────────────────────────── */}
          {data.workHistory.length === 0 && data.projects.length === 0 ? (
            <EmptyState
              icon={<UploadIcon />}
              title="ポートフォリオがまだありません"
              description="PDFやポートフォリオURLをアップロードすると、AIが経歴・プロジェクト情報を自動で構造化します。"
              action={{
                label: "アップロードする",
                onClick: () => setUploadOpen(true),
              }}
            />
          ) : (
            <>
              {/* ── Work History ─────────────────────────────── */}
              <section className="space-y-6 sm:space-y-8">
                <h2 className="type-headline-md sm:type-headline-lg text-on-surface">
                  経歴
                </h2>
                <div className="space-y-3">
                  {data.workHistory.map((w) => (
                    <WorkHistoryRow key={w.id} item={w} />
                  ))}
                </div>
              </section>

              {/* ── Projects ─────────────────────────────────── */}
              <section className="space-y-6 sm:space-y-10">
                <h2 className="type-headline-md sm:type-headline-lg text-on-surface">
                  プロジェクト
                </h2>
                {data.projects.length === 0 ? (
                  <p className="type-body-md text-on-surface-variant">プロジェクトはまだありません</p>
                ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
                {data.projects.map((p, i) => (
                  <ProjectCard
                    key={p.id}
                    project={p}
                    index={i}
                    onClick={() => setSelectedProject(p)}
                  />
                ))}
              </div>
            )}
          </section>

              {/* ── Project Detail Modal ─────────────────────── */}
              <Dialog
                open={selectedProject !== null}
                onOpenChange={(open) => {
                  if (!open) setSelectedProject(null);
                }}
              >
                {selectedProject && (
                  <DialogContent className="sm:max-w-3xl max-h-[85vh] flex flex-col p-0">
                    <DialogHeader className="shrink-0 p-4 sm:p-6 pb-0 sm:pb-0 pr-12">
                      <DialogTitle className="type-headline-sm sm:type-headline-lg text-on-surface">
                        {selectedProject.title}
                      </DialogTitle>
                      {selectedProject.overview && (
                        <DialogDescription className="type-body-sm sm:type-body-md text-on-surface-variant">
                          {selectedProject.overview}
                        </DialogDescription>
                      )}
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 pt-4">
                      <ProjectModalBody project={selectedProject} />
                    </div>
                  </DialogContent>
                )}
              </Dialog>
            </>
          )}
        </>
      )}

      {/* ════════════════════════════════════════════════════
         EDIT MODE — Admin-style form UI
         ════════════════════════════════════════════════════ */}
      {mode === "edit" && (
        <>
          {/* ── Profile Form ─────────────────────────────── */}
          <section className="rounded-2xl bg-surface-container-low p-6 sm:p-8 space-y-6">
            <h2 className="type-headline-sm text-on-surface">基本情報</h2>

            <div className="grid gap-6 sm:grid-cols-2">
              <FormField label="氏名" required>
                <Input
                  defaultValue={data.name}
                  className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface"
                />
              </FormField>

              <ImageField
                defaultValue={data.profileImageUrl}
                label="プロフィール画像"
                aspectRatio="1/1"
                maxWidth="120px"
              />
            </div>
          </section>

          {/* ── Work History Forms ────────────────────────── */}
          <section className="space-y-6">
            <h2 className="type-headline-md sm:type-headline-lg text-on-surface">
              経歴
            </h2>

            {workHistoryList.map((w) => (
              <WorkHistoryFormCard key={w.id} item={w} />
            ))}

            <Button
              variant="ghost"
              className="w-full rounded-2xl border-2 border-dashed border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary py-6"
              onClick={addWorkHistory}
            >
              + 経歴を追加
            </Button>
          </section>

          {/* ── Project Forms ────────────────────────────── */}
          <section className="space-y-6">
            <h2 className="type-headline-md sm:type-headline-lg text-on-surface">
              プロジェクト
            </h2>

            {projectList.map((p) => (
              <ProjectFormCard key={p.id} project={p} />
            ))}

            <Button
              variant="ghost"
              className="w-full rounded-2xl border-2 border-dashed border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary py-6"
              onClick={addProject}
            >
              + プロジェクトを追加
            </Button>
          </section>

          {/* ── Floating Action Bar ──────────────────────── */}
          <div className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-outline-variant/30">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
              <p className="type-body-sm text-on-surface-variant hidden sm:block">
                変更を確認して保存してください
              </p>
              <div className="flex items-center gap-3 ml-auto">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setMode("view")}
                  className="rounded-xl px-6"
                >
                  キャンセル
                </Button>
                <Button
                  size="lg"
                  onClick={() => setMode("confirm")}
                  className="rounded-xl px-6 gradient-primary text-white border-none"
                >
                  確認する
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ════════════════════════════════════════════════════
         CONFIRM MODE — 変更確認ステップ
         ════════════════════════════════════════════════════ */}
      {mode === "confirm" && (
        <>
          <section className="rounded-2xl bg-surface-container-low p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary-fixed flex items-center justify-center">
                <CheckIcon />
              </div>
              <div>
                <h2 className="type-headline-sm text-on-surface">
                  内容を確認してください
                </h2>
                <p className="type-body-sm text-on-surface-variant">
                  以下の内容で保存します。問題がなければ「保存する」を押してください。
                </p>
              </div>
            </div>
          </section>

          {/* ── Confirm: Profile ──────────────────────────── */}
          <section className="rounded-2xl bg-surface-container-low p-6 sm:p-8 space-y-4">
            <h3 className="type-title-md text-on-surface">基本情報</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <ConfirmRow label="氏名" value={data.name} />
              <ConfirmRow
                label="プロフィール画像"
                value={data.profileImageUrl ? "設定済み" : "未設定"}
              />
            </div>
          </section>

          {/* ── Confirm: Work History ─────────────────────── */}
          <section className="rounded-2xl bg-surface-container-low p-6 sm:p-8 space-y-4">
            <h3 className="type-title-md text-on-surface">
              経歴 ({data.workHistory.length}件)
            </h3>
            <div className="space-y-3">
              {data.workHistory.map((w) => (
                <div
                  key={w.id}
                  className="rounded-lg bg-surface-container p-4 space-y-1"
                >
                  <p className="type-title-sm text-on-surface">{w.company}</p>
                  <p className="type-body-sm text-on-surface-variant">
                    {w.role} — {w.employmentType ?? "未設定"}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {w.domainTags.map((tag) => (
                      <Badge
                        key={tag}
                        className="rounded-full bg-surface-container-high text-on-surface-variant border-none type-label-sm"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Confirm: Projects ─────────────────────────── */}
          <section className="rounded-2xl bg-surface-container-low p-6 sm:p-8 space-y-4">
            <h3 className="type-title-md text-on-surface">
              プロジェクト ({data.projects.length}件)
            </h3>
            <div className="space-y-3">
              {data.projects.map((p) => (
                <div
                  key={p.id}
                  className="rounded-lg bg-surface-container p-4 space-y-2"
                >
                  <p className="type-title-sm text-on-surface">{p.title}</p>
                  <p className="type-body-sm text-on-surface-variant">
                    {p.period} — {p.role}
                  </p>
                  {p.overview && (
                    <p className="type-body-sm text-on-surface-variant">
                      {p.overview}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {p.domainTags.map((tag) => (
                      <Badge
                        key={tag}
                        className="rounded-full bg-surface-container-high text-on-surface-variant border-none type-label-sm"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {p.phaseTags.map((tag) => (
                      <Badge
                        key={tag}
                        className="rounded-full bg-primary-fixed-dim text-on-primary-fixed border-none type-label-sm"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {p.skillTags.map((tag) => (
                      <Badge
                        key={tag}
                        className="rounded-full bg-secondary-container text-on-secondary-container border-none type-label-sm"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Floating Action Bar (Confirm) ────────────── */}
          <div className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-outline-variant/30">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
              <p className="type-body-sm text-on-surface-variant hidden sm:block">
                内容に問題はありませんか？
              </p>
              <div className="flex items-center gap-3 ml-auto">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setMode("edit")}
                  className="rounded-xl px-6"
                >
                  編集に戻る
                </Button>
                <Button
                  size="lg"
                  onClick={() => setMode("view")}
                  className="rounded-xl px-6 gradient-primary text-white border-none"
                >
                  保存する
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Form Components
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
        {method && (
          <Badge className="rounded-full border-none type-label-sm bg-primary-fixed text-on-primary-fixed">
            {method}
          </Badge>
        )}
      </div>
      {children}
    </div>
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
            <XIcon />
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

function ImageField({
  defaultValue,
  label,
  aspectRatio = "16/9",
  maxWidth,
}: {
  defaultValue: string | null;
  label: string;
  aspectRatio?: string;
  maxWidth?: string;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [editing, setEditing] = useState(false);
  const [tempUrl, setTempUrl] = useState(url);

  const handleDelete = () => {
    setUrl("");
  };

  const handleSave = () => {
    setUrl(tempUrl);
    setEditing(false);
  };

  const handleCancel = () => {
    setTempUrl(url);
    setEditing(false);
  };

  if (!url && !editing) {
    return (
      <div className="space-y-1.5">
        <label className="type-label-md text-on-surface-variant">{label}</label>
        <button
          type="button"
          onClick={() => {
            setTempUrl("");
            setEditing(true);
          }}
          className="w-full rounded-xl border-2 border-dashed border-outline-variant hover:border-primary transition-colors p-8 flex flex-col items-center gap-2 text-on-surface-variant hover:text-primary"
          style={{ aspectRatio, maxWidth }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
          <span className="type-label-md">画像を追加</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <label className="type-label-md text-on-surface-variant">{label}</label>

      {editing ? (
        <div className="space-y-3">
          <Input
            value={tempUrl}
            onChange={(e) => setTempUrl(e.target.value)}
            placeholder="画像URLを入力 https://..."
            className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface"
          />
          {tempUrl && (
            <div className="rounded-xl overflow-hidden bg-surface-container" style={{ aspectRatio, maxWidth }}>
              <img
                src={tempUrl}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="rounded-lg"
            >
              キャンセル
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="rounded-lg gradient-primary text-white border-none"
            >
              保存
            </Button>
          </div>
        </div>
      ) : (
        <div className="group relative rounded-xl overflow-hidden bg-surface-container" style={{ aspectRatio, maxWidth }}>
          <img
            src={url}
            alt=""
            className="w-full h-full object-cover"
          />
          {/* Overlay with actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => {
                setTempUrl(url);
                setEditing(true);
              }}
              className="size-9 rounded-full bg-white/90 text-on-surface flex items-center justify-center hover:bg-white transition-colors"
              title="変更"
            >
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
              >
                <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                <path d="m15 5 4 4" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="size-9 rounded-full bg-error/90 text-white flex items-center justify-center hover:bg-error transition-colors"
              title="削除"
            >
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
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionDivider({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <h3 className="type-title-sm text-on-surface shrink-0">{children}</h3>
      <div className="h-px flex-1 bg-outline-variant/30" />
    </div>
  );
}

function ConfirmRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <p className="type-label-sm text-on-surface-variant">{label}</p>
      <p className="type-body-md text-on-surface">{value || "—"}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Work History — Form Card (Edit Mode)
   ═══════════════════════════════════════════════════════════════ */

function WorkHistoryFormCard({ item: w }: { item: WorkHistory }) {
  const isNew = !w.company;
  const [expanded, setExpanded] = useState(isNew);

  return (
    <div className="rounded-2xl bg-surface-container-low overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-surface-container transition-colors"
      >
        <div className="min-w-0">
          <h3 className="type-title-md text-on-surface">{w.company || "新しい経歴"}</h3>
          <p className="type-body-sm text-on-surface-variant mt-0.5">
            {w.role} — {w.employmentType ?? ""}
          </p>
        </div>
        <span className="type-body-sm text-on-surface-variant shrink-0 ml-4">
          {expanded ? "▲" : "▼"}
        </span>
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

            <FormField label="雇用形態">
              <NativeSelect
                defaultValue={w.employmentType ?? ""}
                options={["", ...EmploymentType]}
                placeholder="選択してください"
              />
            </FormField>

            <FormField label="ドメインタグ" method="AI推定">
              <TagInput
                defaultValue={w.domainTags}
                placeholder="toB, SaaS..."
              />
            </FormField>

            <FormField label="業務内容" className="sm:col-span-2">
              <Textarea
                defaultValue={w.description ?? ""}
                placeholder="2〜4文で「何を担当し、どんな成果を出したか」を要約"
                className="bg-surface-container-high border-none rounded-lg type-body-md text-on-surface min-h-20"
              />
            </FormField>
          </div>

          <div
            className="flex gap-2 pt-4"
            style={{ borderTop: "1px solid var(--surface-container-high)" }}
          >
            <div className="flex-1" />
            <Button
              variant="ghost"
              size="sm"
              className="type-label-md text-error hover:bg-error-container rounded-lg"
            >
              削除
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Project — Form Card (Edit Mode)
   ═══════════════════════════════════════════════════════════════ */

function ProjectFormCard({ project: p }: { project: Project }) {
  const isNew = !p.title;
  const [expanded, setExpanded] = useState(isNew);

  return (
    <div className="rounded-2xl bg-surface-container-low overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-surface-container transition-colors"
      >
        <div className="min-w-0">
          <h3 className="type-title-md text-on-surface truncate">
            {p.title || "新しいプロジェクト"}
          </h3>
          <p className="type-body-sm text-on-surface-variant mt-0.5">
            {p.period ?? "期間不明"} — {p.role ?? "役割不明"}
          </p>
        </div>
        <span className="type-body-sm text-on-surface-variant shrink-0 ml-4">
          {expanded ? "▲" : "▼"}
        </span>
      </button>

      {expanded && (
        <div className="px-6 pb-8 space-y-6">
          {/* ── Required Fields ── */}
          <SectionDivider>必須項目</SectionDivider>

          <div className="grid gap-6 sm:grid-cols-2">
            <FormField label="プロジェクト名" required className="sm:col-span-2">
              <Input
                defaultValue={p.title}
                className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface"
              />
            </FormField>

            <FormField
              label="概要"
              required
              className="sm:col-span-2"
              method="AI生成"
            >
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

            <FormField label="チーム構成">
              <Input
                defaultValue={p.team ?? ""}
                placeholder="PdM 1・Des 2・Eng 4"
                className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface"
              />
            </FormField>

            <ImageField
              defaultValue={p.thumbnailUrl}
              label="サムネイル画像"
              aspectRatio="16/9"
              maxWidth="480px"
            />

            <FormField
              label="背景・課題"
              required
              className="sm:col-span-2"
              method="AI生成"
            >
              <Textarea
                defaultValue={p.background ?? ""}
                placeholder="プロジェクトの背景と解決すべき課題（2〜5文）"
                className="bg-surface-container-high border-none rounded-lg type-body-md text-on-surface min-h-24"
              />
            </FormField>
          </div>

          {/* ── Tags ── */}
          <SectionDivider>タグ</SectionDivider>

          <div className="grid gap-6 sm:grid-cols-3">
            <FormField label="ドメインタグ" required method="AI推定">
              <TagInput
                defaultValue={p.domainTags}
                placeholder="toB, SaaS, フィンテック..."
              />
            </FormField>

            <FormField label="フェーズタグ" required method="AI推定">
              <TagInput
                defaultValue={p.phaseTags}
                placeholder="0→1, グロース, 改善..."
                suggestions={[...PhaseTag]}
              />
            </FormField>

            <FormField label="スキルタグ" required method="AI推定">
              <TagInput
                defaultValue={p.skillTags}
                placeholder="UXリサーチ, UIデザイン..."
              />
            </FormField>
          </div>

          {/* ── Optional Fields ── */}
          <SectionDivider>任意項目</SectionDivider>

          <div className="grid gap-6 sm:grid-cols-2">
            <FormField label="課題リスト（箇条書き）" className="sm:col-span-2">
              <ListInput
                defaultValue={p.issues}
                placeholder="課題を1行ずつ入力"
              />
            </FormField>

            <FormField label="アプローチ（箇条書き）" className="sm:col-span-2">
              <ListInput
                defaultValue={p.approach}
                placeholder="手順を1行ずつ入力"
              />
            </FormField>

            <FormField label="主要な判断（箇条書き）" className="sm:col-span-2">
              <ListInput
                defaultValue={p.keyDecisions}
                placeholder="判断を1行ずつ入力"
              />
            </FormField>

            <FormField label="成果物" className="sm:col-span-2">
              <Textarea
                defaultValue={p.outputs ?? ""}
                placeholder="成果物の説明"
                className="bg-surface-container-high border-none rounded-lg type-body-md text-on-surface min-h-16"
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

            <FormField label="結果・インパクト" className="sm:col-span-2">
              <Textarea
                defaultValue={p.results ?? ""}
                placeholder="定量＋定性の結果"
                className="bg-surface-container-high border-none rounded-lg type-body-md text-on-surface min-h-16"
              />
            </FormField>

            <FormField label="定量成果（箇条書き）" className="sm:col-span-2">
              <ListInput
                defaultValue={p.metrics}
                placeholder="指標: before→after（変化率）"
              />
            </FormField>

            <FormField label="引用・声" className="sm:col-span-2">
              <Textarea
                defaultValue={p.quote ?? ""}
                placeholder="ユーザーやクライアントの声"
                className="bg-surface-container-high border-none rounded-lg type-body-md text-on-surface min-h-16"
              />
            </FormField>
          </div>

          {/* Action buttons */}
          <div
            className="flex gap-2 pt-4"
            style={{ borderTop: "1px solid var(--surface-container-high)" }}
          >
            <div className="flex-1" />
            <Button
              variant="ghost"
              size="sm"
              className="type-label-md text-error hover:bg-error-container rounded-lg"
            >
              削除
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   View Mode — Sub-components
   ═══════════════════════════════════════════════════════════════ */

function WorkHistoryRow({ item }: { item: WorkHistory }) {
  const startYear = item.periodStart
    ? new Date(item.periodStart).getFullYear()
    : "?";
  const endYear = item.isCurrent
    ? "現在"
    : item.periodEnd
      ? new Date(item.periodEnd).getFullYear()
      : "?";

  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6 rounded-xl bg-surface-container-low p-5 sm:p-6 transition-colors hover:bg-surface-container">
      <div className="sm:w-28 shrink-0 sm:text-right">
        <span className="type-label-md text-on-surface-variant">
          {startYear} – {endYear}
        </span>
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <p className="type-title-md text-on-surface">{item.company}</p>
        <p className="type-body-sm sm:type-body-md text-on-surface-variant">
          {item.role}
        </p>
        {item.description && (
          <p className="type-body-sm text-on-surface-variant mt-2">
            {item.description}
          </p>
        )}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {item.domainTags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="rounded-full border-none type-label-sm"
            >
              {tag}
            </Badge>
          ))}
          {item.employmentType && (
            <Badge
              variant="outline"
              className="rounded-full ghost-border type-label-sm"
            >
              {item.employmentType}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectCard({
  project: p,
  index,
  onClick,
}: {
  project: Project;
  index: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group block w-full text-left"
    >
      <article
        className={`rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer ${
          index === 0
            ? "bg-surface-container-low elevation-2"
            : "bg-surface-container-low elevation-1"
        }`}
      >
        {p.thumbnailUrl && (
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src={p.thumbnailUrl}
              alt={p.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-3 sm:p-8">
          <div className="sm:flex sm:items-start sm:justify-between sm:gap-4 mb-2 sm:mb-6">
            <div className="space-y-1 sm:space-y-2 flex-1">
              <h3 className="type-title-md sm:type-headline-md text-on-surface line-clamp-2">
                {p.title}
              </h3>
              <p className="hidden sm:block type-body-md text-on-surface-variant max-w-2xl">
                {p.overview}
              </p>
            </div>
            {p.period && (
              <span className="hidden sm:block type-label-sm text-on-surface-variant whitespace-nowrap">
                {p.period}
              </span>
            )}
          </div>

          <div className="hidden sm:flex flex-wrap items-center gap-x-6 gap-y-2 mb-6 type-body-sm text-on-surface-variant">
            {p.role && (
              <span>
                <span className="text-on-surface font-medium">Role:</span>{" "}
                {p.role}
              </span>
            )}
            {p.team && (
              <span>
                <span className="text-on-surface font-medium">Team:</span>{" "}
                {p.team}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-1 sm:gap-1.5">
            {p.domainTags.slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                className="rounded-full bg-surface-container-high text-on-surface-variant border-none type-label-sm"
              >
                {tag}
              </Badge>
            ))}
            {p.domainTags.slice(2).map((tag) => (
              <Badge
                key={tag}
                className="hidden sm:inline-flex rounded-full bg-surface-container-high text-on-surface-variant border-none type-label-sm"
              >
                {tag}
              </Badge>
            ))}
            {p.phaseTags.map((tag) => (
              <Badge
                key={tag}
                className="hidden sm:inline-flex rounded-full bg-primary-fixed-dim text-on-primary-fixed border-none type-label-sm"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {p.metrics.length > 0 && (
            <div
              className="hidden sm:flex mt-6 pt-6 flex-wrap gap-6"
              style={{
                borderTop: "1px solid var(--surface-container-high)",
              }}
            >
              {p.metrics.slice(0, 3).map((m) => (
                <div key={m} className="space-y-0.5">
                  <p className="type-title-md text-on-surface">
                    {m.split(":")[1]?.trim() ?? m}
                  </p>
                  <p className="type-label-sm text-on-surface-variant">
                    {m.split(":")[0]?.trim()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </article>
    </button>
  );
}

/* ── Project Modal Body ──────────────────────────────────── */

function ProjectModalBody({ project: p }: { project: Project }) {
  return (
    <div className="space-y-8 pt-2">
      {p.thumbnailUrl && (
        <div className="aspect-[16/9] rounded-xl overflow-hidden">
          <img
            src={p.thumbnailUrl}
            alt={p.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 type-body-sm text-on-surface-variant">
        {p.period && <span>{p.period}</span>}
        {p.role && (
          <span>
            <span className="text-on-surface font-medium">Role:</span> {p.role}
          </span>
        )}
        {p.team && (
          <span>
            <span className="text-on-surface font-medium">Team:</span> {p.team}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {p.domainTags.map((tag) => (
          <Badge
            key={tag}
            className="rounded-full bg-surface-container-high text-on-surface-variant border-none type-label-sm"
          >
            {tag}
          </Badge>
        ))}
        {p.phaseTags.map((tag) => (
          <Badge
            key={tag}
            className="rounded-full bg-primary-fixed-dim text-on-primary-fixed border-none type-label-sm"
          >
            {tag}
          </Badge>
        ))}
        {p.skillTags.map((tag) => (
          <Badge
            key={tag}
            className="rounded-full bg-secondary-container text-on-secondary-container border-none type-label-sm"
          >
            {tag}
          </Badge>
        ))}
      </div>

      {(p.background || p.issues.length > 0) && (
        <div className="grid gap-6 sm:grid-cols-2">
          {p.background && (
            <div className="rounded-xl bg-surface-container-low p-6 space-y-3">
              <h3 className="type-headline-sm text-on-surface">背景・課題</h3>
              <p className="type-body-md text-on-surface-variant">
                {p.background}
              </p>
            </div>
          )}
          {p.issues.length > 0 && (
            <div className="rounded-xl bg-surface-container-low p-6 space-y-3">
              <h3 className="type-headline-sm text-on-surface">課題</h3>
              <ul className="space-y-2">
                {p.issues.map((issue, i) => (
                  <li
                    key={i}
                    className="type-body-md text-on-surface-variant flex items-start gap-2"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {p.approach.length > 0 && (
        <div className="space-y-3">
          <h3 className="type-headline-sm text-on-surface">アプローチ</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {p.approach.map((step, i) => (
              <div
                key={i}
                className="rounded-lg bg-surface-container-low p-4 flex items-start gap-3"
              >
                <span className="type-title-md text-primary font-semibold shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="type-body-md text-on-surface-variant">{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {p.keyDecisions.length > 0 && (
        <div className="space-y-3">
          <h3 className="type-headline-sm text-on-surface">主要な判断</h3>
          <div className="space-y-2">
            {p.keyDecisions.map((decision, i) => (
              <div
                key={i}
                className="rounded-lg bg-surface-container-low p-4"
              >
                <p className="type-body-md text-on-surface-variant">
                  {decision}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {p.outputs && (
        <div className="space-y-3">
          <h3 className="type-headline-sm text-on-surface">成果物</h3>
          <div className="rounded-lg bg-surface-container-low p-4">
            <p className="type-body-md text-on-surface-variant">{p.outputs}</p>
          </div>
        </div>
      )}

      {(p.results || p.metrics.length > 0) && (
        <div className="rounded-xl bg-surface-container-low p-6 space-y-6">
          <h3 className="type-headline-sm text-on-surface">結果・インパクト</h3>

          {p.results && (
            <p className="type-body-md text-on-surface-variant">{p.results}</p>
          )}

          {p.metrics.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {p.metrics.map((m) => {
                const [label, value] = m.includes(":")
                  ? [m.split(":")[0].trim(), m.split(":")[1].trim()]
                  : ["", m];
                return (
                  <div
                    key={m}
                    className="rounded-lg bg-surface-container p-4 space-y-1"
                  >
                    <p className="type-title-md text-on-surface">{value}</p>
                    {label && (
                      <p className="type-label-sm text-on-surface-variant">
                        {label}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {p.quote && (
            <blockquote
              className="mt-2 pl-4 type-body-md text-on-surface-variant italic"
              style={{ borderLeft: "3px solid var(--primary)" }}
            >
              {p.quote}
            </blockquote>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Icons
   ═══════════════════════════════════════════════════════════════ */

function PencilIcon() {
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
    >
      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function UploadIcon() {
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
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

