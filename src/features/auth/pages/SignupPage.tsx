import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function SignupPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"client" | "designer">("client");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("パスワードは8文字以上で入力してください");
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password, name);
    setLoading(false);
    if (error) {
      setError("登録に失敗しました。入力内容を確認してください");
      return;
    }
    navigate("/my/edit", { state: { firstTime: true } });
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link to="/">
            <img
              src="https://framerusercontent.com/images/fgz4BsK3fqt7A2t9cV4v73WgXE.png"
              alt="JOOi"
              className="h-6 w-auto mx-auto mb-6"
            />
          </Link>
          <h1 className="type-headline-md text-on-surface">アカウント作成</h1>
          <p className="mt-2 type-body-md text-on-surface-variant">
            無料で始めましょう
          </p>
        </div>

        {/* Role Toggle */}
        <div className="flex rounded-xl bg-surface-container-low p-1">
          <button
            type="button"
            onClick={() => setRole("client")}
            className={`flex-1 h-10 rounded-lg type-label-md transition-all ${
              role === "client"
                ? "bg-surface text-on-surface elevation-1"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            クライアント
          </button>
          <button
            type="button"
            onClick={() => setRole("designer")}
            className={`flex-1 h-10 rounded-lg type-label-md transition-all ${
              role === "designer"
                ? "bg-surface text-on-surface elevation-1"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            デザイナー
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-xl bg-error-container p-3 text-center">
              <p className="type-label-md text-on-error-container">{error}</p>
            </div>
          )}
          <div>
            <label className="type-label-md text-on-surface block mb-1.5">
              {role === "designer" ? "氏名" : "会社名 / お名前"}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={role === "designer" ? "田中 太郎" : "株式会社〇〇 / 田中 太郎"}
              className="w-full h-12 rounded-xl bg-surface-container-low px-4 type-body-md text-on-surface placeholder:text-on-surface-variant/50 border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            />
          </div>

          <div>
            <label className="type-label-md text-on-surface block mb-1.5">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full h-12 rounded-xl bg-surface-container-low px-4 type-body-md text-on-surface placeholder:text-on-surface-variant/50 border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            />
          </div>

          <div>
            <label className="type-label-md text-on-surface block mb-1.5">
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8文字以上"
              className="w-full h-12 rounded-xl bg-surface-container-low px-4 type-body-md text-on-surface placeholder:text-on-surface-variant/50 border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl type-title-sm text-white gradient-primary transition-all hover:opacity-90 elevation-2 disabled:opacity-60"
          >
            {loading ? "登録中..." : "アカウントを作成"}
          </button>

          <p className="type-label-sm text-on-surface-variant text-center">
            登録することで、
            <a href="#" className="text-primary hover:underline">利用規約</a>
            と
            <a href="#" className="text-primary hover:underline">プライバシーポリシー</a>
            に同意したものとみなされます。
          </p>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-outline-variant" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-surface px-4 type-label-sm text-on-surface-variant">または</span>
          </div>
        </div>

        {/* Social Login */}
        <div className="space-y-3">
          <button className="w-full h-12 rounded-xl type-label-md text-on-surface border border-outline-variant bg-surface hover:bg-surface-container-low transition-colors flex items-center justify-center gap-3">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Googleで登録
          </button>
        </div>

        {/* Login link */}
        <p className="text-center type-body-md text-on-surface-variant">
          既にアカウントをお持ちの方は{" "}
          <Link to="/login" className="text-primary hover:underline type-label-md">
            ログイン
          </Link>
        </p>
      </div>
    </div>
  );
}
