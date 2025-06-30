import { db, storage } from './config'
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

// 논문 업로드 (Storage + Firestore)
export async function uploadPaper({ file, meta, userId }) {
  // Storage에 파일 업로드
  const storageRef = ref(storage, `papers/${userId}/${Date.now()}_${file.name}`)
  await uploadBytes(storageRef, file)
  const fileURL = await getDownloadURL(storageRef)

  // Firestore에 메타데이터 저장
  const docRef = await addDoc(collection(db, 'papers'), {
    ...meta,
    fileURL,
    fileName: file.name,
    fileSize: file.size,
    userId,
    createdAt: new Date()
  })
  return docRef.id
}

// 논문 목록 불러오기 (내 논문만)
export async function fetchMyPapers(userId) {
  const q = query(collection(db, 'papers'), where('userId', '==', userId), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

// 논문 전체 불러오기 (공유 논문)
export async function fetchSharedPapers() {
  const q = query(collection(db, 'papers'), where('isPublic', '==', true), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

// 논문 삭제 (Storage + Firestore)
export async function deletePaper(paper) {
  // Storage 파일 삭제
  if (paper.fileURL) {
    try {
      const fileRef = ref(storage, paper.fileURL)
      await deleteObject(fileRef)
    } catch (e) {
      // 이미 삭제된 경우 무시
    }
  }
  // Firestore 문서 삭제
  await deleteDoc(doc(db, 'papers', paper.id))
}

// 논문 실시간 구독 (내 논문)
export function subscribeMyPapers(userId, callback) {
  const q = query(collection(db, 'papers'), where('userId', '==', userId), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
  })
}

// 논문 실시간 구독 (공유 논문)
export function subscribeSharedPapers(callback) {
  const q = query(collection(db, 'papers'), where('isPublic', '==', true), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
  })
}

// 댓글 추가
export async function addComment(paperId, { userId, userName, userPhoto, content }) {
  const commentsRef = collection(db, 'papers', paperId, 'comments')
  await addDoc(commentsRef, {
    userId,
    userName,
    userPhoto,
    content,
    createdAt: serverTimestamp()
  })
}

// 댓글 실시간 구독
export function subscribeComments(paperId, callback) {
  const q = query(collection(db, 'papers', paperId, 'comments'), orderBy('createdAt', 'asc'))
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
  })
} 