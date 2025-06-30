import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Users, 
  Calendar, 
  User, 
  Eye,
  ThumbsUp,
  MessageCircle,
  Share2
} from 'lucide-react'
import Comments from '../components/Comments'
import { subscribeSharedPapers } from '../firebase/paperService'
import PdfViewerModal from '../components/PdfViewerModal'

function Shared() {
  const [sharedPapers, setSharedPapers] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [commentsPaperId, setCommentsPaperId] = useState(null)
  const [pdfModalUrl, setPdfModalUrl] = useState(null)

  // Firestore에서 공유 논문 실시간 구독
  useEffect(() => {
    setLoading(true)
    const unsubscribe = subscribeSharedPapers((data) => {
      setSharedPapers(data)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  // 카테고리 동적 추출
  useEffect(() => {
    const cats = Array.from(new Set(sharedPapers.map(p => p.category))).map((name, idx) => ({
      id: idx + 1,
      name,
      color: 'bg-blue-100 text-blue-800'
    }))
    setCategories(cats)
  }, [sharedPapers])

  const filteredPapers = sharedPapers.filter(paper => {
    const matchesCategory = selectedCategory === 'all' || paper.category === selectedCategory
    const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.authors.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleLike = (paperId) => {
    // 좋아요 기능은 Firestore 연동 필요. 임시로 UI만 동작
    setSharedPapers(papers => 
      papers.map(paper => 
        paper.id === paperId 
          ? { ...paper, likes: (paper.likes || 0) + 1 }
          : paper
      )
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">공유된 논문</h1>
        <p className="text-gray-600">
          다른 연구자들이 공유한 논문 리뷰들을 탐색해보세요.
        </p>
      </div>

      {/* 필터 및 검색 */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* 검색 */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="논문 제목, 저자, 리뷰어로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* 카테고리 필터 */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field w-auto"
            >
              <option value="all">모든 카테고리</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 논문 목록 */}
      <div className="grid gap-6">
        {filteredPapers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || selectedCategory !== 'all' ? '검색 결과가 없습니다' : '아직 공유된 논문이 없습니다'}
            </h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory !== 'all' 
                ? '다른 검색어나 카테고리를 시도해보세요' 
                : '첫 번째로 논문을 공유해보세요'
              }
            </p>
          </div>
        ) : (
          filteredPapers.map(paper => (
            <div key={paper.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {paper.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${categories.find(c => c.name === paper.category)?.color || 'bg-gray-100 text-gray-800'}`}>
                      {paper.category}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{paper.authors}</p>
                  {/* 리뷰어 정보, 업로드 날짜 등 필요시 추가 */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{paper.uploadDate || (paper.createdAt && paper.createdAt.toDate && paper.createdAt.toDate().toLocaleDateString())}</span>
                    </div>
                  </div>
                </div>
                {/* 논문 카드 우측 버튼들 */}
                <div className="flex items-center space-x-2">
                  <button
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    onClick={() => setPdfModalUrl(paper.fileURL)}
                    disabled={!paper.fileURL}
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {/* 리뷰 내용 */}
              {paper.review && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">리뷰</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {paper.review}
                  </p>
                </div>
              )}
              {/* 핵심 포인트 */}
              {paper.keyPoints && paper.keyPoints.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">핵심 포인트</h4>
                  <div className="flex flex-wrap gap-2">
                    {paper.keyPoints.map((point, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                      >
                        {point}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {/* 상호작용 버튼 */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-6">
                  <button 
                    onClick={() => handleLike(paper.id)}
                    className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span className="text-sm">{paper.likes || 0}</span>
                  </button>
                  <button
                    className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
                    onClick={() => setCommentsPaperId(paper.id)}
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm">댓글</span>
                  </button>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm">{paper.views || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* 댓글 모달 */}
      {commentsPaperId && (
        <Comments paperId={commentsPaperId} onClose={() => setCommentsPaperId(null)} />
      )}
      {/* PDF 미리보기 모달 */}
      {pdfModalUrl && (
        <PdfViewerModal fileURL={pdfModalUrl} onClose={() => setPdfModalUrl(null)} />
      )}
    </div>
  )
}

export default Shared 