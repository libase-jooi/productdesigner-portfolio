import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { analyzePortfolio } from "@/api/supabase";
import { useAuth } from "@/contexts/AuthContext";

const STEPS = [
  "ファイルを読み込み中...",
  "経歴情報を抽出中...",
  "プロジェクトを構造化中...",
  "スキルとドメインを分析中...",
  "ポートフォリオを生成中...",
];

export function ProcessingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { myDesigner } = useAuth();
  const state = location.state as {
    sourceType?: string;
    sourceName?: string;
    file?: File | null;
    url?: string | null;
  } | null;

  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    if (!myDesigner || !state) {
      navigate("/upload");
      return;
    }

    // Simulated progress animation (pauses near 85% until API returns)
    let targetProgress = 0;
    let currentProgress = 0;
    let stepIndex = 0;
    const stepInterval = Math.floor(8000 / STEPS.length);

    const progressTimer = setInterval(() => {
      const maxBeforeDone = 85;
      if (currentProgress < targetProgress && currentProgress < maxBeforeDone) {
        currentProgress = Math.min(currentProgress + 1, maxBeforeDone);
        setProgress(currentProgress);
      }
    }, 150);

    const stepTimer = setInterval(() => {
      if (stepIndex < STEPS.length - 1) {
        stepIndex++;
        setCurrentStep(stepIndex);
        targetProgress = Math.floor((stepIndex / (STEPS.length - 1)) * 80);
      }
    }, stepInterval);

    const run = async () => {
      try {
        let result: { slug: string } | { error: string };

        if (state.sourceType === "pdf" && state.file) {
          // Convert File to base64
          const base64 = await fileToBase64(state.file);
          result = await analyzePortfolio({
            type: "pdf",
            content: base64,
            designerId: myDesigner.id,
          });
        } else if (state.sourceType === "url" && state.url) {
          result = await analyzePortfolio({
            type: "url",
            url: state.url,
            designerId: myDesigner.id,
          });
        } else {
          setError("アップロード情報が不正です。最初からやり直してください。");
          return;
        }

        clearInterval(progressTimer);
        clearInterval(stepTimer);

        if ("error" in result) {
          setError(result.error);
          return;
        }

        setProgress(100);
        setCurrentStep(STEPS.length - 1);
        setDone(true);

        setTimeout(() => {
          navigate(`/upload/review/${result.slug}`, { replace: true });
        }, 800);
      } catch (err) {
        clearInterval(progressTimer);
        clearInterval(stepTimer);
        setError(err instanceof Error ? err.message : "予期しないエラーが発生しました");
      }
    };

    run();

    return () => {
      clearInterval(progressTimer);
      clearInterval(stepTimer);
    };
  }, []);

  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-error/10">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-error">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div className="space-y-2">
            <h1 className="type-headline-md text-on-surface">分析に失敗しました</h1>
            <p className="type-body-sm text-on-surface-variant">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/upload")}
            className="inline-flex h-10 items-center rounded-xl px-6 type-label-md gradient-primary text-white"
          >
            最初からやり直す
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-12 text-center">
        {/* Animated icon */}
        <div className="mx-auto flex h-28 w-28 items-center justify-center">
          {done ? (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-tertiary-fixed animate-in zoom-in duration-300 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-on-tertiary-container">
                <path d="m9 12 2 2 4-4" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
          ) : (
            <div className="relative h-24 w-24">
              <div className="absolute -inset-2 rounded-full bg-primary/5 animate-pulse" />
              <div className="absolute inset-0 rounded-full border-[3px] border-surface-container-high" />
              <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-primary border-r-primary/40 animate-spin [animation-duration:1.2s]" />
              <div className="absolute inset-3 rounded-full border-[3px] border-transparent border-b-secondary/60 border-l-secondary/20 animate-spin [animation-direction:reverse] [animation-duration:1.8s]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-2.5 w-2.5 rounded-full gradient-primary animate-pulse" />
              </div>
            </div>
          )}
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="type-headline-lg text-on-surface tracking-tight">
            {done ? "分析が完了しました" : "AIが分析しています"}
          </h1>
          <p className="type-body-md text-on-surface-variant">
            {done ? "ポートフォリオページへ移動します..." : (state?.sourceName ?? "portfolio")}
          </p>
        </div>

        {/* Progress bar */}
        <div className="space-y-3 px-2">
          <div className="relative h-1.5 overflow-hidden rounded-full bg-surface-container-high">
            <div
              className="absolute inset-y-0 left-0 rounded-full gradient-primary transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="type-label-sm text-on-surface-variant tabular-nums tracking-wider">
            {Math.round(progress)}%
          </p>
        </div>

        {/* Steps */}
        <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-low p-5 space-y-1">
          {STEPS.map((label, i) => {
            const isActive = i === currentStep && !done;
            const isCompleted = i < currentStep || done;
            const isPending = i > currentStep && !done;
            return (
              <div
                key={i}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-300 ${isActive ? "bg-primary-container/30" : ""} ${isPending ? "opacity-30" : ""}`}
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                  {isCompleted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-tertiary">
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  ) : isActive ? (
                    <div className="h-2 w-2 rounded-full gradient-primary animate-pulse" />
                  ) : (
                    <div className="h-1.5 w-1.5 rounded-full bg-outline-variant" />
                  )}
                </div>
                <span className={`type-body-sm transition-colors duration-300 ${isActive ? "text-on-surface font-medium" : "text-on-surface-variant"}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {!done && (
          <p className="type-label-sm text-on-surface-variant/60">
            ポートフォリオの内容によって1〜2分かかることがあります
          </p>
        )}
      </div>
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g. "data:application/pdf;base64,")
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
