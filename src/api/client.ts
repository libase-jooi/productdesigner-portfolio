/**
 * API Client
 *
 * 現在はモックデータを返す。
 * バックエンド実装後、fetch に差し替える。
 */

import type {
  Designer,
  DesignerWithRelations,
  Project,
  WorkHistory,
} from "./schema";

const API_BASE = import.meta.env.VITE_API_BASE ?? "/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

// ─── Designers ──────────────────────────────────────

export const designers = {
  list: () => request<Designer[]>("/designers"),
  get: (id: string) => request<DesignerWithRelations>(`/designers/${id}`),
  create: (data: Partial<Designer>) =>
    request<Designer>("/designers", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Designer>) =>
    request<Designer>(`/designers/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

// ─── Projects ───────────────────────────────────────

export const projects = {
  listByDesigner: (designerId: string) =>
    request<Project[]>(`/designers/${designerId}/projects`),
  get: (id: string) => request<Project>(`/projects/${id}`),
  create: (data: Partial<Project>) =>
    request<Project>("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Project>) =>
    request<Project>(`/projects/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

// ─── Work History ───────────────────────────────────

export const workHistory = {
  listByDesigner: (designerId: string) =>
    request<WorkHistory[]>(`/designers/${designerId}/work-history`),
  update: (id: string, data: Partial<WorkHistory>) =>
    request<WorkHistory>(`/work-history/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

export const api = { designers, projects, workHistory };
