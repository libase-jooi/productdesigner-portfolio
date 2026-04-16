import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export function AdminLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-surface-dim">
      <header className="sticky top-0 z-50 bg-inverse-surface">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="flex items-center gap-2">
              <img
                src="https://framerusercontent.com/images/fgz4BsK3fqt7A2t9cV4v73WgXE.png"
                alt="JOOi"
                className="h-5 sm:h-6 w-auto brightness-0 invert"
              />
            </Link>
            <span className="rounded-md bg-white/20 px-2 py-0.5 type-label-sm text-inverse-on-surface">
              Admin
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              to="/admin"
              className={cn(
                "type-label-md transition-colors",
                location.pathname === "/admin"
                  ? "text-inverse-on-surface"
                  : "text-inverse-on-surface/60 hover:text-inverse-on-surface"
              )}
            >
              デザイナー管理
            </Link>
            <Link
              to="/"
              className="type-label-md text-inverse-on-surface/60 hover:text-inverse-on-surface transition-colors"
            >
              サイトを見る →
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
