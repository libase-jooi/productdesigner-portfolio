import { useState } from "react";
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
import type { Project, WorkHistory } from "@/api/schema";

export function PublicPortfolioPage() {
  const { slug } = useParams<{ slug: string }>();
  const data = getMockDesignerBySlug(slug ?? "");

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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
                    onClick={() => setSelectedProject(p)}
                  />
                ))}
              </div>
            </section>
          )}

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
