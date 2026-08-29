# Q.LIGHTING 재고관리 시스템

Supabase(데이터베이스+로그인) + Vercel(호스팅)로 배포하는 회사 전용 재고관리 웹앱입니다.

## 배포 방법 (요약)

1. Supabase 프로젝트를 만들고 `supabase_schema.sql`을 SQL Editor에서 실행합니다. (이미 하셨다면 생략)
2. 이 폴더 전체를 GitHub 새 저장소에 업로드합니다.
3. vercel.com 에서 GitHub 계정으로 로그인 → 방금 만든 저장소를 Import → 별도 환경변수 설정 없이 그대로 Deploy 를 누릅니다.
   (Supabase 연결 정보는 `src/supabaseClient.js`에 이미 포함되어 있습니다.)
4. 배포된 주소로 접속해 본인 아이디로 회원가입 → Supabase "Table Editor" → `profiles` 테이블에서
   본인 행의 `role`을 `admin`, `status`를 `approved`로 바꿔주면 첫 관리자 계정이 완성됩니다.
5. 이후 새로 가입하는 직원은 앱 안의 "관리자" 화면에서 승인하면 됩니다.

## 로컬에서 미리 확인하고 싶다면

```
npm install
npm run dev
```

## 권한 구조

- **관리자(admin)**: 품목/입출고/거래처/회원가입/변경요청을 모두 직접 처리
- **일반회원(member)**: 품목·거래처·입출고 신규 등록은 자유롭게 가능하지만,
  기존 품목/입출고 기록의 **수정·삭제는 관리자 승인**이 필요합니다. (거래처 수정/삭제는 승인 없이 가능)
- 일정(캘린더)은 회원 누구나 자유롭게 등록/수정/삭제할 수 있습니다.
