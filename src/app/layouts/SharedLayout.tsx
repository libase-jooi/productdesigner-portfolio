import { Link, Outlet } from "react-router-dom";

export function SharedLayout() {
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
          <nav className="flex items-center gap-4">
            <Link
              to="/signup"
              className="inline-flex h-8 items-center rounded-lg px-4 type-label-md text-white gradient-primary transition-all hover:opacity-90"
            >
              JOOiで作成
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}
