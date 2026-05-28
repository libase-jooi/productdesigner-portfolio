-- RLS for projects and work_history tables

alter table public.projects enable row level security;
alter table public.work_history enable row level security;

-- Public read (for portfolio viewing without auth)
create policy "Public can view projects"
  on public.projects for select using (true);

create policy "Public can view work_history"
  on public.work_history for select using (true);

-- Owners can update their own projects
create policy "Owners can update projects"
  on public.projects for update
  using (
    exists (
      select 1 from public.designers d
      where d.id = projects.designer_id
        and d.auth_user_id = auth.uid()
    )
  );

-- Owners can update their own work_history
create policy "Owners can update work_history"
  on public.work_history for update
  using (
    exists (
      select 1 from public.designers d
      where d.id = work_history.designer_id
        and d.auth_user_id = auth.uid()
    )
  );

-- Also ensure designers has a public SELECT policy for the subqueries above to work
create policy "Public can view designers"
  on public.designers for select using (true);
