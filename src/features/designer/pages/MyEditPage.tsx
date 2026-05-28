import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { getDesignerById, updateDesigner, uploadProfileImage } from "@/api/supabase";
import type { DesignerWithRelations } from "@/api/schema";
import { AvailabilityStatus } from "@/api/schema";

type Draft = {
  name: string;
  profileImageUrl: string;
  bio: string;
  availabilityStatus: string;
  availabilityNote: string;
  socialLinks: {
    x: string;
    note: string;
    linkedin: string;
    github: string;
    dribbble: string;
    behance: string;
    website: string;
  };
};

function initDraft(d: DesignerWithRelations): Draft {
  return {
    name: d.name,
    profileImageUrl: d.profileImageUrl ?? "",
    bio: d.bio ?? "",
    availabilityStatus: d.availabilityStatus ?? "",
    availabilityNote: d.availabilityNote ?? "",
    socialLinks: {
      x: d.socialLinks?.x ?? "",
      note: d.socialLinks?.note ?? "",
      linkedin: d.socialLinks?.linkedin ?? "",
      github: d.socialLinks?.github ?? "",
      dribbble: d.socialLinks?.dribbble ?? "",
      behance: d.socialLinks?.behance ?? "",
      website: d.socialLinks?.website ?? "",
    },
  };
}

