-- ============================================================
-- 거래처(vendors) 수정/삭제 권한 보정
-- 품목/입출고와 달리 거래처는 승인된 회원이면 누구나
-- 바로 수정/삭제할 수 있도록 허용합니다. (관리자 승인 불필요)
-- Supabase SQL Editor에서 이 파일 내용을 실행해주세요.
-- ============================================================

drop policy if exists "관리자 수정" on vendors;
drop policy if exists "관리자 삭제" on vendors;

create policy "승인회원 수정" on vendors for update using (is_approved());
create policy "승인회원 삭제" on vendors for delete using (is_approved());
