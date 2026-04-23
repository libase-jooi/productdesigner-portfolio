import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockDesigners } from "@/api/mock";
import { UploadDialog } from "@/features/upload/components/UploadDialog";
import { useCurrentDesigner } from "@/shared/hooks/useCurrentDesigner";

export function DesignerListPage() {
  const designers = mockDesigners;
  const [searchParams, setSearchParams] = useSearchParams();
  const [uploadOpen, setUploadOpen] = useState(false);
  const navigate = useNavigate();
  const { designer } = useCurrentDesigner();

  // /dashboard にアクセスした場合、自分のポートフォリオにリダイレクト
  useEffect(() => {
    if (!searchParams.has("upload")) {
      const to = designer.slug ? `/portfolio/${designer.slug}` : `/designers/${designer.id}`;
      navigate(to, { replace: true });
    }
  }, [designer.slug, designer.id, navigate, searchParams]);

  // URL param ?upload で自動オープン
  useEffect(() => {
    if (searchParams.has("upload")) {
      setUploadOpen(true);
      searchParams.delete("upload");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // ヘッダーからのイベントでオープン
  useEffect(() => {
    const handler = () => setUploadOpen(true);
    window.addEventListener("open-upload-dialog", handler);
    return () => window.removeEventListener("open-upload-dialog", handler);
  }, []);

  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="pt-8 sm:pt-16 pb-4 sm:pb-8 space-y-4 sm:space-y-6 text-center max-w-3xl mx-auto">
        <h1 className="type-display-sm sm:type-display-lg text-on-surface">
          ポートフォリオ、
          <br />
          <span className="gradient-primary bg-clip-text text-transparent">
            AIがつくる。
          </span>
        </h1>
        <p className="type-body-md sm:type-body-lg text-on-surface-variant max-w-lg mx-auto">
          PDFやポートフォリオURLをアップロードするだけ。
          AIが自動で経歴・プロジェクトを構造化し、あなたのポートフォリオを生成します。
        </p>
        <div className="pt-2 sm:pt-4">
          <button
            onClick={() => setUploadOpen(true)}
            className="inline-flex h-12 sm:h-14 items-center gap-2 rounded-2xl px-8 sm:px-10 type-title-sm sm:type-title-md text-white gradient-primary transition-all hover:opacity-90 elevation-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" x2="12" y1="3" y2="15" />
            </svg>
            ポートフォリオをつくる
          </button>
        </div>
      </section>

      {/* Showcase */}
      {designers.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="type-headline-sm text-on-surface">
              つくられたポートフォリオ
            </h2>
            <span className="type-label-sm text-on-surface-variant">
              {designers.length} designers
            </span>
          </div>

          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {designers.map((d) => (
              <Link
                key={d.id}
                to={d.slug ? `/portfolio/${d.slug}` : `/designers/${d.id}`}
                className="group block"
              >
                <div className="relative rounded-xl bg-surface-container-low p-4 sm:p-6 transition-all duration-200 hover:bg-surface-container elevation-2 hover:elevation-4">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                    <Avatar className="h-10 w-10 sm:h-14 sm:w-14 rounded-lg sm:rounded-xl">
                      <AvatarImage src={d.profileImageUrl ?? undefined} />
                      <AvatarFallback className="rounded-lg sm:rounded-xl bg-surface-container-high text-on-surface type-title-sm sm:type-title-md">
                        {d.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 space-y-0.5 sm:space-y-1">
                      <h3 className="type-title-sm sm:type-title-lg text-on-surface group-hover:text-on-surface transition-colors truncate">
                        {d.name}
                      </h3>
                      <p className="type-body-sm text-on-surface-variant">
                        {d.sourceType}
                      </p>
                      {d.availabilityStatus && (
                        <div className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-tertiary shrink-0" />
                          <span className="type-label-sm text-on-surface">
                            {d.availabilityStatus}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {d.bio && (
                    <p className="mt-2 sm:mt-3 type-body-sm text-on-surface-variant line-clamp-2">
                      {d.bio}
                    </p>
                  )}

                  <div className="mt-3 sm:mt-4 flex items-center justify-between">
                    <div className="flex gap-1.5">
                      {d.projects.length > 0 && (
                        <span className="type-label-sm text-on-surface-variant">
                          {d.projects.length} projects
                        </span>
                      )}
                    </div>
                    <StatusBadge status={d.status} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Upload Dialog */}
      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    完了: "bg-tertiary-fixed text-on-tertiary-container",
    要確認: "bg-error-container text-on-error-container",
    処理中: "bg-surface-container-high text-on-surface-variant",
  };
  return (
    <Badge
      className={`rounded-full px-3 py-0.5 type-label-sm border-none ${variants[status] ?? variants["処理中"]}`}
    >
      {status}
    </Badge>
  );
}
