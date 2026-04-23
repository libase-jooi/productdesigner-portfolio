import { useState } from "react";
import { useParams, Link } from "react-router-dom";
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
import { SkillChatPanel, SkillChatToggle } from "@/features/designer/components/SkillChatPanel";
import { getMockDesigner, getMockDesignerBySlug } from "@/api/mock";
import type { Project, WorkHistory, SocialLinks, SkillScores, SubSkillScores } from "@/api/schema";
import { EmploymentType, PhaseTag, AvailabilityStatus } from "@/api/schema";

type PageMode = "view" | "edit" | "confirm";

export function DesignerDetailPage() {
  const { designerId, slug } = useParams<{
    designerId?: string;
    slug?: string;
  }>();
  const data = slug
    ? getMockDesignerBySlug(slug)
    : getMockDesigner(designerId ?? "");

  const [mode, setMode] = useState<PageMode>("view");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [isPublished, setIsPublished] = useState(data?.publishedAt !== null);
  const [editingSlug, setEditingSlug] = useState(false);
  const [slugValue, setSlugValue] = useState(data?.slug ?? "");
  const [workHistoryList, setWorkHistoryList] = useState<WorkHistory[]>(data?.workHistory ?? []);
  const [projectList, setProjectList] = useState<Project[]>(data?.projects ?? []);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const selectedProject =
    selectedProjectIndex !== null ? projectList[selectedProjectIndex] ?? null : null;

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
                {data.availabilityStatus && (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary/15 border border-tertiary/30">
                      <span className="h-2.5 w-2.5 rounded-full bg-tertiary shrink-0" />
                      <span className="type-label-md text-tertiary font-semibold">
                        {data.availabilityStatus}
                      </span>
                    </span>
                    {data.availabilityNote && (
                      <span className="type-body-sm text-on-surface-variant">
                        {data.availabilityNote}
                      </span>
                    )}
                  </div>
                )}
                {data.socialLinks && (
                  <SocialLinksRow links={data.socialLinks} />
                )}
              </div>
            </div>

            {data.bio && (
              <p className="type-body-md sm:type-body-lg text-on-surface-variant leading-relaxed">
                {data.bio}
              </p>
            )}

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

          {/* ── Skill Radar Chart (collapsible) ──────────── */}
          {data.skillScores && (
            <SkillRadarSection scores={data.skillScores} subSkillScores={data.subSkillScores} />
          )}

          {/* ── Skill Check Link ──────────────────────────── */}
          {mode === "view" && (
            <div className="flex justify-center">
              <Link to={`/designers/${data.id}/skill-check`}>
                <Button
                  variant="outline"
                  className="rounded-full border-primary text-primary hover:bg-primary/8 type-label-md px-6"
                >
                  スキル診断を受ける
                </Button>
              </Link>
            </div>
          )}

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
                    onClick={() => setSelectedProjectIndex(i)}
                  />
                ))}
              </div>
            )}
          </section>

              {/* ── Project Detail Modal ─────────────────────── */}
              <Dialog
                open={selectedProject !== null}
                onOpenChange={(open) => {
                  if (!open) setSelectedProjectIndex(null);
                }}
              >
                {selectedProject && (
                  <DialogContent className="sm:max-w-3xl max-h-[85vh] flex flex-col p-0">
                    <DialogHeader className="shrink-0 p-4 sm:p-6 pb-0 sm:pb-0 pr-12">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1 rounded-md bg-surface-container-high px-2 py-0.5 type-label-sm text-on-surface-variant">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                          Proto Design
                        </span>
                        <ShareUrlButton slug={data?.slug} designerId={data?.id} />
                      </div>
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

                      {/* ── Prev / Next Navigation ── */}
                      {projectList.length > 1 && (
                        <div
                          className="flex items-center justify-between mt-8 pt-6"
                          style={{
                            borderTop: "1px solid var(--surface-container-high)",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedProjectIndex((i) =>
                                i !== null && i > 0 ? i - 1 : i
                              )
                            }
                            disabled={selectedProjectIndex === 0}
                            className="flex items-center gap-2 type-label-lg text-primary disabled:text-on-surface-variant/40 disabled:cursor-not-allowed transition-colors hover:text-primary/80"
                          >
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
                              <path d="m15 18-6-6 6-6" />
                            </svg>
                            前へ
                          </button>

                          <span className="type-label-sm text-on-surface-variant">
                            {selectedProjectIndex! + 1} / {projectList.length}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedProjectIndex((i) =>
                                i !== null && i < projectList.length - 1
                                  ? i + 1
                                  : i
                              )
                            }
                            disabled={
                              selectedProjectIndex === projectList.length - 1
                            }
                            className="flex items-center gap-2 type-label-lg text-primary disabled:text-on-surface-variant/40 disabled:cursor-not-allowed transition-colors hover:text-primary/80"
                          >
                            次へ
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
                              <path d="m9 18 6-6-6-6" />
                            </svg>
                          </button>
                        </div>
                      )}
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

              <FormField label="自己紹介" className="sm:col-span-2">
                <Textarea
                  defaultValue={data.bio ?? ""}
                  placeholder="3〜5行で自己紹介を記入"
                  className="bg-surface-container-high border-none rounded-lg type-body-md text-on-surface min-h-24"
                />
              </FormField>

              <FormField label="稼働状況">
                <NativeSelect
                  defaultValue={data.availabilityStatus ?? ""}
                  options={["", ...AvailabilityStatus]}
                  placeholder="選択してください"
                />
              </FormField>

              <FormField label="稼働状況の補足">
                <Input
                  defaultValue={data.availabilityNote ?? ""}
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
                <Input
                  defaultValue={data.socialLinks?.x ?? ""}
                  placeholder="https://x.com/..."
                  type="url"
                  className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface"
                />
              </FormField>
              <FormField label="note">
                <Input
                  defaultValue={data.socialLinks?.note ?? ""}
                  placeholder="https://note.com/..."
                  type="url"
                  className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface"
                />
              </FormField>
              <FormField label="LinkedIn">
                <Input
                  defaultValue={data.socialLinks?.linkedin ?? ""}
                  placeholder="https://linkedin.com/in/..."
                  type="url"
                  className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface"
                />
              </FormField>
              <FormField label="GitHub">
                <Input
                  defaultValue={data.socialLinks?.github ?? ""}
                  placeholder="https://github.com/..."
                  type="url"
                  className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface"
                />
              </FormField>
              <FormField label="Dribbble">
                <Input
                  defaultValue={data.socialLinks?.dribbble ?? ""}
                  placeholder="https://dribbble.com/..."
                  type="url"
                  className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface"
                />
              </FormField>
              <FormField label="Behance">
                <Input
                  defaultValue={data.socialLinks?.behance ?? ""}
                  placeholder="https://behance.net/..."
                  type="url"
                  className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface"
                />
              </FormField>
              <FormField label="個人サイト" className="sm:col-span-2">
                <Input
                  defaultValue={data.socialLinks?.website ?? ""}
                  placeholder="https://..."
                  type="url"
                  className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface"
                />
              </FormField>
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

          {/* ── Skill Chat Agent ─────────────────────────── */}
          {!chatOpen && <SkillChatToggle onClick={() => setChatOpen(true)} />}
          {chatOpen && <SkillChatPanel onClose={() => setChatOpen(false)} />}
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
              <ConfirmRow
                label="自己紹介"
                value={data.bio ?? "未設定"}
                className="sm:col-span-2"
              />
              <ConfirmRow
                label="稼働状況"
                value={data.availabilityStatus ?? "未設定"}
              />
              <ConfirmRow
                label="稼働状況の補足"
                value={data.availabilityNote ?? "未設定"}
              />
              <ConfirmRow
                label="SNSリンク"
                value={
                  data.socialLinks
                    ? Object.values(data.socialLinks).filter(Boolean).length + "件 設定済み"
                    : "未設定"
                }
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

function ConfirmRow({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={`space-y-0.5 ${className ?? ""}`}>
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

/* ── Share URL Button ───────────────────────────────────── */

function ShareUrlButton({ slug, designerId }: { slug?: string | null; designerId?: string }) {
  const [copied, setCopied] = useState(false);

  const publicPath = slug ? `/p/${slug}` : designerId ? `/designers/${designerId}` : null;
  if (!publicPath) return null;

  const fullUrl = `${window.location.origin}${publicPath}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 type-label-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
      title={fullUrl}
    >
      {copied ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          コピー済み
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          URLをコピー
        </>
      )}
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

/* ═══════════════════════════════════════════════════════════════
   Skill Radar (collapsible)
   ═══════════════════════════════════════════════════════════════ */

const SKILL_AXES: {
  key: keyof SkillScores;
  label: string;
  shortLabel: string;
  subSkills: {
    key: string;
    name: string;
    levels: string[]; // index 0 = Lv1, index 4 = Lv5
  }[];
}[] = [
  {
    key: "strategyDesign",
    label: "ビジネス推進力",
    shortLabel: "ビジネス",
    subSkills: [
      { key: "strategyPlanning", name: "戦略設計", levels: ["戦略設計に関わっていない", "事業戦略を理解し、自分の担当範囲に照らして考えられる", "事業戦略をプロダクト方針に翻訳できる", "事業インパクトから逆算し、戦略と施策の一貫性を担保できる", "事業戦略の立案に関与し、チーム全体に浸透させられる"] },
      { key: "decisionDesign", name: "意思決定設計", levels: ["指示や既存ルールに従って判断できる", "判断の理由を自分の言葉で説明できる", "情報不十分でも暫定判断でき、根拠と前提を明示できる", "リスクとリターンを踏まえて構造的に判断できる", "判断の仕組み自体を設計し、チームに適用できる"] },
      { key: "stakeholderMgmt", name: "合意形成", levels: ["指示された内容を共有できる", "必要な相手に状況を説明できる", "関係者の状況を把握し、判断材料を構造化して提示できる", "対立する要件を整理し、落としどころを見つけられる", "複雑な利害関係を整理し、意思決定の場を設計できる"] },
      { key: "hypothesisTesting", name: "仮説検証", levels: ["指示された検証を実行できる", "シンプルな仮説を立てて試せる", "検証から学びを得て次に進められる", "検証を回し続けて改善を進められる", "検証サイクルの仕組みを設計し、チームの学習速度を高められる"] },
      { key: "kpiMgmt", name: "KPIマネジメント", levels: ["KPI設計に関わっていない", "設定されたKPIをもとに自分の範囲で動ける", "KPIと施策を接続して考え、実行可能な形に分解できる", "実行結果を定量的に計測し、改善を回せる", "KPI設計から改善サイクルまで一貫して設計できる"] },
    ],
  },
  {
    key: "research",
    label: "課題設定力",
    shortLabel: "課題設定",
    subSkills: [
      { key: "domainUnderstanding", name: "ドメイン理解", levels: ["与えられた情報を理解できる", "事業や競合を整理できる", "プロダクトの立ち位置を説明できる", "機会とリスクを見極められる", "事業の方向性に提案できる"] },
      { key: "userUnderstanding", name: "ユーザー理解", levels: ["共有されたユーザー情報を受け取って理解できる", "インタビューやデータ分析でユーザーの行動を捉えられる", "定性・定量を組み合わせ、ユーザーの文脈まで理解できる", "複数の手法を使い分けて設計判断に活かせる", "ユーザー理解の計画を設計し、チーム全体に還元できる"] },
      { key: "insightExtraction", name: "インサイト抽出", levels: ["事実を整理できる", "仮説を言葉にできる", "行動の裏にある動機を解釈し、背景を掘り下げられる", "複数の情報源から構造として課題を理解できる", "課題の構造を描いてチームの判断に活かせる"] },
      { key: "problemStructuring", name: "課題構造化", levels: ["課題定義に関わっていない", "与えられた課題に対応できる", "仮説をもとに課題を定義できる", "課題の関係を踏まえて定義できる", "本質課題を特定し、チームが共有できる形で構造化できる"] },
      { key: "priorityDesign", name: "優先度設計", levels: ["決められた優先度に沿って進められる", "複数の選択肢から優先度を判断し、理由を説明できる", "ユーザー価値と事業価値の両方を踏まえて判断できる", "実現性・リソースも含めた多角的な観点で判断できる", "優先度の前提を問い直し、事業の意思決定に影響を与えられる"] },
    ],
  },
  {
    key: "uxDesign",
    label: "UX設計力",
    shortLabel: "UX設計",
    subSkills: [
      { key: "experienceConcept", name: "体験コンセプト設計", levels: ["体験コンセプトの設計に関わっていない", "提示されたコンセプト案にフィードバックや修正ができる", "利用シナリオを設計し、体験の方向性を定義できる", "理想的な体験を描き、事業・ユーザー両面で一貫性を担保できる", "複数タッチポイントの体験の一貫性を設計できる"] },
      { key: "informationDesign", name: "情報設計", levels: ["情報設計を主導した経験がない", "基本的な構造や分類を設計できる", "ユーザーに合わせて構造を設計できる", "複雑な構造を整理して設計できる", "構造設計の考え方を横断的に適用できる"] },
      { key: "flowDesign", name: "導線設計", levels: ["導線設計を主導した経験がない", "単一のフローを設計できる", "複数の導線を整合して設計できる", "状態や分岐を踏まえて設計できる", "プロダクト全体の導線構造を設計できる"] },
      { key: "interactionDesign", name: "インタラクション設計", levels: ["基本的なUIパターンを参照して画面を作れる", "認知負荷を意識し、シンプルなインタラクションを設計できる", "フィードバックや状態変化を適切に設計できる", "複雑な操作でも直感的に使えるフローを設計できる", "インタラクション設計の原則をプロダクト全体に適用できる"] },
      { key: "usabilityImprovement", name: "ユーザビリティ改善", levels: ["ユーザビリティ評価や改善提案に関わっていない", "指摘された問題に対して改善案を出せる", "自分でユーザビリティ上の問題を発見し、改善提案できる", "問題の根本原因を特定し、再発を防げる", "ユーザビリティ評価の仕組みをプロセスに組み込める"] },
      { key: "stateDesign", name: "状態・例外設計", levels: ["状態設計を主導した経験がない", "基本的な状態（空・エラー）を設計できる", "主要な状態を整理して設計できる", "分岐や例外を含めて設計できる", "状態設計のルールを定義できる"] },
      { key: "accessibilityDesign", name: "アクセシビリティ", levels: ["アクセシビリティ設計に関わっていない", "基本的な配慮（色・サイズ）を反映できる", "多様な利用環境を考慮して設計できる", "課題を見つけて改善できる", "基準として設計に組み込める"] },
    ],
  },
  {
    key: "uiImplementation",
    label: "画面設計・実装運用力",
    shortLabel: "画面設計",
    subSkills: [
      { key: "designSystem", name: "デザインシステム", levels: ["デザインシステムの設計や運用に関わっていない", "既存のコンポーネントを使って画面を作れる", "コンポーネントの作成や整理を自分で行える", "運用ルールを定め、チームに浸透させられる", "プロダクトの成長に合わせてデザインシステムを進化させられる"] },
      { key: "structuralDesign", name: "構造設計", levels: ["構造設計を主導した経験がない", "基本的な画面構造や遷移を設計できる", "情報の優先度を踏まえて構造を設計できる", "複数の条件を踏まえて設計できる", "構造設計の考え方を横断的に適用できる"] },
      { key: "visualDesign", name: "表層設計", levels: ["ビジュアル設計を主導した経験がない", "ガイドラインに沿って画面を作れる", "細かい表現まで自分で作り込める", "プロダクト全体で一貫した見た目にできる", "ビジュアルの方向性とルールを定義し適用できる"] },
      { key: "devCollaboration", name: "実装連携", levels: ["実装連携を主導した経験がない", "デザインを共有し、必要な情報を渡せる", "制約を踏まえて調整しながら連携できる", "実装結果を見て改善提案ができる", "デザインと実装の進め方を設計できる"] },
      { key: "prototyping", name: "プロトタイピング", levels: ["プロトタイピングや実装にほとんど関わっていない", "基本的なプロトタイプを作れる", "動きのあるプロトタイプや簡単な実装ができる", "実装に近い形で検証できる", "実装を踏まえて設計をリードできる"] },
      { key: "operationDesign", name: "運用設計", levels: ["改善プロセスの設計や運用に関わっていない", "改善タスクを整理・管理できる", "改善サイクルを自分で回せる", "チームで改善を回せる状態を作れる", "継続的に改善が回る仕組みを設計できる"] },
    ],
  },
  {
    key: "aiUtilization",
    label: "AI活用力",
    shortLabel: "AI活用",
    subSkills: [
      { key: "aiInfoGathering", name: "情報収集", levels: ["ほとんど追っていない", "主要なツールやトレンドを把握している", "継続的に情報を追い、自分の業務に取り入れている", "活用の可能性を評価し、業務フローに取り入れている", "チームやプロダクトに影響する形で活用を広げている"] },
      { key: "aiToolSelection", name: "ツール選定", levels: ["ツールをうまく使えない", "指定されたツールを使って作業できる", "目的に応じて複数ツールを使い分けられる", "業務フローに組み込んで活用できる", "最適なツール構成を設計し、活用を広げられる"] },
      { key: "promptDesign", name: "プロンプト設計", levels: ["出力が安定せず、使いこなせていない", "基本的な指示で意図した出力を得られる", "目的に応じてプロンプトを調整できる", "安定した品質で出力をコントロールできる", "再現性のあるプロンプト設計ができる"] },
      { key: "aiProcessIntegration", name: "業務プロセス統合", levels: ["ほとんど業務に組み込めていない", "一部の作業で補助的に使っている", "複数の工程で活用している", "業務フローに組み込んでいる", "チーム全体の生産性を変えるレベルで活用している"] },
    ],
  },
];

function SkillRadarSection({ scores, subSkillScores }: { scores: SkillScores; subSkillScores: SubSkillScores | null }) {
  return (
    <section className="rounded-2xl border border-outline-variant bg-surface-container-low p-6 sm:p-8 space-y-6 sm:space-y-8">
      <h2 className="type-headline-md sm:type-headline-lg text-on-surface">
        スキル診断
      </h2>
      <SkillRadarChart scores={scores} subSkillScores={subSkillScores} />
    </section>
  );
}

function SkillRadarChart({ scores, subSkillScores }: { scores: SkillScores; subSkillScores: SubSkillScores | null }) {
  const cx = 150;
  const cy = 150;
  const maxR = 100;
  const levels = 5;
  const axes = SKILL_AXES.length;

  const angleStep = (2 * Math.PI) / axes;
  const startAngle = -Math.PI / 2;

  const getPoint = (index: number, value: number) => {
    const angle = startAngle + index * angleStep;
    const r = (value / levels) * maxR;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  const gridPaths = Array.from({ length: levels }, (_, level) => {
    const r = ((level + 1) / levels) * maxR;
    const points = Array.from({ length: axes }, (_, i) => {
      const angle = startAngle + i * angleStep;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    });
    return points.join(" ");
  });

  const dataPoints = SKILL_AXES.map((axis, i) =>
    getPoint(i, scores[axis.key])
  );
  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  const labelPoints = SKILL_AXES.map((_, i) => {
    const angle = startAngle + i * angleStep;
    const r = maxR + 40;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  });

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
      <div className="shrink-0">
        <svg viewBox="-10 -10 320 320" className="w-64 h-64 sm:w-72 sm:h-72">
          {gridPaths.map((points, i) => (
            <polygon
              key={i}
              points={points}
              fill="none"
              stroke="var(--outline-variant)"
              strokeWidth="0.5"
              opacity={0.4}
            />
          ))}

          {SKILL_AXES.map((_, i) => {
            const p = getPoint(i, levels);
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={p.x}
                y2={p.y}
                stroke="var(--outline-variant)"
                strokeWidth="0.5"
                opacity={0.3}
              />
            );
          })}

          <polygon
            points={dataPolygon}
            fill="var(--primary)"
            fillOpacity={0.15}
            stroke="var(--primary)"
            strokeWidth="2"
          />

          {dataPoints.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={4}
              fill="var(--primary)"
            />
          ))}

          {labelPoints.map((p, i) => (
            <text
              key={i}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="var(--on-surface-variant)"
              fontSize="11"
              fontWeight="500"
            >
              {SKILL_AXES[i].shortLabel}
            </text>
          ))}

          {dataPoints.map((p, i) => {
            const angle = startAngle + i * angleStep;
            const offsetR = 14;
            return (
              <text
                key={`score-${i}`}
                x={p.x + offsetR * Math.cos(angle)}
                y={p.y + offsetR * Math.sin(angle)}
                textAnchor="middle"
                dominantBaseline="central"
                fill="var(--primary)"
                fontSize="10"
                fontWeight="600"
              >
                {scores[SKILL_AXES[i].key]}
              </text>
            );
          })}
        </svg>
      </div>

      <SkillDetailList scores={scores} subSkillScores={subSkillScores} />
    </div>
  );
}

function SkillDetailList({ scores, subSkillScores }: { scores: SkillScores; subSkillScores: SubSkillScores | null }) {
  const [expandedAxes, setExpandedAxes] = useState<Record<string, boolean>>({});

  const toggleAxis = (key: string) => {
    setExpandedAxes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex-1 w-full space-y-3">
      {/* 5軸バー：常に上部に表示 */}
      <div className="space-y-2">
        {SKILL_AXES.map((axis) => (
          <button
            key={axis.key}
            type="button"
            onClick={() => toggleAxis(axis.key)}
            className={`flex items-center gap-2 w-full px-4 py-3 rounded-xl border bg-surface transition-colors ${
              expandedAxes[axis.key]
                ? "border-primary/30 bg-primary/5"
                : "border-outline-variant hover:bg-surface-container-low"
            }`}
          >
            <span className="type-label-md text-on-surface shrink-0 w-28 sm:w-40 text-left">
              {axis.label}
            </span>
            <div className="flex-1 flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full ${
                    i < scores[axis.key]
                      ? "bg-primary"
                      : "bg-surface-container-high"
                  }`}
                />
              ))}
            </div>
            <span className="type-label-md text-primary font-semibold w-6 text-right">
              {scores[axis.key]}
            </span>
            <span className={`text-on-surface-variant transition-transform text-xs ${expandedAxes[axis.key] ? "rotate-180" : ""}`}>▼</span>
          </button>
        ))}
      </div>

      {/* 展開された詳細：軸バーの下に表示 */}
      {SKILL_AXES.map((axis) =>
        expandedAxes[axis.key] ? (
          <div key={axis.key} className="space-y-1.5">
            <h3 className="type-label-md text-on-surface font-semibold px-1">{axis.label}</h3>
            <div className="rounded-xl border border-outline-variant/50 bg-surface-container divide-y divide-outline-variant/30">
              {axis.subSkills.map((sub) => {
                const level = subSkillScores?.[sub.key] ?? null;
                return (
                  <div
                    key={sub.key}
                    className="flex items-start gap-2 px-4 py-2.5"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/50 shrink-0 mt-1.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="type-label-sm text-on-surface">
                          {sub.name}
                        </span>
                        {level !== null && (
                          <span className="type-label-sm text-primary font-semibold">
                            Lv.{level}
                          </span>
                        )}
                      </div>
                      {level !== null && (
                        <p className="type-body-sm text-on-surface-variant">
                          {sub.levels[level - 1]}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Social Links Row
   ═══════════════════════════════════════════════════════════════ */

const SOCIAL_META: Record<
  keyof SocialLinks,
  { label: string; icon: React.ReactNode }
> = {
  x: {
    label: "X",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  note: {
    label: "note",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
      </svg>
    ),
  },
  linkedin: {
    label: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  github: {
    label: "GitHub",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  dribbble: {
    label: "Dribbble",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308a10.29 10.29 0 004.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4a10.161 10.161 0 006.29 2.166c1.42 0 2.77-.29 4-.815zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248A95.525 95.525 0 008.334 4.2C6.15 5.528 4.52 7.58 3.96 10.012zm9.56-7.205c1.305 1.8 2.58 3.77 3.4 5.395 3.24-1.215 4.615-3.06 4.795-3.33A10.197 10.197 0 0012.09 2.22c-.15 0-.3.015-.45.022zM21.81 7.16c-.21.3-1.74 2.235-5.1 3.615.24.49.47.985.68 1.485.075.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.225-.78-4.275-2.1-5.965z" />
      </svg>
    ),
  },
  behance: {
    label: "Behance",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.485.61.41.28.733.65.96 1.12.225.47.34 1.05.34 1.73 0 .74-.17 1.36-.507 1.86-.338.5-.837.9-1.502 1.22.906.26 1.576.72 2.022 1.37.448.66.665 1.45.665 2.36 0 .75-.13 1.39-.41 1.93-.28.55-.67 1-1.16 1.35-.48.348-1.05.6-1.67.767-.62.16-1.26.25-1.92.25H0v-14.8h6.938zm-.71 5.87c.55 0 1.01-.15 1.39-.45.38-.3.56-.73.56-1.29 0-.32-.06-.58-.17-.78-.11-.2-.27-.36-.47-.48-.2-.12-.43-.2-.68-.25-.25-.05-.52-.07-.8-.07H3.24v3.33h2.99zm.18 6.12c.3 0 .59-.03.87-.09.28-.06.53-.17.74-.3.21-.14.38-.33.51-.57.13-.24.19-.54.19-.9 0-.72-.22-1.24-.65-1.55-.43-.32-.99-.48-1.7-.48H3.24v3.87h3.13zM15.82 17.2c.5.49 1.2.74 2.12.74.65 0 1.21-.16 1.68-.49.47-.33.78-.7.93-1.12h3.06c-.5 1.55-1.27 2.67-2.29 3.36-1.03.7-2.28 1.04-3.73 1.04-1.01 0-1.93-.17-2.75-.5-.83-.33-1.53-.8-2.11-1.4-.59-.6-1.04-1.32-1.36-2.14-.32-.82-.49-1.73-.49-2.73 0-.97.16-1.86.49-2.67.33-.81.79-1.52 1.37-2.11.59-.59 1.28-1.06 2.1-1.38.81-.33 1.7-.49 2.65-.49 1.07 0 2.01.21 2.8.62.79.42 1.44 1 1.94 1.7.5.71.87 1.52 1.1 2.43.24.91.32 1.88.23 2.92H15.07c.05.98.39 1.73.75 2.22zm3.68-6.3c-.39-.43-1-.64-1.82-.64-.53 0-.97.1-1.32.29-.35.19-.63.43-.83.73-.2.3-.34.61-.41.97-.07.34-.11.65-.13.95h5.1c-.1-.87-.39-1.55-.6-2.3zM15.54 4.16h6.09v1.78h-6.09z" />
      </svg>
    ),
  },
  website: {
    label: "Website",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
};

function SocialLinksRow({ links }: { links: SocialLinks }) {
  const entries = (Object.keys(SOCIAL_META) as (keyof SocialLinks)[]).filter(
    (k) => links[k]
  );
  if (entries.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      {entries.map((key) => (
        <a
          key={key}
          href={links[key]!}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center h-8 w-8 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
          title={SOCIAL_META[key].label}
        >
          {SOCIAL_META[key].icon}
        </a>
      ))}
    </div>
  );
}

