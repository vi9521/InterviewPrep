import React from 'react'
import AiResponseCard from '../../components/Cards/AiResponseCard'
import { LucideBookOpen, LucideMessageCircle } from 'lucide-react'

function Explanation({question, explanation}) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <LucideBookOpen size={20} className="text-purple-500" />
          Question Explanation
        </h1>
        <p className="text-sm sm:text-base text-gray-600">Detailed breakdown of the concept</p>
      </div>

      {/* Question Section */}
      <div className="mb-8 bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <LucideMessageCircle size={18} className="text-blue-500" />
          Question
        </h2>
        <p className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">{question}</p>
      </div>

      {/* Explanation Section */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
            {explanation.title}
          </h3>
          <AiResponseCard text={explanation.explanation} />
        </div>
      </div>
    </div>
  )
}

export default Explanation