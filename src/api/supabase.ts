import { supabase } from "@/lib/supabase";
import type { Designer, DesignerWithRelations, Project, WorkHistory } from "./schema";

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
  const { data, error } = await supabase
    .from("designers")
    .insert({ name, auth_user_id: authUserId })
    .select()
    .single();
  if (error) return null;
  if (!data) return null;
  return mapDesigner(data);
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
