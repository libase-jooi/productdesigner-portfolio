import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { mockDesigners } from "@/api/mock";
import type { DesignerWithRelations, Confidence } from "@/api/schema";

/** AI入力の完了度を算出 */
function calcCompletionRate(d: DesignerWithRelations): number {
  if (d.projects.length === 0) return 0;
  let filled = 0;
  let total = 0;
  const requiredFields: (keyof (typeof d.projects)[0])[] = [
    "title",
    "overview",
    "period",
    "role",
    "background",
    "domainTags",
    "phaseTags",
    "skillTags",
  ];
  for (const p of d.projects) {
    for (const f of requiredFields) {
      total++;
      const v = p[f];
      if (v !== null && v !== undefined && !(Array.isArray(v) && v.length === 0)) {
        filled++;
      }
    }
  }
  return Math.round((filled / total) * 100);
}

function confidenceColor(c: Confidence) {
  switch (c) {
    case "高":
      return "bg-tertiary-fixed text-on-tertiary-container";
    case "中":
      return "bg-surface-container-high text-on-surface-variant";
    case "低":
      return "bg-error-container text-on-error-container";
  }
}

export function AdminDesignerListPage() {
  const designers = mockDesigners;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="type-headline-lg text-on-surface">デザイナー管理</h1>
          <p className="type-body-sm text-on-surface-variant mt-1">
            AI自動入力の進捗と信頼度を一覧で管理
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          label="登録デザイナー"
          value={String(designers.length)}
          sub="名"
        />
        <SummaryCard
          label="AI入力完了"
          value={String(designers.filter((d) => d.status === "完了").length)}
          sub={`/ ${designers.length}`}
        />
        <SummaryCard
          label="要確認"
          value={String(designers.filter((d) => d.status === "要確認").length)}
          sub="件"
          alert={designers.some((d) => d.status === "要確認")}
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-surface-container-low overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="type-label-md text-on-surface-variant pl-6">
                デザイナー
              </TableHead>
              <TableHead className="type-label-md text-on-surface-variant">
                ステータス
              </TableHead>
              <TableHead className="type-label-md text-on-surface-variant">
                ソース
              </TableHead>
              <TableHead className="type-label-md text-on-surface-variant">
                PJ数
              </TableHead>
              <TableHead className="type-label-md text-on-surface-variant">
                AI入力率
              </TableHead>
              <TableHead className="type-label-md text-on-surface-variant">
                信頼度
              </TableHead>
              <TableHead className="type-label-md text-on-surface-variant">
                取り込み日
              </TableHead>
              <TableHead className="type-label-md text-on-surface-variant pr-6 text-right">
                操作
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {designers.map((d) => {
              const rate = calcCompletionRate(d);
              const avgConfidence =
                d.projects.length > 0
                  ? d.projects.reduce(
                      (acc, p) =>
                        acc +
                        (p.confidence === "高" ? 3 : p.confidence === "中" ? 2 : 1),
                      0
                    ) / d.projects.length
                  : 0;
              const confLabel: Confidence =
                avgConfidence >= 2.5 ? "高" : avgConfidence >= 1.5 ? "中" : "低";

              return (
                <TableRow
                  key={d.id}
                  className="hover:bg-surface-container transition-colors"
                >
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center type-label-md">
                        {d.name[0]}
                      </div>
                      <span className="type-title-sm text-on-surface">
                        {d.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={d.status} />
                  </TableCell>
                  <TableCell className="type-body-sm text-on-surface-variant">
                    {d.sourceType}
                  </TableCell>
                  <TableCell className="type-body-sm text-on-surface-variant">
                    {d.projects.length}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 w-32">
                      <Progress
                        value={rate}
                        className="h-1.5 bg-surface-container-high [&>div]:bg-primary"
                      />
                      <span className="type-label-sm text-on-surface-variant w-8 text-right">
                        {rate}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {d.projects.length > 0 ? (
                      <Badge
                        className={`rounded-full border-none type-label-sm ${confidenceColor(confLabel)}`}
                      >
                        {confLabel}
                      </Badge>
                    ) : (
                      <span className="type-label-sm text-on-surface-variant">
                        —
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="type-body-sm text-on-surface-variant">
                    {new Date(d.importedAt).toLocaleDateString("ja-JP")}
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <Link to={`/admin/designers/${d.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="type-label-md text-primary hover:bg-primary-fixed rounded-lg"
                      >
                        編集
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  sub,
  alert,
}: {
  label: string;
  value: string;
  sub: string;
  alert?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-5 space-y-1 ${
        alert
          ? "bg-error-container"
          : "bg-surface-container-low"
      }`}
    >
      <p
        className={`type-label-md ${
          alert ? "text-on-error-container" : "text-on-surface-variant"
        }`}
      >
        {label}
      </p>
      <p
        className={`type-display-sm ${
          alert ? "text-on-error-container" : "text-on-surface"
        }`}
      >
        {value}
        <span className="type-body-md ml-1">{sub}</span>
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    完了: "bg-tertiary-fixed text-on-tertiary-container",
    要確認: "bg-error-container text-on-error-container",
    処理中: "bg-surface-container-high text-on-surface-variant",
  };
  return (
    <Badge
      className={`rounded-full px-3 py-0.5 type-label-sm border-none ${variants[status] ?? variants["処理中"]}`}
    >
      {status}
    </Badge>
  );
}
