import React from 'react'
import { X } from 'lucide-react'

function PdfViewerModal({ fileURL, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">PDF 미리보기</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-auto bg-gray-100 flex items-center justify-center">
          <iframe
            src={fileURL}
            title="PDF 미리보기"
            width="100%"
            height="600px"
            className="border-0 w-full h-[70vh]"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  )
}

export default PdfViewerModal 