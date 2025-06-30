import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { subscribeComments, addComment } from '../firebase/paperService'
import { MessageCircle } from 'lucide-react'

function Comments({ paperId, onClose }) {
  const { currentUser } = useAuth()
  const [comments, setComments] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!paperId) return
    const unsubscribe = subscribeComments(paperId, setComments)
    return unsubscribe
  }, [paperId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return
    setLoading(true)
    try {
      await addComment(paperId, {
        userId: currentUser.uid,
        userName: currentUser.displayName,
        userPhoto: currentUser.photoURL,
        content: input.trim()
      })
      setInput('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <MessageCircle className="h-5 w-5" /> 댓글
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {comments.length === 0 ? (
            <div className="text-gray-400 text-center">아직 댓글이 없습니다.</div>
          ) : (
            comments.map(c => (
              <div key={c.id} className="flex items-start gap-3">
                <img src={c.userPhoto} alt="프로필" className="h-8 w-8 rounded-full" />
                <div>
                  <div className="text-sm font-semibold text-gray-800">{c.userName}</div>
                  <div className="text-xs text-gray-500 mb-1">{c.createdAt?.toDate ? c.createdAt.toDate().toLocaleString() : ''}</div>
                  <div className="text-gray-700 text-sm">{c.content}</div>
                </div>
              </div>
            ))
          )}
        </div>
        {currentUser ? (
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 flex gap-2 bg-white">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              className="input-field flex-1"
              placeholder="댓글을 입력하세요"
              disabled={loading}
              maxLength={300}
            />
            <button
              type="submit"
              className="btn-primary px-4"
              disabled={loading || !input.trim()}
            >
              등록
            </button>
          </form>
        ) : (
          <div className="p-4 text-center text-gray-500 text-sm border-t bg-white">로그인한 사용자만 댓글을 작성할 수 있습니다.</div>
        )}
      </div>
    </div>
  )
}

export default Comments 