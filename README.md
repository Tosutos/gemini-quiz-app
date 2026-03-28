# Gemini Quiz App

제미나이(Gemini)를 활용한 퀴즈/학습용 앱의 기본 저장소입니다.

## 목적
- Gemini Gem 제작에 활용할 수 있는 퀴즈 인터페이스 기반 마련
- 학습 문제를 직접 풀고 피드백을 받는 구조 실험
- 이후 문제 데이터 분리, Gemini API 연결, 배포까지 확장 가능

## 현재 구성
- `src/App.jsx` — 메인 퀴즈 앱 로직
- `src/main.jsx` — React 진입점
- `src/styles.css` — 최소 스타일
- `index.html` — 앱 엔트리
- `package.json` — Vite 기반 실행 설정

## 실행 방법
```bash
npm install
npm run dev
```

## 향후 개선 아이디어
- 문제 데이터를 JSON 파일로 분리
- 카테고리/난이도별 필터 추가
- Gemini API 프롬프트 분리
- 오답노트 기능 추가
- 배포(Vercel/Netlify) 설정

## 참고
현재 코드는 사용자가 제공한 원본을 React/Vite 구조로 정리한 버전입니다.
