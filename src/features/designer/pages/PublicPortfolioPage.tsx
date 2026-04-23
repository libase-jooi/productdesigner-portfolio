import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { EmptyState } from "@/shared/components/EmptyState";
import { getMockDesignerBySlug } from "@/api/mock";
import type { Project, WorkHistory, SocialLinks, SkillScores } from "@/api/schema";

export function PublicPortfolioPage() {
  const { slug } = useParams<{ slug: string }>();
  const data = getMockDesignerBySlug(slug ?? "");

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <EmptyState
          title="ポートフォリオが見つかりません"
          description="URLが正しいか確認してください。"
        />
      </div>
    );
  }

  const selectedProject =
    selectedIndex !== null ? data.projects[selectedIndex] ?? null : null;

  const goToPrev = () => {
    setSelectedIndex((i) =>
      i !== null && i > 0 ? i - 1 : i
    );
  };
  const goToNext = () => {
    setSelectedIndex((i) =>
      i !== null && i < data.projects.length - 1 ? i + 1 : i
    );
  };

  // 非公開チェック
  if (!data.publishedAt) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <EmptyState
          title="このポートフォリオは非公開です"
          description="オーナーが公開設定にすると閲覧できるようになります。"
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
                <span className="h-2 w-2 rounded-full bg-tertiary shrink-0" />
                <span className="type-label-md text-on-surface">
                  {data.availabilityStatus}
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

      {/* ── Skill Radar Chart ─────────────────────────── */}
      {data.skillScores && (
        <section className="space-y-6 sm:space-y-8">
          <h2 className="type-headline-md sm:type-headline-lg text-on-surface">
            スキル診断
          </h2>
          <SkillRadarChart scores={data.skillScores} />
        </section>
      )}

      {/* ── Content ──────────────────────────────────── */}
      {data.workHistory.length === 0 && data.projects.length === 0 ? (
        <EmptyState
          title="コンテンツはまだありません"
          description="オーナーがポートフォリオを追加すると表示されます。"
        />
      ) : (
        <>
          {/* ── Work History ─────────────────────────────── */}
          {data.workHistory.length > 0 && (
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
          )}

          {/* ── Projects ─────────────────────────────────── */}
          {data.projects.length > 0 && (
            <section className="space-y-6 sm:space-y-10">
              <h2 className="type-headline-md sm:type-headline-lg text-on-surface">
                プロジェクト
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
                {data.projects.map((p, i) => (
                  <ProjectCard
                    key={p.id}
                    project={p}
                    index={i}
                    onClick={() => setSelectedIndex(i)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* ── Project Detail Modal ─────────────────────── */}
          <Dialog
            open={selectedProject !== null}
            onOpenChange={(open) => {
              if (!open) setSelectedIndex(null);
            }}
          >
            {selectedProject && selectedIndex !== null && (
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

                  {/* ── Prev / Next Navigation ── */}
                  {data.projects.length > 1 && (
                    <div
                      className="flex items-center justify-between mt-8 pt-6"
                      style={{
                        borderTop: "1px solid var(--surface-container-high)",
                      }}
                    >
                      <button
                        type="button"
                        onClick={goToPrev}
                        disabled={selectedIndex === 0}
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
                        <span className="hidden sm:inline">
                          {selectedIndex > 0
                            ? data.projects[selectedIndex - 1].title
                            : "前のプロジェクト"}
                        </span>
                        <span className="sm:hidden">前へ</span>
                      </button>

                      <span className="type-label-sm text-on-surface-variant">
                        {selectedIndex + 1} / {data.projects.length}
                      </span>

                      <button
                        type="button"
                        onClick={goToNext}
                        disabled={selectedIndex === data.projects.length - 1}
                        className="flex items-center gap-2 type-label-lg text-primary disabled:text-on-surface-variant/40 disabled:cursor-not-allowed transition-colors hover:text-primary/80"
                      >
                        <span className="hidden sm:inline">
                          {selectedIndex < data.projects.length - 1
                            ? data.projects[selectedIndex + 1].title
                            : "次のプロジェクト"}
                        </span>
                        <span className="sm:hidden">次へ</span>
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
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   View Sub-components (same as DesignerDetailPage view mode)
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
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {p.metrics.map((m) => (
                <div
                  key={m}
                  className="rounded-lg bg-surface-container p-4 space-y-1"
                >
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
      )}

      {p.quote && (
        <blockquote className="rounded-xl bg-tertiary-container/30 p-6 border-l-4 border-tertiary">
          <p className="type-body-md text-on-surface italic">"{p.quote}"</p>
        </blockquote>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Skill Radar Chart (SVG)
   ═══════════════════════════════════════════════════════════════ */

const SKILL_AXES: { key: keyof SkillScores; label: string; shortLabel: string }[] = [
  { key: "strategyDesign", label: "戦略設計力", shortLabel: "戦略" },
  { key: "research", label: "リサーチ力", shortLabel: "リサーチ" },
  { key: "uxDesign", label: "UX設計力", shortLabel: "UX設計" },
  { key: "uiImplementation", label: "画面設計・実装運用力", shortLabel: "画面設計" },
  { key: "aiUtilization", label: "AI活用力", shortLabel: "AI活用" },
];

function SkillRadarChart({ scores }: { scores: SkillScores }) {
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
    const r = maxR + 32;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  });

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
      <div className="shrink-0">
        <svg viewBox="0 0 300 300" className="w-64 h-64 sm:w-72 sm:h-72">
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

      <div className="flex-1 space-y-3 w-full">
        {SKILL_AXES.map((axis) => (
          <div key={axis.key} className="flex items-center gap-3">
            <div className="flex items-center gap-2 w-full">
              <span className="type-label-md text-on-surface shrink-0 w-28 sm:w-40">
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
