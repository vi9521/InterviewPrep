import React from 'react'

function ExplanationSkeletonLoader() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="h-8 w-3/4 bg-gray-300 rounded-lg animate-pulse mb-2"></div>
        <div className="h-4 w-1/2 bg-gray-300 rounded-lg animate-pulse"></div>
      </div>

      {/* Question Section */}
      <div className="mb-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
        <div className="h-6 w-1/4 bg-gray-300 rounded-lg animate-pulse mb-3"></div>
        <div className="h-6 w-3/4 bg-gray-300 rounded-lg animate-pulse"></div>
      </div>

      {/* Explanation Section */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="h-7 w-2/3 bg-gray-300 rounded-lg animate-pulse mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="space-y-2">
                <div className="h-4 w-full bg-gray-300 rounded-lg animate-pulse"></div>
                <div className="h-4 w-5/6 bg-gray-300 rounded-lg animate-pulse"></div>
                <div className="h-4 w-4/6 bg-gray-300 rounded-lg animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExplanationSkeletonLoader