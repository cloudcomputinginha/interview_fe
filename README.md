# AI Mock Interview Platform

AI 기반 모의면접 플랫폼 프론트엔드

---

## 주요 기능

- 그룹/개인 모의면접 진행 및 리포트 제공
- 참가자별 피드백, 점수, 개선점 등 상세 리포트
- 실시간 알림(면접, 시스템, 피드백 등)
- 프로필/알림/개인정보 설정
- 반응형 UI, 다국어 지원

## 기술 스택

- **Next.js(App Router, TypeScript)**
- **React** (함수형 컴포넌트, 커스텀 훅)
- **Tailwind CSS** (유틸리티 퍼스트 스타일)
- **Shadcn UI, Radix UI** (접근성/일관성)
- **Redux Toolkit** (글로벌 상태)
- **Zod, React Hook Form** (폼/유효성)

## 폴더 구조

\`\`\`
app/
workspace/
interview/
group/
report/ # 그룹 리포트(컴포넌트, 훅, 상수, 타입)
...
components/ # 공통 UI, 알림 헤더 등
hooks/ # 공통 커스텀 훅
...
\`\`\`

## 개발 및 실행

\`\`\`bash

# 의존성 설치

yarn install

# 개발 서버 실행

yarn dev

# 빌드

yarn build
\`\`\`

## 문서화/테스트/기여

- **문서화**: JSDoc, 타입 주석, 폴더별 README 권장
- **테스트**: Jest, React Testing Library 권장
- **코드 스타일**: next-js-rule, toss-frontend-rules 참고
- **기여**: PR/이슈 환영, 커밋 메시지 컨벤션 지향

## UI/UX 특징

- 알림 헤더(모든 주요 페이지에서 실시간 알림)
- 접근성/반응형/다국어/다크모드 지원
- 명확한 폴더/컴포넌트 분리, 상수/타입 일원화

---
