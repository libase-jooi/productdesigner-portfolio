import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const STEPS = [
  { label: "ファイルを読み込み中...", duration: 500 },
  { label: "経歴情報を抽出中...", duration: 600 },
  { label: "プロジェクトを構造化中...", duration: 600 },
  { label: "スキルとドメインを分析中...", duration: 400 },
  { label: "ポートフォリオを生成中...", duration: 400 },
];

const TOTAL_DURATION = STEPS.reduce((sum, s) => sum + s.duration, 0);

export function ProcessingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const sourceName = (location.state as { sourceName?: string })?.sourceName ?? "portfolio";

  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let elapsed = 0;
    let stepIndex = 0;

    const interval = setInterval(() => {
      elapsed += 50;
      const pct = Math.min((elapsed / TOTAL_DURATION) * 100, 100);
      setProgress(pct);

      // Determine current step
      let acc = 0;
      for (let i = 0; i < STEPS.length; i++) {
        acc += STEPS[i].duration;
        if (elapsed < acc) {
          if (i !== stepIndex) {
            stepIndex = i;
            setCurrentStep(i);
          }
          break;
        }
      }

      if (elapsed >= TOTAL_DURATION) {
        clearInterval(interval);
        setDone(true);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (done) {
      const timeout = setTimeout(() => {
        navigate("/upload/review/d1", { replace: true });
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [done, navigate]);

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
              {/* Outer glow ring */}
              <div className="absolute -inset-2 rounded-full bg-primary/5 animate-pulse" />
              <div className="absolute inset-0 rounded-full border-[3px] border-surface-container-high" />
              <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-primary border-r-primary/40 animate-spin [animation-duration:1.2s]" />
              <div className="absolute inset-3 rounded-full border-[3px] border-transparent border-b-secondary/60 border-l-secondary/20 animate-spin [animation-direction:reverse] [animation-duration:1.8s]" />
              {/* Center dot */}
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
            {done
              ? "ポートフォリオページへ移動します..."
              : sourceName}
          </p>
        </div>

        {/* Progress bar */}
        <div className="space-y-3 px-2">
          <div className="relative h-1.5 overflow-hidden rounded-full bg-surface-container-high">
            <div
              className="absolute inset-y-0 left-0 rounded-full gradient-primary transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="type-label-sm text-on-surface-variant tabular-nums tracking-wider">
            {Math.round(progress)}%
          </p>
        </div>

        {/* Steps */}
        <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-low p-5 space-y-1">
          {STEPS.map((step, i) => {
            const isActive = i === currentStep && !done;
            const isCompleted = i < currentStep || done;
            const isPending = i > currentStep && !done;

            return (
              <div
                key={i}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-300 ${
                  isActive ? "bg-primary-container/30" : ""
                } ${isPending ? "opacity-30" : ""}`}
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
                <span
                  className={`type-body-sm transition-colors duration-300 ${
                    isActive
                      ? "text-on-surface font-medium"
                      : isCompleted
                        ? "text-on-surface-variant"
                        : "text-on-surface-variant"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
