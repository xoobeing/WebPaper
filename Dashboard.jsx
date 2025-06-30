import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'
import { 
  Upload, 
  FolderPlus, 
  Search, 
  Filter, 
  FileText, 
  Calendar,
  Tag,
  Eye,
  Edit,
  Trash2,
  Plus
} from 'lucide-react'
import UploadModal from '../components/UploadModal'
import CategoryModal from '../components/CategoryModal'
import { subscribeMyPapers, deletePaper } from '../firebase/paperService'
import PdfViewerModal from '../components/PdfViewerModal'
import EditPaperModal from '../components/EditPaperModal'

function Dashboard() {
  const { currentUser } = useAuth()
  const [papers, setPapers] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pdfModalUrl, setPdfModalUrl] = useState(null)
  const [editPaper, setEditPaper] = useState(null)

  // Firestore에서 내 논문 실시간 구독
  useEffect(() => {
    if (!currentUser) return
    setLoading(true)
    const unsubscribe = subscribeMyPapers(currentUser.uid, (data) => {
      setPapers(data)
      setLoading(false)
    })
    return unsubscribe
  }, [currentUser])

  // 카테고리 동적 추출
  useEffect(() => {
    // 논문에서 카테고리 추출 (중복 제거)
    const cats = Array.from(new Set(papers.map(p => p.category))).map((name, idx) => ({
      id: idx + 1,
      name,
      color: 'bg-blue-100 text-blue-800'
    }))
    setCategories(cats)
  }, [papers])

  if (!currentUser) {
    return <Navigate to="/login" />
  }

  const filteredPapers = papers.filter(paper => {
    const matchesCategory = selectedCategory === 'all' || paper.category === selectedCategory
    const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.authors.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleDeletePaper = async (paper) => {
    if (window.confirm('정말로 이 논문을 삭제하시겠습니까?')) {
      await deletePaper(paper)
    }
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">내 논문 관리</h1>
        <p className="text-gray-600">
          업로드한 논문들을 관리하고 리뷰를 작성하세요.
        </p>
      </div>

      {/* 액션 버튼들 */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => setShowUploadModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Upload className="h-4 w-4" />
          <span>논문 업로드</span>
        </button>
        
        <button
          onClick={() => setShowCategoryModal(true)}
          className="btn-secondary flex items-center space-x-2"
        >
          <FolderPlus className="h-4 w-4" />
          <span>카테고리 추가</span>
        </button>
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
                placeholder="논문 제목이나 저자로 검색..."
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
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || selectedCategory !== 'all' ? '검색 결과가 없습니다' : '아직 업로드된 논문이 없습니다'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedCategory !== 'all' 
                ? '다른 검색어나 카테고리를 시도해보세요' 
                : '첫 번째 논문을 업로드해보세요'
              }
            </p>
            {!searchTerm && selectedCategory === 'all' && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="btn-primary"
              >
                논문 업로드하기
              </button>
            )}
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
                    {paper.isPublic && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        공개
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-2">{paper.authors}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{paper.uploadDate || (paper.createdAt && paper.createdAt.toDate && paper.createdAt.toDate().toLocaleDateString())}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    onClick={() => setPdfModalUrl(paper.fileURL)}
                    disabled={!paper.fileURL}
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                    onClick={() => setEditPaper(paper)}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDeletePaper(paper)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {paper.review && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">리뷰</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {paper.review}
                  </p>
                </div>
              )}

              {paper.keyPoints && paper.keyPoints.length > 0 && (
                <div>
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
            </div>
          ))
        )}
      </div>

      {/* 모달들 */}
      {showUploadModal && (
        <UploadModal 
          onClose={() => setShowUploadModal(false)}
          categories={categories}
          onUpload={() => setShowUploadModal(false)}
        />
      )}

      {showCategoryModal && (
        <CategoryModal
          onClose={() => setShowCategoryModal(false)}
          onAdd={(newCategory) => {
            setCategories([...categories, { ...newCategory, id: Date.now() }])
            setShowCategoryModal(false)
          }}
        />
      )}

      {/* PDF 미리보기 모달 */}
      {pdfModalUrl && (
        <PdfViewerModal fileURL={pdfModalUrl} onClose={() => setPdfModalUrl(null)} />
      )}

      {/* 논문 수정 모달 */}
      {editPaper && (
        <EditPaperModal paper={editPaper} categories={categories} onClose={() => setEditPaper(null)} />
      )}
    </div>
  )
}

export default Dashboard 