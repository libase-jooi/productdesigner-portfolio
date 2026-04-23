import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type UploadMethod = "pdf" | "url";

const DEMO_URLS = [
  {
    label: "Behance",
    url: "https://www.behance.net/demo-portfolio",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
      </svg>
    ),
  },
  {
    label: "Dribbble",
    url: "https://dribbble.com/demo-designer",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    label: "Notion",
    url: "https://notion.so/demo-portfolio-page",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H18a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 19.5v-15zM6.5 4a.5.5 0 0 0-.5.5v15a.5.5 0 0 0 .5.5H18V4H6.5zM8 7h8v2H8V7zm0 4h8v2H8v-2zm0 4h5v2H8v-2z" />
      </svg>
    ),
  },
];

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadDialog({ open, onOpenChange }: UploadDialogProps) {
  const navigate = useNavigate();
  const [method, setMethod] = useState<UploadMethod>("pdf");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSubmit =
    (method === "pdf" && file !== null) || (method === "url" && url.trim() !== "");

  const handleSubmit = () => {
    if (!canSubmit) return;
    const sourceType = method === "pdf" ? "pdf" : "url";
    const sourceName = method === "pdf" ? file!.name : url;
    onOpenChange(false);
    navigate("/upload/processing", {
      state: { sourceType, sourceName },
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf") {
      setFile(dropped);
      setMethod("pdf");
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setMethod("pdf");
    }
  };

  const handleDemoFileSelect = () => {
    const dummyFile = new File(["dummy"], "ポートフォリオ_田中太郎.pdf", {
      type: "application/pdf",
    });
    Object.defineProperty(dummyFile, "size", { value: 2.4 * 1024 * 1024 });
    setFile(dummyFile);
    setMethod("pdf");
  };

  const handleDemoUrlSelect = (demoUrl: string) => {
    setUrl(demoUrl);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg min-h-[520px] p-6 gap-6">
        <DialogHeader>
          <DialogTitle className="type-headline-sm text-on-surface">
            ポートフォリオをアップロード
          </DialogTitle>
          <DialogDescription className="type-body-sm text-on-surface-variant">
            PDFファイルまたはポートフォリオのURLを入力してください。
          </DialogDescription>
        </DialogHeader>

        {/* Method Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setMethod("pdf")}
            className={`px-5 py-2 rounded-xl type-label-md transition-all ${
              method === "pdf"
                ? "bg-on-surface text-surface"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            PDF アップロード
          </button>
          <button
            onClick={() => setMethod("url")}
            className={`px-5 py-2 rounded-xl type-label-md transition-all ${
              method === "url"
                ? "bg-on-surface text-surface"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            URL を入力
          </button>
        </div>

        {/* Upload Area */}
        {method === "pdf" ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
              isDragging
                ? "border-primary bg-primary-fixed/30"
                : file
                  ? "border-tertiary bg-tertiary-fixed/10"
                  : "border-outline-variant bg-surface-container-low hover:bg-surface-container"
            }`}
          >
            {file ? (
              <div className="space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-tertiary-fixed">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-on-tertiary-container">
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                    <path d="m9 15 2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <p className="type-title-sm text-on-surface">{file.name}</p>
                  <p className="type-body-sm text-on-surface-variant mt-0.5">
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="type-label-sm text-error hover:underline"
                >
                  ファイルを変更
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container-high">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-on-surface-variant">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" x2="12" y1="3" y2="15" />
                  </svg>
                </div>
                <div>
                  <p className="type-title-sm text-on-surface">
                    PDFファイルをドラッグ&ドロップ
                  </p>
                  <p className="type-body-sm text-on-surface-variant mt-0.5">
                    または
                  </p>
                </div>
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-xl px-5"
                  >
                    ファイルを選択
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleDemoFileSelect}
                    className="rounded-xl px-5 type-label-sm text-on-surface-variant"
                  >
                    デモで試す
                  </Button>
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="type-label-md text-on-surface">
                ポートフォリオURL
              </label>
              <Input
                type="url"
                placeholder="https://www.behance.net/your-portfolio"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="h-11 rounded-xl px-4 type-body-md bg-surface-container-low text-on-surface"
              />
            </div>

            {/* Demo URL Buttons */}
            <div className="space-y-2">
              <p className="type-label-sm text-on-surface-variant">
                デモURLで試す
              </p>
              <div className="flex flex-wrap gap-2">
                {DEMO_URLS.map((demo) => (
                  <button
                    key={demo.label}
                    onClick={() => handleDemoUrlSelect(demo.url)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 type-label-sm transition-all ${
                      url === demo.url
                        ? "bg-on-surface text-surface"
                        : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                    }`}
                  >
                    {demo.icon}
                    {demo.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <Button
            disabled={!canSubmit}
            onClick={handleSubmit}
            className="h-11 rounded-xl px-8 type-label-md gradient-primary text-white border-none disabled:opacity-40"
          >
            分析を開始する
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
