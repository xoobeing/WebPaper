import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { BookOpen, Upload, Users, Search, Star } from 'lucide-react'
import { collection, getCountFromServer } from 'firebase/firestore'
import { db } from '../firebase/config'

function Home() {
  const { currentUser } = useAuth()
  const [paperCount, setPaperCount] = useState(0)
  // 리뷰, 사용자, 카테고리 등은 추후 확장 가능

  useEffect(() => {
    async function fetchPaperCount() {
      const coll = collection(db, 'papers')
      const snapshot = await getCountFromServer(coll)
      setPaperCount(snapshot.data().count)
    }
    fetchPaperCount()
  }, [])

  return (
    <div className="max-w-6xl mx-auto">
      {/* 히어로 섹션 */}
      <div className="text-center py-16">
        <div className="mb-8">
          <BookOpen className="h-20 w-20 text-blue-600 mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            WebPaper
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            논문을 업로드하고 리뷰를 작성하며, 다른 연구자들과 지식을 공유하세요.
            연구의 효율성을 높이고 새로운 아이디어를 발견해보세요.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {currentUser ? (
            <Link to="/dashboard" className="btn-primary text-lg px-8 py-3">
              내 논문 관리하기
            </Link>
          ) : (
            <Link to="/login" className="btn-primary text-lg px-8 py-3">
              시작하기
            </Link>
          )}
          <Link to="/shared" className="btn-secondary text-lg px-8 py-3">
            공유된 논문 보기
          </Link>
        </div>
      </div>

      {/* 기능 소개 */}
      <div className="grid md:grid-cols-3 gap-8 py-16">
        <div className="card text-center">
          <Upload className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-3">논문 업로드</h3>
          <p className="text-gray-600">
            PDF 논문을 업로드하고 카테고리별로 정리하세요. 
            간편한 파일 관리로 연구 자료를 체계적으로 보관할 수 있습니다.
          </p>
        </div>

        <div className="card text-center">
          <Search className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-3">리뷰 작성</h3>
          <p className="text-gray-600">
            논문에 대한 상세한 리뷰와 핵심 포인트를 작성하세요. 
            나만의 연구 노트를 만들어 지식을 체계화할 수 있습니다.
          </p>
        </div>

        <div className="card text-center">
          <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-3">지식 공유</h3>
          <p className="text-gray-600">
            다른 연구자들과 리뷰를 공유하고 토론하세요. 
            다양한 관점에서 논문을 바라보며 새로운 인사이트를 얻을 수 있습니다.
          </p>
        </div>
      </div>

      {/* 통계 */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">플랫폼 통계</h2>
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">{paperCount}</div>
            <div className="text-gray-600">업로드된 논문</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600 mb-2">0</div>
            <div className="text-gray-600">작성된 리뷰</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
            <div className="text-gray-600">활성 사용자</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-600 mb-2">0</div>
            <div className="text-gray-600">공유된 카테고리</div>
          </div>
        </div>
      </div>

      {/* CTA 섹션 */}
      <div className="text-center py-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <Star className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-4">지금 시작해보세요</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          연구의 효율성을 높이고, 다른 연구자들과 지식을 공유하며, 
          더 나은 연구 결과를 만들어보세요.
        </p>
        {!currentUser && (
          <Link to="/login" className="btn-primary text-lg px-8 py-3">
            무료로 시작하기
          </Link>
        )}
      </div>
    </div>
  )
}

export default Home 