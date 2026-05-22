-- ─── designers ──────────────────────────────────────────────────────────────

create table public.designers (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null,
  slug               text unique,
  status             text not null default '処理中'
                       check (status in ('処理中', '完了', '要確認')),
  source_url         text not null,
  source_type        text not null
                       check (source_type in ('PDF', 'Behance', 'Dribbble', 'Webサイト', 'Wantedly + Notion', 'Notion', 'その他')),
  imported_at        timestamptz not null default now(),
  published_at       timestamptz,
  profile_image_url  text,
  bio                text,
  social_links       jsonb,
  availability_status text
                       check (availability_status in ('募集中', '稼働可能（時期指定）', '稼働中', '相談可')),
  availability_note  text,
  skill_scores       jsonb,
  sub_skill_scores   jsonb,
  raw_text           text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- ─── projects ───────────────────────────────────────────────────────────────

create table public.projects (
  id              uuid primary key default gen_random_uuid(),
  designer_id     uuid not null references public.designers(id) on delete cascade,
  title           text not null,
  thumbnail_url   text,
  overview        text,
  period          text,
  team            text,
  role            text,
  background      text,
  issues          text[] not null default '{}',
  approach        text[] not null default '{}',
  key_decisions   text[] not null default '{}',
  outputs         text,
  figma_url       text,
  results         text,
  metrics         text[] not null default '{}',
  quote           text,
  domain_tags     text[] not null default '{}',
  phase_tags      text[] not null default '{}',
  skill_tags      text[] not null default '{}',
  confidence      text not null default '中'
                    check (confidence in ('高', '中', '低')),
  review_status   text not null default '未確認'
                    check (review_status in ('未確認', '確認済', '要修正')),
  notes           text,
  raw_json        text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ─── work_history ────────────────────────────────────────────────────────────

create table public.work_history (
  id               uuid primary key default gen_random_uuid(),
  designer_id      uuid not null references public.designers(id) on delete cascade,
  company          text not null,
  role             text,
  period_start     date,
  period_end       date,
  is_current       boolean not null default false,
  description      text,
  domain_tags      text[] not null default '{}',
  employment_type  text
                     check (employment_type in ('正社員', '契約', 'フリーランス', '副業', 'インターン')),
  confidence       text not null default '中'
                     check (confidence in ('高', '中', '低')),
  review_status    text not null default '未確認'
                     check (review_status in ('未確認', '確認済', '要修正')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ─── updated_at 自動更新トリガー ────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger designers_updated_at
  before update on public.designers
  for each row execute function public.set_updated_at();

create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

create trigger work_history_updated_at
  before update on public.work_history
  for each row execute function public.set_updated_at();
