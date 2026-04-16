import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type UploadMethod = "pdf" | "url";

export function UploadPage() {
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
    // ダミーファイルを作成してファイル選択をシミュレート
    const dummyFile = new File(["dummy"], "ポートフォリオ_田中太郎.pdf", {
      type: "application/pdf",
    });
    Object.defineProperty(dummyFile, "size", { value: 2.4 * 1024 * 1024 });
    setFile(dummyFile);
    setMethod("pdf");
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Header */}
      <section className="pt-8 sm:pt-12 pb-2 sm:pb-4 space-y-3">
        <h1 className="type-headline-lg sm:type-display-md text-on-surface">
          ポートフォリオをアップロード
        </h1>
        <p className="type-body-md sm:type-body-lg text-on-surface-variant max-w-xl">
          PDFファイルまたはポートフォリオのURLを入力してください。
          AIが自動で構造化します。
        </p>
      </section>

      {/* Method Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setMethod("pdf")}
          className={`px-5 py-2.5 rounded-xl type-label-md transition-all ${
            method === "pdf"
              ? "bg-primary-container text-on-primary-container"
              : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
          }`}
        >
          PDF アップロード
        </button>
        <button
          onClick={() => setMethod("url")}
          className={`px-5 py-2.5 rounded-xl type-label-md transition-all ${
            method === "url"
              ? "bg-primary-container text-on-primary-container"
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
          className={`relative rounded-2xl border-2 border-dashed p-12 text-center transition-all ${
            isDragging
              ? "border-primary bg-primary-container/30"
              : file
                ? "border-tertiary bg-tertiary-fixed/10"
                : "border-outline-variant bg-surface-container-low hover:bg-surface-container"
          }`}
        >
          {file ? (
            <div className="space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-tertiary-fixed">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-on-tertiary-container">
                  <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                  <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                  <path d="m9 15 2 2 4-4" />
                </svg>
              </div>
              <div>
                <p className="type-title-md text-on-surface">{file.name}</p>
                <p className="type-body-sm text-on-surface-variant mt-1">
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
            <div className="space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-container-high">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-on-surface-variant">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" x2="12" y1="3" y2="15" />
                </svg>
              </div>
              <div>
                <p className="type-title-md text-on-surface">
                  PDFファイルをドラッグ&ドロップ
                </p>
                <p className="type-body-sm text-on-surface-variant mt-1">
                  または
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-xl px-6"
                >
                  ファイルを選択
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handleDemoFileSelect}
                  className="rounded-xl px-6 type-label-sm text-on-surface-variant"
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
          <div className="rounded-2xl bg-surface-container-low p-8 space-y-6">
            <div className="space-y-2">
              <label className="type-label-md text-on-surface">
                ポートフォリオURL
              </label>
              <Input
                type="url"
                placeholder="https://www.behance.net/your-portfolio"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="h-12 rounded-xl px-4 type-body-md bg-surface text-on-surface"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {["Behance", "Dribbble", "Notion", "Webサイト"].map((label) => (
                <span
                  key={label}
                  className="rounded-full bg-surface-container px-3 py-1 type-label-sm text-on-surface-variant"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Submit */}
      <div className="flex justify-end">
        <Button
          disabled={!canSubmit}
          onClick={handleSubmit}
          className="h-12 rounded-xl px-8 type-label-md gradient-primary text-white border-none disabled:opacity-40"
        >
          分析を開始する
        </Button>
      </div>
    </div>
  );
}
