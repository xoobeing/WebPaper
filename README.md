# WebCounsel - 논문 정리 플랫폼

논문을 업로드하고 리뷰를 작성하며, 다른 연구자들과 지식을 공유할 수 있는 웹 플랫폼입니다.

## 주요 기능

- 📄 **논문 업로드**: PDF 논문 파일 업로드 및 관리
- 📝 **리뷰 작성**: 논문에 대한 상세한 리뷰와 핵심 포인트 작성
- 🏷️ **카테고리 관리**: 논문을 카테고리별로 분류하고 관리
- 👥 **지식 공유**: 다른 연구자들과 리뷰 공유 및 토론
- 🔐 **Google 로그인**: Firebase Authentication을 통한 안전한 로그인

## 기술 스택

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Icons**: Lucide React
- **Routing**: React Router DOM

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. Firebase 설정

1. [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트를 생성합니다.
2. Authentication에서 Google 로그인을 활성화합니다.
3. Firestore Database를 생성합니다.
4. Storage를 생성합니다.
5. `src/firebase/config.js` 파일에서 Firebase 설정을 업데이트합니다:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
}
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속하여 애플리케이션을 확인할 수 있습니다.

## 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── Navbar.jsx      # 네비게이션 바
│   ├── UploadModal.jsx # 논문 업로드 모달
│   └── CategoryModal.jsx # 카테고리 추가 모달
├── contexts/           # React Context
│   └── AuthContext.jsx # 인증 상태 관리
├── firebase/           # Firebase 설정
│   └── config.js       # Firebase 초기화
├── pages/              # 페이지 컴포넌트
│   ├── Home.jsx        # 홈 페이지
│   ├── Dashboard.jsx   # 내 논문 관리
│   ├── Shared.jsx      # 공유된 논문
│   └── Login.jsx       # 로그인 페이지
├── App.jsx             # 메인 앱 컴포넌트
├── main.jsx            # 앱 진입점
└── index.css           # 전역 스타일
```

## 주요 페이지

### 홈 페이지 (`/`)
- 플랫폼 소개 및 기능 안내
- 로그인/회원가입 안내

### 내 논문 관리 (`/dashboard`)
- 논문 업로드 및 관리
- 카테고리별 분류
- 리뷰 작성 및 편집
- 검색 및 필터링

### 공유된 논문 (`/shared`)
- 다른 사용자가 공유한 논문 탐색
- 리뷰 읽기 및 상호작용
- 카테고리별 필터링

### 로그인 (`/login`)
- Google 계정으로 로그인

## 환경 변수 설정

프로덕션 환경에서는 Firebase 설정을 환경 변수로 관리하는 것을 권장합니다:

```bash
# .env.local
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## 빌드 및 배포

### 빌드

```bash
npm run build
```

### 미리보기

```bash
npm run preview
```

## 기여하기

1. 이 저장소를 포크합니다
2. 새로운 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요. 