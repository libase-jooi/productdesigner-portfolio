import { createContext, useContext, useEffect, useState } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import {
  getDesignerByAuthUserId,
  createDesigner,
  updateDesigner,
} from "@/api/supabase";
import type { DesignerWithRelations } from "@/api/schema";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  myDesigner: DesignerWithRelations | null;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [myDesigner, setMyDesigner] = useState<DesignerWithRelations | null>(null);

  const loadMyDesigner = async (userId: string) => {
    let designer = await getDesignerByAuthUserId(userId);
    if (designer && !designer.slug) {
      const base = designer.name.toLowerCase().replace(/\s+/g, "-").replace(/[^\x00-\x7F]/g, "").replace(/[^a-z0-9-]/g, "").replace(/^-+|-+$/g, "");
      const suffix = Math.random().toString(36).slice(2, 8);
      const slug = base ? `${base}-${suffix}` : `designer-${suffix}`;
      const updated = await updateDesigner(designer.id, { slug });
      if (updated) designer = { ...designer, slug: updated.slug };
    }
    setMyDesigner(designer);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadMyDesigner(session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadMyDesigner(session.user.id);
      } else {
        setMyDesigner(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    if (data.user) {
      const designer = await createDesigner(name, data.user.id);
      if (designer) {
        setMyDesigner({ ...designer, projects: [], workHistory: [] });
      }
    }
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setMyDesigner(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, myDesigner, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
