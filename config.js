import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Firebase 설정 - 실제 프로젝트에서는 환경변수로 관리해야 합니다
const firebaseConfig = {
  apiKey: "AIzaSyADklqVrxNoLAeX7pAGtLL60NlO1aiPJ0s",
  authDomain: "webpaper-da661.firebaseapp.com",
  projectId: "webpaper-da661",
  storageBucket: "webpaper-da661.firebasestorage.app",
  messagingSenderId: "594652831071",
  appId: "1:594652831071:web:1e9454d666e0935bd96aea",
  measurementId: "G-2PNXQXVC76"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig)

// 서비스 내보내기
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app 