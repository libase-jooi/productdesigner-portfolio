import { supabase } from "@/lib/supabase";
import type { Designer, DesignerWithRelations, Project, WorkHistory } from "./schema";

function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\x00-\x7F]/g, "")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/^-+|-+$/g, "");
  const suffix = Math.random().toString(36).slice(2, 8);
  return base ? `${base}-${suffix}` : `designer-${suffix}`;
}

// ─── Row mappers (snake_case DB → camelCase TypeScript) ──────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDesigner(row: any): Designer {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    status: row.status,
    sourceUrl: row.source_url,
    sourceType: row.source_type,
    importedAt: row.imported_at,
    publishedAt: row.published_at,
    profileImageUrl: row.profile_image_url,
    bio: row.bio,
    socialLinks: row.social_links,
    availabilityStatus: row.availability_status,
    availabilityNote: row.availability_note,
    skillScores: row.skill_scores,
    subSkillScores: row.sub_skill_scores,
    rawText: row.raw_text,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProject(row: any): Project {
  return {
    id: row.id,
    designerId: row.designer_id,
    title: row.title,
    thumbnailUrl: row.thumbnail_url,
    overview: row.overview,
    period: row.period,
    team: row.team,
    role: row.role,
    background: row.background,
    issues: row.issues ?? [],
    approach: row.approach ?? [],
    keyDecisions: row.key_decisions ?? [],
    outputs: row.outputs,
    figmaUrl: row.figma_url,
    results: row.results,
    metrics: row.metrics ?? [],
    quote: row.quote,
    domainTags: row.domain_tags ?? [],
    phaseTags: row.phase_tags ?? [],
    skillTags: row.skill_tags ?? [],
    confidence: row.confidence,
    reviewStatus: row.review_status,
    notes: row.notes,
    rawJson: row.raw_json,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapWorkHistory(row: any): WorkHistory {
  return {
    id: row.id,
    designerId: row.designer_id,
    company: row.company,
    role: row.role,
    periodStart: row.period_start,
    periodEnd: row.period_end,
    isCurrent: row.is_current,
    description: row.description,
    domainTags: row.domain_tags ?? [],
    employmentType: row.employment_type,
    confidence: row.confidence,
    reviewStatus: row.review_status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ─── Query functions ─────────────────────────────────────────────────────────

export async function getDesigners(): Promise<DesignerWithRelations[]> {
  const { data, error } = await supabase
    .from("designers")
    .select("*, projects(*), work_history(*)")
    .order("created_at");
  if (error || !data) return [];
  return data.map((row) => ({
    ...mapDesigner(row),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    projects: (row.projects as any[] ?? []).map(mapProject),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    workHistory: (row.work_history as any[] ?? []).map(mapWorkHistory),
  }));
}

export async function getDesignerBySlug(slug: string): Promise<DesignerWithRelations | null> {
  const { data, error } = await supabase
    .from("designers")
    .select("*, projects(*), work_history(*)")
    .eq("slug", slug)
    .single();
  if (error || !data) return null;
  return {
    ...mapDesigner(data),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    projects: (data.projects as any[] ?? []).map(mapProject),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    workHistory: (data.work_history as any[] ?? []).map(mapWorkHistory),
  };
}

export async function getDesignerById(id: string): Promise<DesignerWithRelations | null> {
  const { data, error } = await supabase
    .from("designers")
    .select("*, projects(*), work_history(*)")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return {
    ...mapDesigner(data),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    projects: (data.projects as any[] ?? []).map(mapProject),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    workHistory: (data.work_history as any[] ?? []).map(mapWorkHistory),
  };
}

export async function uploadProfileImage(
  file: File,
  userId: string
): Promise<string | null> {
  const ext = file.name.split(".").pop();
  const path = `${userId}.${ext}`;
  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true });
  if (error) return null;
  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  return data.publicUrl;
}

export async function updateDesigner(
  id: string,
  fields: {
    name?: string;
    slug?: string;
    status?: string;
    sourceUrl?: string | null;
    sourceType?: string | null;
    profileImageUrl?: string | null;
    bio?: string | null;
    availabilityStatus?: string | null;
    availabilityNote?: string | null;
    socialLinks?: Record<string, string> | null;
  }
): Promise<Designer | null> {
  const row: Record<string, unknown> = {};
  if (fields.name !== undefined) row.name = fields.name;
  if (fields.slug !== undefined) row.slug = fields.slug;
  if (fields.status !== undefined) row.status = fields.status;
  if (fields.sourceUrl !== undefined) row.source_url = fields.sourceUrl;
  if (fields.sourceType !== undefined) row.source_type = fields.sourceType;
  if (fields.profileImageUrl !== undefined) row.profile_image_url = fields.profileImageUrl;
  if (fields.bio !== undefined) row.bio = fields.bio;
  if (fields.availabilityStatus !== undefined) row.availability_status = fields.availabilityStatus;
  if (fields.availabilityNote !== undefined) row.availability_note = fields.availabilityNote;
  if (fields.socialLinks !== undefined) row.social_links = fields.socialLinks;

  const { data, error } = await supabase
    .from("designers")
    .update(row)
    .eq("id", id)
    .select()
    .single();
  if (error || !data) return null;
  return mapDesigner(data);
}

export async function getDesignerByAuthUserId(
  authUserId: string
): Promise<DesignerWithRelations | null> {
  const { data, error } = await supabase
    .from("designers")
    .select("*, projects(*), work_history(*)")
    .eq("auth_user_id", authUserId)
    .single();
  if (error || !data) return null;
  return {
    ...mapDesigner(data),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    projects: (data.projects as any[] ?? []).map(mapProject),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    workHistory: (data.work_history as any[] ?? []).map(mapWorkHistory),
  };
}

export async function createDesigner(
  name: string,
  authUserId: string
): Promise<Designer | null> {
  const slug = generateSlug(name);
  const { data, error } = await supabase
    .from("designers")
    .insert({ name, auth_user_id: authUserId, slug })
    .select()
    .single();
  if (error) return null;
  if (!data) return null;
  return mapDesigner(data);
}

export async function setDesignerPublished(
  id: string,
  publish: boolean
): Promise<Designer | null> {
  const { data, error } = await supabase
    .from("designers")
    .update({ published_at: publish ? new Date().toISOString() : null })
    .eq("id", id)
    .select()
    .single();
  if (error || !data) return null;
  return mapDesigner(data);
}

export async function analyzePortfolio(params: {
  type: "pdf" | "url";
  content?: string;
  url?: string;
  designerId: string;
}): Promise<{ slug: string } | { error: string }> {
  const { data, error } = await supabase.functions.invoke("analyze-portfolio", {
    body: params,
  });
  if (error) return { error: error.message };
  if (data?.error) return { error: data.error };
  return { slug: data.slug };
}

export async function getProjectById(
  id: string
): Promise<{ project: Project; designer: DesignerWithRelations } | null> {
  const { data: projectRow, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !projectRow) return null;
  const designer = await getDesignerById(projectRow.designer_id);
  if (!designer) return null;
  return { project: mapProject(projectRow), designer };
}
