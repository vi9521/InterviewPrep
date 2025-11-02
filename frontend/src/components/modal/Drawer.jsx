import React from 'react'
import { X } from 'lucide-react'

function Drawer({
    children, isOpen, onClose, hideHeader
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto container mx-auto">
      {/* Backdrop with blur */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-md transition-all duration-300"
        onClick={onClose}
      />

      {/* Drawer container */}
      <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
        <div className="relative w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white/95 backdrop-blur-xl p-4 sm:p-6 md:p-8 shadow-2xl transition-all duration-300 scale-100 border border-white/20">
          {/* Gradient overlay for extra visual appeal */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-50/50 via-blue-50/30 to-indigo-50/50 pointer-events-none" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-2 sm:right-4 top-2 sm:top-4 z-10 p-1.5 sm:p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 transition-all duration-200 group"
          >
            <span className="sr-only">Close</span>
            <X className="h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-90 transition-transform duration-200" />
          </button>
          
          {/* Content */}
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Drawer