-- ============================================================
-- Q.LIGHTING 재고관리 시스템 - Supabase 데이터베이스 설정
-- 이 파일 전체를 복사해서 Supabase 프로젝트의
-- "SQL Editor" 에 붙여넣고 [Run] 버튼을 누르면 끝입니다.
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- 1. 회원 프로필 (역할/승인상태) ----------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  role text not null default 'member' check (role in ('admin','member')),
  status text not null default 'pending' check (status in ('pending','approved')),
  created_at timestamptz not null default now()
);

-- 회원가입하면 자동으로 "일반회원 / 승인대기" 프로필 생성
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, role, status)
  values (new.id, coalesce(new.raw_user_meta_data->>'username', new.email), 'member', 'pending');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- 2. 거래처 ----------
create table if not exists vendors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text,
  phone text,
  email text,
  address text,
  note text,
  created_at timestamptz not null default now()
);

-- ---------- 3. 품목 ----------
create table if not exists items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text,
  unit text default 'EA',
  note text,
  created_at timestamptz not null default now()
);

-- ---------- 4. 입출고 기록 ----------
create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  item_id uuid references items(id) on delete cascade,
  type text not null check (type in ('in','out')),
  out_type text,
  qty numeric not null,
  date date not null,
  vendor_id uuid references vendors(id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);

-- ---------- 5. 캘린더 일정 ----------
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  title text not null,
  note text,
  created_at timestamptz not null default now()
);

-- ---------- 6. 변경 승인 대기 (일반회원의 수정/삭제 요청) ----------
create table if not exists pending_changes (
  id uuid primary key default gen_random_uuid(),
  entity text not null check (entity in ('item','transaction')),
  action text not null check (action in ('edit','delete')),
  target_id uuid not null,
  payload jsonb,
  summary text,
  requested_by text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 권한 규칙 (RLS): 승인된 회원만 조회 가능, 수정/삭제는 관리자만
-- ============================================================
alter table profiles enable row level security;
alter table vendors enable row level security;
alter table items enable row level security;
alter table transactions enable row level security;
alter table events enable row level security;
alter table pending_changes enable row level security;

create or replace function public.is_approved()
returns boolean as $$
  select exists (select 1 from profiles where id = auth.uid() and status = 'approved');
$$ language sql stable;

create or replace function public.is_admin()
returns boolean as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin' and status = 'approved');
$$ language sql stable;

-- profiles
create policy "본인 또는 관리자 조회" on profiles for select using (id = auth.uid() or is_admin());
create policy "관리자만 수정" on profiles for update using (is_admin());

-- vendors
create policy "승인회원 조회" on vendors for select using (is_approved());
create policy "승인회원 등록" on vendors for insert with check (is_approved());
create policy "관리자 수정" on vendors for update using (is_admin());
create policy "관리자 삭제" on vendors for delete using (is_admin());

-- items
create policy "승인회원 조회" on items for select using (is_approved());
create policy "승인회원 등록" on items for insert with check (is_approved());
create policy "관리자 수정" on items for update using (is_admin());
create policy "관리자 삭제" on items for delete using (is_admin());

-- transactions
create policy "승인회원 조회" on transactions for select using (is_approved());
create policy "승인회원 등록" on transactions for insert with check (is_approved());
create policy "관리자 수정" on transactions for update using (is_admin());
create policy "관리자 삭제" on transactions for delete using (is_admin());

-- events (일정은 회원 누구나 자유롭게 관리)
create policy "승인회원 조회" on events for select using (is_approved());
create policy "승인회원 등록" on events for insert with check (is_approved());
create policy "승인회원 수정" on events for update using (is_approved());
create policy "승인회원 삭제" on events for delete using (is_approved());

-- pending_changes (변경 요청함)
create policy "승인회원 조회" on pending_changes for select using (is_approved());
create policy "승인회원 등록" on pending_changes for insert with check (is_approved());
create policy "관리자 삭제(승인/거절 처리)" on pending_changes for delete using (is_admin());
