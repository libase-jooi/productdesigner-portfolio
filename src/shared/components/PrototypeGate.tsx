import { useState, useCallback } from "react";

const STORAGE_KEY = "jooi_proto_authed";
const PROTO_PASSWORD = "jooijooijooi-Dx4!mQ8%zR1^tK6&";

function isAuthed() {
  return sessionStorage.getItem(STORAGE_KEY) === "1";
}

export function PrototypeGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(isAuthed);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (password === PROTO_PASSWORD) {
        sessionStorage.setItem(STORAGE_KEY, "1");
        setAuthed(true);
      } else {
        setError(true);
      }
    },
    [password],
  );

  if (authed) return <>{children}</>;

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6 text-center"
      >
        <img
          src="https://framerusercontent.com/images/fgz4BsK3fqt7A2t9cV4v73WgXE.png"
          alt="JOOi"
          className="h-8 mx-auto"
        />
        <p className="type-body-md text-on-surface-variant">
          Prototype access
        </p>

        <div className="space-y-3">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            placeholder="Password"
            autoFocus
            className="w-full rounded-xl bg-surface-container-high px-4 h-12 type-body-md text-on-surface outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-on-surface-variant/50"
          />
          {error && (
            <p className="type-label-sm text-error">
              パスワードが正しくありません
            </p>
          )}
          <button
            type="submit"
            className="w-full h-12 rounded-xl gradient-primary text-white type-title-sm transition-opacity hover:opacity-90"
          >
            Enter
          </button>
        </div>
      </form>
    </div>
  );
}
