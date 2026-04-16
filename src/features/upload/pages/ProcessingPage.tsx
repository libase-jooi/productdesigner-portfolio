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
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-lg space-y-10 text-center">
        {/* Animated icon */}
        <div className="mx-auto flex h-24 w-24 items-center justify-center">
          {done ? (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-tertiary-fixed animate-in zoom-in duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-on-tertiary-container">
                <path d="m9 12 2 2 4-4" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
          ) : (
            <div className="relative h-20 w-20">
              <div className="absolute inset-0 rounded-full border-4 border-surface-container-high" />
              <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              <div className="absolute inset-3 rounded-full border-4 border-secondary-container border-b-transparent animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />
            </div>
          )}
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="type-headline-md text-on-surface">
            {done ? "分析が完了しました" : "AIが分析しています"}
          </h1>
          <p className="type-body-md text-on-surface-variant">
            {done
              ? "ポートフォリオページへ移動します..."
              : sourceName}
          </p>
        </div>

        {/* Progress bar */}
        <div className="space-y-4">
          <div className="relative h-2 overflow-hidden rounded-full bg-surface-container-high">
            <div
              className="absolute inset-y-0 left-0 rounded-full gradient-primary transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="type-body-sm text-on-surface-variant">
            {Math.round(progress)}%
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-3 text-left">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 transition-all duration-300 ${
                i < currentStep
                  ? "opacity-50"
                  : i === currentStep
                    ? "opacity-100"
                    : "opacity-30"
              }`}
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center">
                {i < currentStep || done ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-tertiary">
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                ) : i === currentStep ? (
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-outline-variant" />
                )}
              </div>
              <span
                className={`type-body-sm ${
                  i === currentStep && !done
                    ? "text-on-surface font-medium"
                    : "text-on-surface-variant"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
