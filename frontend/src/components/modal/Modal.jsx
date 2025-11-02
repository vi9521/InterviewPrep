import React from 'react'
import { X } from 'lucide-react'

function Modal({
  children, isOpen, onClose, hideHeader
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-md transition-all duration-300"
        onClick={onClose}
      />

      {/* Modal container */}
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white/95 backdrop-blur-xl p-8 shadow-2xl transition-all duration-300 scale-100 border border-white/20">
          {/* Gradient overlay for extra visual appeal */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-50/50 via-blue-50/30 to-indigo-50/50 pointer-events-none" />

          {/* Close button */}
          {!hideHeader && (
            <button
              onClick={onClose}
              className="absolute right-2 top-3 z-10 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 transition-all duration-200 group"
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
            </button>
          )}

          {/* Content */}
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal