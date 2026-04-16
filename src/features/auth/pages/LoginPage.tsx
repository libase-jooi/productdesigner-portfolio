import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { mockDesigners } from "@/api/mock";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCurrentDesigner } from "@/shared/hooks/useCurrentDesigner";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedDesignerId, setSelectedDesignerId] = useState(
    getCurrentDesigner().id
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Proto: 選択したデザイナーとしてログイン
    localStorage.setItem("jooi_current_designer_id", selectedDesignerId);
    const designer = mockDesigners.find((d) => d.id === selectedDesignerId)!;
    navigate(designer.slug ? `/portfolio/${designer.slug}` : "/dashboard");
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
          <h1 className="type-headline-md text-on-surface">ログイン</h1>
          <p className="mt-2 type-body-md text-on-surface-variant">
            アカウントにログインしてください
          </p>
        </div>

        {/* Proto: デザイナー選択 */}
        <div className="rounded-xl bg-surface-container-low p-4 space-y-3">
          <p className="type-label-md text-on-surface-variant text-center">
            Proto: ログインするデザイナーを選択
          </p>
          <div className="space-y-2">
            {mockDesigners.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedDesignerId(d.id)}
                className={`w-full flex items-center gap-3 rounded-lg p-3 transition-colors text-left ${
                  selectedDesignerId === d.id
                    ? "bg-primary/10 ring-2 ring-primary"
                    : "hover:bg-surface-container"
                }`}
              >
                <Avatar className="h-9 w-9 rounded-lg">
                  <AvatarImage src={d.profileImageUrl ?? undefined} />
                  <AvatarFallback className="rounded-lg bg-surface-container-high text-on-surface type-label-md">
                    {d.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="type-label-md text-on-surface truncate">
                    {d.name}
                  </p>
                  <p className="type-body-sm text-on-surface-variant">
                    /{d.slug}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
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
            <div className="flex items-center justify-between mb-1.5">
              <label className="type-label-md text-on-surface">
                パスワード
              </label>
              <button type="button" className="type-label-sm text-primary hover:underline">
                パスワードを忘れた方
              </button>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワードを入力"
              className="w-full h-12 rounded-xl bg-surface-container-low px-4 type-body-md text-on-surface placeholder:text-on-surface-variant/50 border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 rounded-xl type-title-sm text-white gradient-primary transition-all hover:opacity-90 elevation-2"
          >
            ログイン
          </button>
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
            Googleでログイン
          </button>
        </div>

        {/* Sign up link */}
        <p className="text-center type-body-md text-on-surface-variant">
          アカウントをお持ちでない方は{" "}
          <Link to="/signup" className="text-primary hover:underline type-label-md">
            新規登録
          </Link>
        </p>
      </div>
    </div>
  );
}
