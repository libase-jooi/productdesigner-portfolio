import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface OnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartUpload: () => void;
}

const STEPS = [
  {
    title: "ポートフォリオを\nAIが自動生成",
    description:
      "JOOiは、あなたの既存のポートフォリオやPDFをAIが読み取り、構造化されたポートフォリオを自動で作成します。",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z" fill="none" />
        <path d="m9 16 2 2 4-4" />
      </svg>
    ),
    visual: (
      <div className="flex items-center justify-center gap-3 py-4">
        <div className="flex flex-col items-center gap-2">
          <div className="h-14 w-14 rounded-xl bg-surface-container-high flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-on-surface-variant">
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
              <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            </svg>
          </div>
          <span className="type-label-sm text-on-surface-variant">PDF</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="h-14 w-14 rounded-xl bg-surface-container-high flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-on-surface-variant">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </div>
          <span className="type-label-sm text-on-surface-variant">URL</span>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-on-surface-variant/40 mx-2">
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
        <div className="flex flex-col items-center gap-2">
          <div className="h-14 w-14 rounded-xl gradient-primary flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z" fill="none" />
              <path d="m9 16 2 2 4-4" />
            </svg>
          </div>
          <span className="type-label-sm text-primary font-medium">AI分析</span>
        </div>
      </div>
    ),
  },
  {
    title: "AIが自動で\n構造化・整理",
    description:
      "経歴・プロジェクト・スキルをAIが自動で抽出し、構造化します。信頼度スコア付きで、確認が必要な箇所もひと目でわかります。",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M7 7h3v3H7z" />
        <path d="M14 7h3" />
        <path d="M14 11h3" />
        <path d="M7 14h10" />
        <path d="M7 18h6" />
      </svg>
    ),
    visual: (
      <div className="space-y-2.5 py-2">
        <div className="flex items-center gap-3 rounded-lg bg-surface-container-low p-3">
          <span className="h-2.5 w-2.5 rounded-full bg-tertiary shrink-0" />
          <div className="flex-1">
            <div className="h-2.5 w-3/4 rounded-full bg-on-surface/15" />
          </div>
          <span className="type-label-sm text-tertiary">高</span>
        </div>
        <div className="flex items-center gap-3 rounded-lg bg-surface-container-low p-3">
          <span className="h-2.5 w-2.5 rounded-full bg-secondary-base shrink-0" />
          <div className="flex-1">
            <div className="h-2.5 w-1/2 rounded-full bg-on-surface/15" />
          </div>
          <span className="type-label-sm text-secondary-base">中</span>
        </div>
        <div className="flex items-center gap-3 rounded-lg bg-surface-container-low p-3">
          <span className="h-2.5 w-2.5 rounded-full bg-error shrink-0" />
          <div className="flex-1">
            <div className="h-2.5 w-2/3 rounded-full bg-on-surface/15" />
          </div>
          <span className="type-label-sm text-error">低 — 要確認</span>
        </div>
      </div>
    ),
  },
  {
    title: "確認して\n公開するだけ",
    description:
      "AIが生成した内容を確認・編集したら、ワンクリックで公開。あなた専用の公開URLが発行され、すぐに共有できます。",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    visual: (
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="rounded-xl bg-tertiary-fixed/30 px-6 py-3 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-on-tertiary-container">
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <span className="type-title-sm text-on-tertiary-container">公開完了!</span>
        </div>
        <div className="rounded-lg bg-surface-container-low px-4 py-2 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-on-surface-variant">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <span className="type-body-sm text-on-surface-variant font-mono">jooi.design/p/your-name</span>
        </div>
      </div>
    ),
  },
] as const;

export function OnboardingDialog({ open, onOpenChange, onStartUpload }: OnboardingDialogProps) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      onOpenChange(false);
      setStep(0);
      onStartUpload();
    } else {
      setStep(step + 1);
    }
  };

  const handleSkip = () => {
    onOpenChange(false);
    setStep(0);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) setStep(0);
        onOpenChange(o);
      }}
    >
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        {/* Visual area */}
        <div className="bg-surface-container-low px-8 pt-8 pb-4">
          <div className="flex items-center justify-center text-primary mb-4">
            {current.icon}
          </div>
          {current.visual}
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <h2 className="type-headline-sm text-on-surface whitespace-pre-line">
              {current.title}
            </h2>
            <p className="type-body-md text-on-surface-variant leading-relaxed">
              {current.description}
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === step
                    ? "w-6 bg-primary"
                    : "w-1.5 bg-on-surface-variant/20"
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleSkip}
              className="type-label-md text-on-surface-variant hover:text-on-surface transition-colors"
            >
              スキップ
            </button>
            <button
              onClick={handleNext}
              className="inline-flex h-10 items-center gap-2 rounded-xl px-6 type-label-md text-white gradient-primary transition-all hover:opacity-90"
            >
              {isLast ? (
                <>
                  アップロードする
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </>
              ) : (
                <>
                  次へ
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
