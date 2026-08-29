import { createClient } from "@supabase/supabase-js";

// 회사 전체가 공유하는 Supabase 프로젝트 연결 정보
// publishable(anon) 키는 공개되어도 안전하도록 설계된 값입니다.
// 실제 데이터 접근 권한은 Supabase의 Row Level Security(RLS) 정책으로 보호됩니다.
const SUPABASE_URL = "https://yxefmcpymwvijfbljfnm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_LAgRKHT2LsPOCZYXpQOy-A_aZ4tT93U";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// 로그인 아이디를 Supabase Auth가 요구하는 이메일 형식으로 변환
// (실제 메일을 받을 필요는 없는 내부용 가짜 도메인입니다)
export function usernameToEmail(username) {
  return `${username.trim().toLowerCase()}@qlighting-app.com`;
}
