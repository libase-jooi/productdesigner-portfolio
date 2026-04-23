import { useState, useCallback } from "react";
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
    label: "STEP 01",
    title: "ポートフォリオを\nAIが自動生成",
    description:
      "あなたの既存のポートフォリオやPDFをAIが読み取り、構造化されたポートフォリオを自動で作成します。",
    visual: (
      <div className="relative flex items-center justify-center gap-5">
        {/* PDF */}
        <div className="group flex flex-col items-center gap-2.5">
          <div className="relative h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/80">
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
              <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            </svg>
          </div>
          <span className="type-label-sm text-white/50 tracking-widest uppercase text-[10px]">PDF</span>
        </div>
        {/* URL */}
        <div className="group flex flex-col items-center gap-2.5">
          <div className="relative h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/80">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </div>
          <span className="type-label-sm text-white/50 tracking-widest uppercase text-[10px]">URL</span>
        </div>
        {/* Arrow */}
        <div className="flex flex-col items-center gap-2.5">
          <div className="h-16 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/30">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </div>
          <span className="text-[10px] text-transparent">.</span>
        </div>
        {/* AI */}
        <div className="group flex flex-col items-center gap-2.5">
          <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-white/25 to-white/5 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg shadow-white/5 transition-transform duration-500 group-hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z" fill="none" />
              <path d="m9 16 2 2 4-4" />
            </svg>
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </div>
          <span className="type-label-sm text-white/70 tracking-widest uppercase text-[10px] font-medium">AI分析</span>
        </div>
      </div>
    ),
  },
  {
    label: "STEP 02",
    title: "AIが自動で\n構造化・整理",
    description:
      "経歴・プロジェクト・スキルをAIが自動で抽出し、構造化します。信頼度スコア付きで、確認が必要な箇所もひと目でわかります。",
    visual: (
      <div className="space-y-2.5 w-full max-w-[280px] mx-auto">
        <div className="flex items-center gap-3 rounded-xl bg-white/8 backdrop-blur-sm border border-white/10 p-3.5 transition-all hover:bg-white/12">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shrink-0 shadow-sm shadow-emerald-400/50" />
          <div className="flex-1">
            <div className="h-2 w-3/4 rounded-full bg-white/20" />
          </div>
          <span className="type-label-sm text-emerald-400/90 text-[11px] tracking-wide">高</span>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-white/8 backdrop-blur-sm border border-white/10 p-3.5 transition-all hover:bg-white/12">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400 shrink-0 shadow-sm shadow-amber-400/50" />
          <div className="flex-1">
            <div className="h-2 w-1/2 rounded-full bg-white/20" />
          </div>
          <span className="type-label-sm text-amber-400/90 text-[11px] tracking-wide">中</span>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-white/8 backdrop-blur-sm border border-white/10 p-3.5 transition-all hover:bg-white/12">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400 shrink-0 shadow-sm shadow-rose-400/50" />
          <div className="flex-1">
            <div className="h-2 w-2/3 rounded-full bg-white/20" />
          </div>
          <span className="type-label-sm text-rose-400/90 text-[11px] tracking-wide">低 — 要確認</span>
        </div>
      </div>
    ),
  },
  {
    label: "STEP 03",
    title: "確認して\n公開するだけ",
    description:
      "AIが生成した内容を確認・編集したら、ワンクリックで公開。あなた専用の公開URLが発行され、すぐに共有できます。",
    visual: (
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 backdrop-blur-sm border border-emerald-500/20 px-8 py-4 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <span className="type-title-sm text-emerald-300 font-medium">公開完了!</span>
        </div>
        <div className="rounded-xl bg-white/8 backdrop-blur-sm border border-white/10 px-5 py-2.5 flex items-center gap-2.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <span className="type-body-sm text-white/60 font-mono text-[12px]">jooi.design/p/your-name</span>
        </div>
      </div>
    ),
  },
] as const;

export function OnboardingDialog({ open, onOpenChange, onStartUpload }: OnboardingDialogProps) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const handleNext = useCallback(() => {
    if (isLast) {
      onOpenChange(false);
      setStep(0);
      onStartUpload();
    } else {
      setStep((s) => s + 1);
    }
  }, [isLast, onOpenChange, onStartUpload]);

  const handleSkip = useCallback(() => {
    onOpenChange(false);
    setStep(0);
  }, [onOpenChange]);

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) setStep(0);
        onOpenChange(o);
      }}
    >
      <DialogContent className="sm:max-w-lg min-h-[520px] p-0 gap-0 overflow-hidden border-0 ring-0 ring-transparent bg-transparent shadow-2xl" showCloseButton={false}>
        <div className="rounded-xl overflow-hidden">
          {/* Hero visual area - deep indigo gradient */}
          <div
            className="relative px-8 pt-10 pb-8 flex flex-col items-center"
            style={{
              background: "linear-gradient(145deg, #1a0066 0%, #2E02E9 40%, #5b3aff 100%)",
            }}
          >
            {/* Subtle noise overlay */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

            {/* Floating glow orbs */}
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-indigo-400/10 blur-3xl" />

            {/* Step label */}
            <span className="relative z-10 type-label-sm text-white/40 tracking-[0.25em] uppercase text-[10px] mb-6">
              {current.label}
            </span>

            {/* Visual content */}
            <div className="relative z-10 w-full">
              {current.visual}
            </div>
          </div>

          {/* Content area - clean white */}
          <div className="bg-surface p-8 space-y-6">
            <div className="space-y-3">
              <h2 className="type-headline-sm text-on-surface whitespace-pre-line leading-tight tracking-tight">
                {current.title}
              </h2>
              <p className="type-body-md text-on-surface-variant leading-relaxed">
                {current.description}
              </p>
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-2">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className="h-[3px] flex-1 rounded-full overflow-hidden bg-on-surface-variant/10"
                >
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: i <= step ? "100%" : "0%",
                      background: i <= step ? "linear-gradient(90deg, #2E02E9, #5b3aff)" : "transparent",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={handleSkip}
                className="type-label-md text-on-surface-variant/60 hover:text-on-surface-variant transition-colors duration-200"
              >
                スキップ
              </button>
              <button
                onClick={handleNext}
                className="inline-flex h-11 items-center gap-2.5 rounded-xl px-7 type-label-md text-white font-medium transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #2E02E9 0%, #5b3aff 100%)",
                }}
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
