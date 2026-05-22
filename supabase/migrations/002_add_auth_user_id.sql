-- auth_user_id カラムを追加（Supabase Authユーザーとdesignersテーブルを紐付け）
alter table public.designers
  add column auth_user_id uuid references auth.users(id) on delete set null unique;

-- サインアップ時点ではsource情報がないためnullableに変更
alter table public.designers
  alter column source_url drop not null,
  alter column source_type drop not null;

-- 自分のレコードのみ更新可能なRLSポリシーを追加
create policy "Users can update own designer"
  on public.designers for update
  using (auth.uid() = auth_user_id);

-- 認証ユーザーは自分のデザイナーレコードを作成可能
create policy "Users can insert own designer"
  on public.designers for insert
  with check (auth.uid() = auth_user_id);
