import Anthropic from "npm:@anthropic-ai/sdk@0.36.3";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `あなたはプロダクトデザイナーのポートフォリオを分析する専門家です。
提供されたポートフォリオから情報を抽出し、必ず有効なJSONのみを返してください。
コードブロック、説明文、前置きは一切含めないでください。JSONのみです。`;

const USER_PROMPT = `このポートフォリオを分析し、以下のJSON構造で情報を抽出してください。
情報が不明な場合はnullを使用してください。

{
  "designer": {
    "name": "氏名",
    "bio": "自己紹介文（3〜5文、ポートフォリオの内容から自然な文章で）",
    "availabilityStatus": "募集中 | 稼働可能（時期指定） | 稼働中 | 相談可 | null",
    "availabilityNote": "稼働補足またはnull",
    "socialLinks": {
      "x": "URLまたはnull",
      "linkedin": "URLまたはnull",
      "github": "URLまたはnull",
      "dribbble": "URLまたはnull",
      "behance": "URLまたはnull",
      "note": "URLまたはnull",
      "website": "URLまたはnull"
    },
    "skillScores": {
      "strategyDesign": 1から5の整数,
      "research": 1から5の整数,
      "uxDesign": 1から5の整数,
      "uiImplementation": 1から5の整数,
      "aiUtilization": 1から5の整数
    }
  },
  "projects": [
    {
      "title": "プロジェクト名",
      "overview": "概要（1〜2文）",
      "period": "期間（例: 2023年4月〜2024年3月）またはnull",
      "team": "チーム構成またはnull",
      "role": "役割またはnull",
      "background": "背景・課題またはnull",
      "issues": ["課題1", "課題2"],
      "approach": ["アプローチ1", "アプローチ2"],
      "keyDecisions": ["重要な判断1"],
      "outputs": "成果物またはnull",
      "results": "結果・成果またはnull",
      "metrics": ["指標名: 値"],
      "domainTags": ["BtoB", "BtoC", "社内ツール", "0→1", "グロース"などから適切なもの],
      "phaseTags": ["リサーチ", "UX設計", "UI設計", "実装連携", "グロース改善"などから適切なもの],
      "skillTags": ["UXリサーチ", "情報設計", "プロトタイピング", "デザインシステム"などから適切なもの],
      "confidence": "高 | 中 | 低"
    }
  ],
  "workHistory": [
    {
      "company": "会社名",
      "role": "役職・役割",
      "periodStart": "YYYY-MM-01形式またはnull",
      "periodEnd": "YYYY-MM-01形式またはnull（現職はnull）",
      "isCurrent": true または false,
      "description": "業務内容の説明またはnull",
      "domainTags": ["タグ"],
      "employmentType": "正社員 | 契約 | フリーランス | 副業 | インターン | null",
      "confidence": "高 | 中 | 低"
    }
  ]
}`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify user auth
    const anonClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user }, error: authError } = await anonClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use service role for DB operations
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { type, content, url, designerId } = await req.json();

    // Verify ownership
    const { data: designerCheck } = await adminClient
      .from("designers")
      .select("id, slug")
      .eq("id", designerId)
      .eq("auth_user_id", user.id)
      .single();
    if (!designerCheck) {
      return new Response(JSON.stringify({ error: "Designer not found or not owned by user" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build Claude API message
    const anthropic = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY")! });

    // deno-lint-ignore no-explicit-any
    let messageContent: any[];

    if (type === "pdf") {
      messageContent = [
        {
          type: "document",
          source: {
            type: "base64",
            media_type: "application/pdf",
            data: content,
          },
        },
        { type: "text", text: USER_PROMPT },
      ];
    } else {
      // URL: fetch content server-side
      const fetchRes = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; JOOi/1.0)" },
      });
      const html = await fetchRes.text();
      const text = html
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 60000);
      messageContent = [
        { type: "text", text: `ポートフォリオURL: ${url}\n\nページコンテンツ:\n${text}\n\n${USER_PROMPT}` },
      ];
    }

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: messageContent }],
    });

    const rawText = message.content[0].type === "text" ? message.content[0].text : "";

    // Extract JSON
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI応答にJSONが含まれていませんでした");
    // deno-lint-ignore no-explicit-any
    const result: any = JSON.parse(jsonMatch[0]);

    const VALID_AVAILABILITY = ["募集中", "稼働可能（時期指定）", "稼働中", "相談可"];
    const VALID_EMPLOYMENT = ["正社員", "契約", "フリーランス", "副業", "インターン"];
    const EMPLOYMENT_MAP: Record<string, string> = { "業務委託": "契約" };
    const CONFIDENCE_MAP: Record<string, string> = { "high": "高", "medium": "中", "low": "低", "高": "高", "中": "中", "低": "低" };

    const safeAvailability = (v: string | null) => v && VALID_AVAILABILITY.includes(v) ? v : null;
    const safeEmployment = (v: string | null) => {
      if (!v) return null;
      if (EMPLOYMENT_MAP[v]) return EMPLOYMENT_MAP[v];
      return VALID_EMPLOYMENT.includes(v) ? v : null;
    };
    const safeConfidence = (v: string) => CONFIDENCE_MAP[v] ?? "中";

    // Update designer record
    const { data: updatedDesigner, error: updateErr } = await adminClient
      .from("designers")
      .update({
        name: result.designer?.name ?? undefined,
        bio: result.designer?.bio ?? null,
        availability_status: safeAvailability(result.designer?.availabilityStatus ?? null),
        availability_note: result.designer?.availabilityNote ?? null,
        social_links: result.designer?.socialLinks ?? null,
        skill_scores: result.designer?.skillScores ?? null,
        raw_text: rawText,
      })
      .eq("id", designerId)
      .select("slug")
      .single();
    if (updateErr) throw updateErr;

    // Replace projects
    await adminClient.from("projects").delete().eq("designer_id", designerId);
    if (result.projects?.length > 0) {
      const { error: projErr } = await adminClient.from("projects").insert(
        // deno-lint-ignore no-explicit-any
        result.projects.map((p: any) => ({
          designer_id: designerId,
          title: p.title,
          overview: p.overview ?? null,
          period: p.period ?? null,
          team: p.team ?? null,
          role: p.role ?? null,
          background: p.background ?? null,
          issues: p.issues ?? [],
          approach: p.approach ?? [],
          key_decisions: p.keyDecisions ?? [],
          outputs: p.outputs ?? null,
          results: p.results ?? null,
          metrics: p.metrics ?? [],
          domain_tags: p.domainTags ?? [],
          phase_tags: p.phaseTags ?? [],
          skill_tags: p.skillTags ?? [],
          confidence: safeConfidence(p.confidence),
          review_status: "未確認",
        }))
      );
      if (projErr) throw projErr;
    }

    // Replace work history
    await adminClient.from("work_history").delete().eq("designer_id", designerId);
    if (result.workHistory?.length > 0) {
      const { error: workErr } = await adminClient.from("work_history").insert(
        // deno-lint-ignore no-explicit-any
        result.workHistory.map((w: any) => ({
          designer_id: designerId,
          company: w.company,
          role: w.role ?? null,
          period_start: w.periodStart ?? null,
          period_end: w.periodEnd ?? null,
          is_current: w.isCurrent ?? false,
          description: w.description ?? null,
          domain_tags: w.domainTags ?? [],
          employment_type: safeEmployment(w.employmentType ?? null),
          confidence: safeConfidence(w.confidence),
          review_status: "未確認",
        }))
      );
      if (workErr) throw workErr;
    }

    return new Response(
      JSON.stringify({ slug: updatedDesigner.slug }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