export function MyEditPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isFirstTime = (location.state as { firstTime?: boolean })?.firstTime === true;
  const { myDesigner, loading: authLoading } = useAuth();
  const [designer, setDesigner] = useState<DesignerWithRelations | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saveMsg, setSaveMsg] = useState<"success" | "error" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!myDesigner) {
      navigate("/upload");
      return;
    }
    getDesignerById(myDesigner.id).then((d) => {
      setDesigner(d);
      if (d) setDraft(initDraft(d));
    }).finally(() => setLoading(false));
  }, [myDesigner, authLoading, navigate]);

  const handleSave = async (redirect = true) => {
    if (!draft || !myDesigner || !designer) return;
    setSaving(true);
    const socialLinks = Object.fromEntries(
      Object.entries(draft.socialLinks).filter(([, v]) => v !== "")
    );
    const result = await updateDesigner(designer.id, {
      name: draft.name,
      profileImageUrl: draft.profileImageUrl || null,
      bio: draft.bio || null,
      availabilityStatus: draft.availabilityStatus || null,
      availabilityNote: draft.availabilityNote || null,
      socialLinks: Object.keys(socialLinks).length > 0 ? socialLinks : null,
    });
    setSaving(false);
    if (result) {
      if (redirect && designer.slug) {
        navigate(`/p/${designer.slug}`);
      } else {
        setSaveMsg("success");
        setTimeout(() => setSaveMsg(null), 3000);
      }
    } else {
      setSaveMsg("error");
      setTimeout(() => setSaveMsg(null), 3000);
    }
  };

  if (loading) return <div className="p-8 text-on-surface-variant">読み込み中...</div>;
  if (!designer || !draft) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !designer) return;
    setUploading(true);
    try {
      const url = await uploadProfileImage(file, designer.id);
      if (url) {
        set("profileImageUrl", url);
      } else {
        setSaveMsg("error");
        setTimeout(() => setSaveMsg(null), 3000);
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const set = (key: keyof Omit<Draft, "socialLinks">, value: string) =>
    setDraft((d) => d ? { ...d, [key]: value } : d);
  const setSocial = (key: keyof Draft["socialLinks"], value: string) =>
    setDraft((d) => d ? { ...d, socialLinks: { ...d.socialLinks, [key]: value } } : d);

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-24">
      {/* Header */}
      <div className="pt-8 space-y-1">
        <h1 className="type-headline-lg text-on-surface">プロフィール編集</h1>
        <p className="type-body-sm text-on-surface-variant">
          公開ポートフォリオに表示される情報を編集できます
        </p>
      </div>

      {/* Profile Image */}
      <section className="rounded-2xl bg-surface-container-low p-6 space-y-5">
        <h2 className="type-title-md text-on-surface">基本情報</h2>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="relative h-16 w-16 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden shrink-0 hover:opacity-80 transition-opacity group"
          >
            {draft.profileImageUrl ? (
              <img
                src={draft.profileImageUrl}
                alt=""
                className="h-full w-full object-cover"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            ) : (
              <span className="type-headline-sm text-on-surface-variant">{draft.name[0]}</span>
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
              {uploading ? (
                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
              )}
            </div>
          </button>
          <div>
            <p className="type-label-sm text-on-surface-variant">プロフィール画像</p>
            <p className="type-body-sm text-on-surface-variant/60 mt-0.5">クリックして画像を選択</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        <div className="space-y-1.5">
          <label className="type-label-sm text-on-surface-variant flex items-center gap-1.5">
            氏名
            <span className="type-label-sm text-error">必須</span>
          </label>
          <Input
            value={draft.name}
            onChange={(e) => set("name", e.target.value)}
            className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface"
          />
        </div>

        <div className="space-y-1.5">
          <label className="type-label-sm text-on-surface-variant flex items-center gap-1.5">
            自己紹介
            <span className="type-label-sm text-error">必須</span>
          </label>
          <Textarea
            value={draft.bio}
            onChange={(e) => set("bio", e.target.value)}
            placeholder="3〜5行で自己紹介を記入"
            className="bg-surface-container-high border-none rounded-lg type-body-md text-on-surface min-h-28"
          />
        </div>
      </section>

      {/* Availability */}
      <section className="rounded-2xl bg-surface-container-low p-6 space-y-5">
        <h2 className="type-title-md text-on-surface">稼働状況</h2>

        <div className="space-y-1.5">
          <label className="type-label-sm text-on-surface-variant flex items-center gap-1.5">
            ステータス
            <span className="type-label-sm text-error">必須</span>
          </label>
          <select
            value={draft.availabilityStatus}
            onChange={(e) => set("availabilityStatus", e.target.value)}
            className="w-full bg-surface-container-high border-none rounded-lg h-10 px-3 type-body-md text-on-surface outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
          >
            <option value="">選択してください</option>
            {AvailabilityStatus.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="type-label-sm text-on-surface-variant block">補足</label>
          <Input
            value={draft.availabilityNote}
            onChange={(e) => set("availabilityNote", e.target.value)}
            placeholder="例: 2025年7月〜稼働可能"
            className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface"
          />
        </div>
      </section>

      {/* SNS Links */}
      <section className="rounded-2xl bg-surface-container-low p-6 space-y-5">
        <h2 className="type-title-md text-on-surface">SNSリンク</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              { key: "x", label: "X (Twitter)", placeholder: "https://x.com/..." },
              { key: "note", label: "note", placeholder: "https://note.com/..." },
              { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/..." },
              { key: "github", label: "GitHub", placeholder: "https://github.com/..." },
              { key: "dribbble", label: "Dribbble", placeholder: "https://dribbble.com/..." },
              { key: "behance", label: "Behance", placeholder: "https://behance.net/..." },
            ] as { key: keyof Draft["socialLinks"]; label: string; placeholder: string }[]
          ).map(({ key, label, placeholder }) => (
            <div key={key} className="space-y-1.5">
              <label className="type-label-sm text-on-surface-variant block">{label}</label>
              <Input
                value={draft.socialLinks[key]}
                onChange={(e) => setSocial(key, e.target.value)}
                placeholder={placeholder}
                type="url"
                className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface"
              />
            </div>
          ))}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="type-label-sm text-on-surface-variant block">個人サイト</label>
            <Input
              value={draft.socialLinks.website}
              onChange={(e) => setSocial("website", e.target.value)}
              placeholder="https://..."
              type="url"
              className="bg-surface-container-high border-none rounded-lg h-10 type-body-md text-on-surface"
            />
          </div>
        </div>
      </section>

      {/* Floating Save Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-outline-variant/30">
        <div className="max-w-2xl mx-auto px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {saveMsg === "success" && (
              <span className="type-label-sm text-tertiary">保存しました</span>
            )}
            {saveMsg === "error" && (
              <span className="type-label-sm text-error">保存に失敗しました</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => handleSave(true)}
              disabled={saving}
              variant="outline"
              className="rounded-2xl px-6 disabled:opacity-60 bg-white"
            >
              {saving ? "保存中..." : "保存"}
            </Button>
            {isFirstTime && draft.name && draft.bio && draft.availabilityStatus && (
              <Button
                onClick={async () => {
                  await handleSave(false);
                  navigate("/upload");
                }}
                disabled={saving}
                className="gradient-primary text-on-primary rounded-2xl px-6 disabled:opacity-60"
              >
                ポートフォリオをアップロード →
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
