import React, { useState } from 'react'
import { X, Upload, FileText, Tag, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { uploadPaper } from '../firebase/paperService'

function UploadModal({ onClose, categories, onUpload }) {
  const { currentUser } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    category: '',
    review: '',
    keyPoints: '',
    isPublic: false
  })
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
    } else {
      alert('PDF 파일만 업로드 가능합니다.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      alert('PDF 파일을 선택해주세요.')
      return
    }
    if (!formData.title || !formData.authors || !formData.category) {
      alert('필수 항목을 모두 입력해주세요.')
      return
    }
    setLoading(true)
    try {
      await uploadPaper({
        file,
        meta: {
          ...formData,
          keyPoints: formData.keyPoints.split(',').map(point => point.trim()).filter(point => point),
        },
        userId: currentUser.uid
      })
      onUpload()
    } catch (error) {
      console.error('업로드 실패:', error)
      alert('업로드에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">논문 업로드</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PDF 파일 선택
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  {file ? file.name : 'PDF 파일을 선택하거나 여기에 드래그하세요'}
                </p>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              논문 제목 *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="input-field"
              placeholder="논문의 제목을 입력하세요"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              저자 *
            </label>
            <input
              type="text"
              name="authors"
              value={formData.authors}
              onChange={handleInputChange}
              className="input-field"
              placeholder="저자명을 입력하세요"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              카테고리 *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="input-field"
              required
            >
              <option value="">카테고리를 선택하세요</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              리뷰
            </label>
            <textarea
              name="review"
              value={formData.review}
              onChange={handleInputChange}
              rows={4}
              className="input-field"
              placeholder="논문에 대한 리뷰를 작성하세요..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              핵심 포인트
            </label>
            <input
              type="text"
              name="keyPoints"
              value={formData.keyPoints}
              onChange={handleInputChange}
              className="input-field"
              placeholder="핵심 포인트를 쉼표로 구분하여 입력하세요"
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleInputChange}
              id="isPublic"
              className="h-4 w-4 text-blue-600"
            />
            <label htmlFor="isPublic" className="flex items-center space-x-2 text-sm text-gray-700">
              {formData.isPublic ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              <span>다른 사용자들과 공유하기</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={onClose} className="btn-secondary">
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              {loading ? '업로드 중...' : '업로드'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UploadModal 