import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { getProjectById } from "@/api/supabase";
import type { Project, DesignerWithRelations } from "@/api/schema";

export function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [result, setResult] = useState<{ project: Project; designer: DesignerWithRelations } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;
    getProjectById(projectId).then(setResult).finally(() => setLoading(false));
  }, [projectId]);

  if (loading) return <div className="py-20 text-center"><p className="type-body-md text-on-surface-variant">読み込み中...</p></div>;

  if (!result) {
    return (
      <div className="py-20 text-center">
        <p className="type-headline-md text-on-surface-variant">
          プロジェクトが見つかりません
        </p>
      </div>
    );
  }

  const { project: p, designer: d } = result;

  return (
    <div className="space-y-16 pb-20">
      {/* Breadcrumb */}
      <div className="pt-8 flex items-center gap-3 type-label-sm text-on-surface-variant">
        <Link to="/dashboard" className="hover:text-primary transition-colors">
          Designers
        </Link>
        <span>/</span>
        <Link
          to={`/designers/${d.slug}`}
          className="hover:text-primary transition-colors"
        >
          {d.name}
        </Link>
        <span>/</span>
        <span className="text-on-surface truncate max-w-[200px]">{p.title}</span>
      </div>

      {/* Hero */}
      <section className="max-w-3xl space-y-4">
        <h1 className="type-display-sm text-on-surface">{p.title}</h1>
        {p.overview && (
          <p className="type-body-lg text-on-surface-variant">{p.overview}</p>
        )}

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 type-body-sm text-on-surface-variant">
          {p.period && <span>{p.period}</span>}
          {p.role && <span>{p.role}</span>}
          {p.team && <span>{p.team}</span>}
        </div>

        <div className="flex flex-wrap gap-1.5 pt-2">
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
      </section>

      {/* Background & Issues */}
      {(p.background || p.issues.length > 0) && (
        <section className="grid gap-8 lg:grid-cols-2">
          {p.background && (
            <div className="rounded-2xl bg-surface-container-low p-8 space-y-3">
              <h2 className="type-headline-sm text-on-surface">背景・課題</h2>
              <p className="type-body-md text-on-surface-variant">{p.background}</p>
            </div>
          )}
          {p.issues.length > 0 && (
            <div className="rounded-2xl bg-surface-container-low p-8 space-y-3">
              <h2 className="type-headline-sm text-on-surface">課題</h2>
              <ul className="space-y-2">
                {p.issues.map((issue, i) => (
                  <li key={i} className="type-body-md text-on-surface-variant flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* Approach */}
      {p.approach.length > 0 && (
        <section className="space-y-4">
          <h2 className="type-headline-md text-on-surface">アプローチ</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {p.approach.map((step, i) => (
              <div
                key={i}
                className="rounded-xl bg-surface-container-low p-5 flex items-start gap-3"
              >
                <span className="type-title-md text-primary font-semibold shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="type-body-md text-on-surface-variant">{step}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Key Decisions */}
      {p.keyDecisions.length > 0 && (
        <section className="space-y-4">
          <h2 className="type-headline-md text-on-surface">主要な判断</h2>
          <div className="space-y-3">
            {p.keyDecisions.map((decision, i) => (
              <div
                key={i}
                className="rounded-xl bg-surface-container-low p-5 type-body-md text-on-surface-variant"
              >
                {decision}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Outputs */}
      {p.outputs && (
        <section className="space-y-4">
          <h2 className="type-headline-md text-on-surface">成果物</h2>
          <div className="rounded-xl bg-surface-container-low p-6">
            <p className="type-body-md text-on-surface-variant">{p.outputs}</p>
          </div>
        </section>
      )}

      {/* Results & Metrics */}
      {(p.results || p.metrics.length > 0) && (
        <section className="rounded-2xl bg-surface-container-low p-8 space-y-8">
          <h2 className="type-headline-md text-on-surface">
            結果・インパクト
          </h2>

          {p.results && (
            <p className="type-body-lg text-on-surface-variant">{p.results}</p>
          )}

          {p.metrics.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {p.metrics.map((m) => {
                const [label, value] = m.includes(":")
                  ? [m.split(":")[0].trim(), m.split(":")[1].trim()]
                  : ["", m];
                return (
                  <div
                    key={m}
                    className="rounded-xl bg-surface-container p-5 space-y-1"
                  >
                    <p className="type-headline-sm text-on-surface">{value}</p>
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
            <blockquote className="mt-4 pl-4 type-body-lg text-on-surface-variant italic" style={{ borderLeft: "3px solid var(--primary)" }}>
              {p.quote}
            </blockquote>
          )}
        </section>
      )}
    </div>
  );
}
