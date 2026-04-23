/**
 * API Schema — フロント・バックエンド共通の型定義
 *
 * このファイルはバックエンドとの契約です。
 * バックエンドはこの型に準拠したJSONを返してください。
 */

// ─── Enums ──────────────────────────────────────────

export const DesignerStatus = ["処理中", "完了", "要確認"] as const;
export type DesignerStatus = (typeof DesignerStatus)[number];

export const SourceType = ["PDF", "Behance", "Dribbble", "Webサイト", "Wantedly + Notion", "Notion", "その他"] as const;
export type SourceType = (typeof SourceType)[number];

export const Confidence = ["高", "中", "低"] as const;
export type Confidence = (typeof Confidence)[number];

export const ReviewStatus = ["未確認", "確認済", "要修正"] as const;
export type ReviewStatus = (typeof ReviewStatus)[number];

export const EmploymentType = ["正社員", "契約", "フリーランス", "副業", "インターン"] as const;
export type EmploymentType = (typeof EmploymentType)[number];

export const PhaseTag = ["0→1", "グロース", "改善", "リニューアル", "デザインシステム"] as const;
export type PhaseTag = (typeof PhaseTag)[number];

export const AvailabilityStatus = ["募集中", "稼働可能（時期指定）", "稼働中", "相談可"] as const;
export type AvailabilityStatus = (typeof AvailabilityStatus)[number];

// Domain / Skill タグは新規追加OKなので string
export type DomainTag = string;
export type SkillTag = string;

// SNSリンク
export interface SocialLinks {
  x?: string;       // X (Twitter) URL
  note?: string;    // note URL
  linkedin?: string; // LinkedIn URL
  github?: string;   // GitHub URL
  dribbble?: string; // Dribbble URL
  behance?: string;  // Behance URL
  website?: string;  // 個人サイト URL
}

// 5軸スキル診断スコア
export interface SkillScores {
  strategyDesign: number;    // 1. ビジネス推進力（1〜5）
  research: number;          // 2. 課題設定力（1〜5）
  uxDesign: number;          // 3. UX設計力（1〜5）
  uiImplementation: number;  // 4. 画面設計・実装運用力（1〜5）
  aiUtilization: number;     // 5. AI活用力（1〜5）
}

// サブスキル別スコア（各1〜5）
export type SubSkillScores = Record<string, number>;

// ─── Resources ──────────────────────────────────────

export interface Designer {
  id: string;
  name: string;
  slug: string | null; // ポートフォリオURL用 e.g. "hirose-saori" (null = 未設定)
  status: DesignerStatus;
  sourceUrl: string;
  sourceType: SourceType;
  importedAt: string; // ISO 8601
  publishedAt: string | null; // null = 非公開
  profileImageUrl: string | null;
  bio: string | null; // 自己紹介文（3〜5行程度）
  socialLinks: SocialLinks | null; // SNSリンク
  availabilityStatus: AvailabilityStatus | null; // 稼働状況
  availabilityNote: string | null; // 稼働状況の補足（例: "2025年7月〜"）
  skillScores: SkillScores | null; // 5軸スキル診断スコア（各1〜5）
  subSkillScores: SubSkillScores | null; // サブスキル別スコア
  rawText: string | null; // 抽出した生テキスト（デバッグ用）
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  designerId: string;
  title: string;
  thumbnailUrl: string | null;
  overview: string | null;
  period: string | null;
  team: string | null;
  role: string | null;
  background: string | null;
  issues: string[];
  approach: string[];
  keyDecisions: string[];
  outputs: string | null;
  figmaUrl: string | null;
  results: string | null;
  metrics: string[];
  quote: string | null;
  domainTags: DomainTag[];
  phaseTags: PhaseTag[];
  skillTags: SkillTag[];
  confidence: Confidence;
  reviewStatus: ReviewStatus;
  notes: string | null;
  rawJson: string | null; // AI出力の生データ（デバッグ用）
  createdAt: string;
  updatedAt: string;
}

export interface WorkHistory {
  id: string;
  designerId: string;
  company: string;
  role: string | null;
  periodStart: string | null; // ISO 8601 date
  periodEnd: string | null;
  isCurrent: boolean;
  description: string | null;
  domainTags: DomainTag[];
  employmentType: EmploymentType | null;
  confidence: Confidence;
  reviewStatus: ReviewStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── API Responses ──────────────────────────────────

export interface DesignerWithRelations extends Designer {
  projects: Project[];
  workHistory: WorkHistory[];
}

// ─── API Endpoints (参照用) ─────────────────────────
//
// GET    /api/designers              → Designer[]
// GET    /api/designers/:id          → DesignerWithRelations
// POST   /api/designers              → Designer
// PATCH  /api/designers/:id          → Designer
// DELETE /api/designers/:id          → void
//
// GET    /api/designers/:id/projects → Project[]
// GET    /api/projects/:id           → Project
// POST   /api/projects               → Project
// PATCH  /api/projects/:id           → Project
// DELETE /api/projects/:id           → void
//
// GET    /api/designers/:id/work-history → WorkHistory[]
// PATCH  /api/work-history/:id          → WorkHistory
