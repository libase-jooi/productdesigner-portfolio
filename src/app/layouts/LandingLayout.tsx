import { Link, Outlet, ScrollRestoration } from "react-router-dom";

export function LandingLayout() {
  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-50 glass">
        <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="https://framerusercontent.com/images/fgz4BsK3fqt7A2t9cV4v73WgXE.png"
              alt="JOOi"
              className="h-5 sm:h-6 w-auto"
            />
          </Link>
          <nav className="flex items-center gap-4 sm:gap-6">
            <a href="#about" className="type-label-sm text-on-surface-variant hover:text-on-surface transition-colors hidden sm:inline">
              JOOiとは
            </a>
            <a href="#services" className="type-label-sm text-on-surface-variant hover:text-on-surface transition-colors hidden sm:inline">
              活用
            </a>
            <Link
              to="/login"
              className="type-label-sm text-on-surface-variant hover:text-on-surface transition-colors"
            >
              ログイン
            </Link>
            <Link
              to="/signup"
              className="inline-flex h-8 items-center rounded-lg px-4 type-label-md text-white gradient-primary transition-all hover:opacity-90"
            >
              無料登録
            </Link>
          </nav>
        </div>
      </header>
      <ScrollRestoration />
      <Outlet />
    </div>
  );
}
