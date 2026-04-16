import { useState, useRef, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentDesigner } from "@/shared/hooks/useCurrentDesigner";

function designerUrl(d: { id: string; slug: string | null }) {
  return d.slug ? `/portfolio/${d.slug}` : `/designers/${d.id}`;
}

export function PublicLayout() {
  const navigate = useNavigate();
  const { designer, allDesigners, switchDesigner } = useCurrentDesigner();
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  // 外側クリックで閉じる
  useEffect(() => {
    if (!switcherOpen) return;
    const handler = (e: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(e.target as Node)) {
        setSwitcherOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [switcherOpen]);

  const handleSwitchDesigner = (d: typeof designer) => {
    switchDesigner(d.id);
    setSwitcherOpen(false);
    navigate(designerUrl(d));
  };

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-50 glass">
        <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            to={designerUrl(designer)}
            className="flex items-center gap-2"
          >
            <img
              src="https://framerusercontent.com/images/fgz4BsK3fqt7A2t9cV4v73WgXE.png"
              alt="JOOi"
              className="h-5 sm:h-6 w-auto"
            />
          </Link>
          <nav className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/admin"
              className="type-label-sm text-on-surface-variant/50 hover:text-on-surface-variant transition-colors"
            >
              Admin
            </Link>

            {/* デザイナー切り替え（Proto） */}
            <div className="relative" ref={switcherRef}>
              <button
                onClick={() => setSwitcherOpen(!switcherOpen)}
                className="flex items-center gap-2 rounded-full p-1 hover:bg-surface-container transition-colors"
              >
                <Avatar className="h-8 w-8 rounded-full">
                  <AvatarImage src={designer.profileImageUrl ?? undefined} />
                  <AvatarFallback className="rounded-full bg-surface-container-high text-on-surface type-label-sm">
                    {designer.name[0]}
                  </AvatarFallback>
                </Avatar>
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
                  className="text-on-surface-variant"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {switcherOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-xl bg-surface-container elevation-4 p-2 space-y-1">
                  <p className="px-3 py-1.5 type-label-sm text-on-surface-variant">
                    Proto: デザイナー切り替え
                  </p>
                  {allDesigners.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => handleSwitchDesigner(d)}
                      className={`w-full flex items-center gap-3 rounded-lg p-2.5 transition-colors text-left ${
                        d.id === designer.id
                          ? "bg-primary/10"
                          : "hover:bg-surface-container-high"
                      }`}
                    >
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={d.profileImageUrl ?? undefined} />
                        <AvatarFallback className="rounded-lg bg-surface-container-high text-on-surface type-label-sm">
                          {d.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="type-label-md text-on-surface truncate">
                          {d.name}
                        </p>
                        <p className="type-body-sm text-on-surface-variant">
                          {d.slug ? `/${d.slug}` : "URL未設定"}
                        </p>
                      </div>
                      {d.id === designer.id && (
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
                          className="text-primary shrink-0"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}
