import { Link, Outlet, ScrollRestoration, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function SharedLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 glass">
        <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="https://framerusercontent.com/images/fgz4BsK3fqt7A2t9cV4v73WgXE.png"
              alt="JOOi"
              className="h-5 sm:h-6 w-auto"
            />
          </Link>
          <nav className="flex items-center gap-3">
            {user ? (
              <button
                type="button"
                onClick={async () => { await signOut(); navigate("/login"); }}
                className="type-label-sm text-on-surface-variant/50 hover:text-error transition-colors"
              >
                ログアウト
              </button>
            ) : (
              <Link
                to="/signup"
                className="inline-flex h-8 items-center rounded-lg px-4 type-label-md text-white gradient-primary transition-all hover:opacity-90"
              >
                JOOiで作成
              </Link>
            )}
          </nav>
        </div>
      </header>
      <ScrollRestoration />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}
