import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16">
      {/* Prototype Notice */}
      <div className="w-full max-w-2xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 text-amber-800 px-4 py-1.5 type-label-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          Prototype
        </div>

        <h1 className="type-headline-lg text-on-surface">
          このページは、プロトタイプの動線として設置しています
        </h1>

        <p className="type-body-lg text-on-surface-variant">
          実際のサービスサイトは{" "}
          <a
            href="https://jooi-design.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2 hover:opacity-80 font-medium"
          >
            jooi-design.io
          </a>{" "}
          をご覧ください。<br />
          以下が実際のサービスサイトです。
        </p>
      </div>

      {/* Screenshot */}
      <a
        href="https://jooi-design.io/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-10 block w-full max-w-4xl group"
      >
        <div className="rounded-2xl overflow-hidden border border-outline-variant elevation-2 group-hover:elevation-4 transition-all">
          <img
            src="/jooi-design-screenshot.png"
            alt="jooi-design.io"
            className="w-full h-auto"
          />
        </div>
        <p className="mt-3 text-center type-label-md text-on-surface-variant group-hover:text-primary transition-colors">
          jooi-design.io を開く →
        </p>
      </a>

      {/* Prototype links */}
      <div className="mt-16 w-full max-w-md space-y-3">
        <p className="type-label-md text-on-surface-variant text-center mb-4">プロトタイプページ</p>
        <Link
          to="/login"
          className="flex items-center justify-between rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors p-4"
        >
          <span className="type-title-sm text-on-surface">ログイン</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-on-surface-variant">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>
        <Link
          to="/signup"
          className="flex items-center justify-between rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors p-4"
        >
          <span className="type-title-sm text-on-surface">新規登録</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-on-surface-variant">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
