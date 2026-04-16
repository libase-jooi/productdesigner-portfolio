/**
 * Proto用: 現在ログイン中のデザイナーを管理するhook
 * バックエンド接続後に認証ベースに置き換え
 */
import { useSyncExternalStore, useCallback } from "react";
import { mockDesigners } from "@/api/mock";
import type { DesignerWithRelations } from "@/api/schema";

const STORAGE_KEY = "jooi_current_designer_id";

// デフォルトは最初のデザイナー
function getSnapshot(): string {
  return localStorage.getItem(STORAGE_KEY) ?? mockDesigners[0].id;
}

const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function setCurrentDesignerId(id: string) {
  localStorage.setItem(STORAGE_KEY, id);
  listeners.forEach((cb) => cb());
}

export function useCurrentDesigner() {
  const currentId = useSyncExternalStore(subscribe, getSnapshot);
  const designer = mockDesigners.find((d) => d.id === currentId) ?? mockDesigners[0];

  const switchDesigner = useCallback((id: string) => {
    setCurrentDesignerId(id);
  }, []);

  return {
    designer,
    allDesigners: mockDesigners,
    switchDesigner,
  } as const;
}

/** localStorageから現在のdesignerを直接取得（hook外用） */
export function getCurrentDesigner(): DesignerWithRelations {
  const id = localStorage.getItem(STORAGE_KEY) ?? mockDesigners[0].id;
  return mockDesigners.find((d) => d.id === id) ?? mockDesigners[0];
}
