import React, { useState } from 'react'
import { X, FolderPlus, Palette } from 'lucide-react'

function CategoryModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    color: 'bg-blue-100 text-blue-800'
  })

  const colorOptions = [
    { value: 'bg-blue-100 text-blue-800', label: '파란색', preview: 'bg-blue-100' },
    { value: 'bg-green-100 text-green-800', label: '초록색', preview: 'bg-green-100' },
    { value: 'bg-purple-100 text-purple-800', label: '보라색', preview: 'bg-purple-100' },
    { value: 'bg-orange-100 text-orange-800', label: '주황색', preview: 'bg-orange-100' },
    { value: 'bg-red-100 text-red-800', label: '빨간색', preview: 'bg-red-100' },
    { value: 'bg-yellow-100 text-yellow-800', label: '노란색', preview: 'bg-yellow-100' },
    { value: 'bg-pink-100 text-pink-800', label: '분홍색', preview: 'bg-pink-100' },
    { value: 'bg-indigo-100 text-indigo-800', label: '남색', preview: 'bg-indigo-100' }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      alert('카테고리 이름을 입력해주세요.')
      return
    }

    onAdd({
      name: formData.name.trim(),
      color: formData.color
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">카테고리 추가</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              카테고리 이름 *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="input-field"
              placeholder="예: AI/ML, Computer Vision, Data Science"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              색상 선택
            </label>
            <div className="grid grid-cols-4 gap-3">
              {colorOptions.map((color) => (
                <label
                  key={color.value}
                  className={`relative cursor-pointer rounded-lg p-3 border-2 transition-colors ${
                    formData.color === color.value
                      ? 'border-blue-500'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="color"
                    value={color.value}
                    checked={formData.color === color.value}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className={`w-full h-8 rounded ${color.preview} flex items-center justify-center`}>
                    <span className="text-xs font-medium">{color.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={onClose} className="btn-secondary">
              취소
            </button>
            <button type="submit" className="btn-primary">
              추가
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CategoryModal 