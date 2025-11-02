import React from 'react'

function SpinnerLoader() {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      Loading...
    </div>
  )
}

export default SpinnerLoader