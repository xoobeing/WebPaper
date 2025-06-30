import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { BookOpen, Chrome } from 'lucide-react'

function Login() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      setError('')
      await signInWithGoogle()
      navigate('/dashboard')
    } catch (error) {
      console.error('로그인 실패:', error)
      setError('로그인에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            WebPaper에 로그인
          </h2>
          <p className="text-gray-600">
            논문 정리와 공유를 시작해보세요
          </p>
        </div>

        <div className="card">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-3 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Chrome className="h-5 w-5" />
            )}
            <span>
              {loading ? '로그인 중...' : 'Google로 로그인'}
            </span>
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              로그인하면{' '}
              <a href="/terms" className="text-blue-600 hover:text-blue-500">
                이용약관
              </a>
              과{' '}
              <a href="/privacy" className="text-blue-600 hover:text-blue-500">
                개인정보처리방침
              </a>
              에 동의하는 것으로 간주됩니다.
            </p>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            WebPaper의 주요 기능
          </h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span>논문 PDF 업로드 및 관리</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <span>카테고리별 논문 분류</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <span>리뷰 및 코멘트 작성</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
              <span>다른 연구자들과 지식 공유</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login 