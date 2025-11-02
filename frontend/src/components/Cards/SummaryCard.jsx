import React from 'react'
import moment from 'moment'
import { LucideTrash2, Clock, Target, User, FileText } from 'lucide-react'

function SummaryCard({session, onSelect, onDelete}) {
  const getInitials = (role) => {
    return role.split(' ').map(word => word[0]).join('').toUpperCase()
  }

  const getExperienceColor = (years) => {
    if (years <= 2) return 'bg-green-100 text-green-700 border-green-200'
    if (years <= 5) return 'bg-blue-100 text-blue-700 border-blue-200'
    if (years <= 10) return 'bg-purple-100 text-purple-700 border-purple-200'
    return 'bg-orange-100 text-orange-700 border-orange-200'
  }

  const truncateText = (text, maxLength = 80) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  return (
    <div 
      className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-xl hover:border-purple-200 transition-all duration-300 relative overflow-hidden transform hover:-translate-y-1"
      onClick={onSelect}
    >
      {/* Gradient overlay */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600"></div>
      
      {/* Header section */}
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white w-10 h-10 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-base sm:text-lg font-bold shadow-lg group-hover:scale-105 transition-transform duration-200">
            {getInitials(session.role)}
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors duration-200">
              {session.role}
            </h2>
            <div className="flex items-center gap-1 sm:gap-2">
              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border ${getExperienceColor(session.experience)}`}>
                {session.experience} {session.experience === 1 ? 'year' : 'years'}
              </span>
              <span className="flex items-center text-xs text-gray-500">
                <Clock size={12} className="mr-1" />
                {moment(session.createdAt).fromNow()}
              </span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onDelete()
          }}
          className="text-gray-500 hover:text-red-500 hover:bg-red-50 p-1.5 sm:p-2 rounded-lg transition-all duration-200 z-10 relative cursor-pointer"
        >
          <LucideTrash2 size={18} className="sm:w-[22px] sm:h-[22px]" />
        </button>
      </div>

      {/* Content section */}
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-start gap-2 sm:gap-3">
          <Target size={14} className="text-purple-500 mt-0.5 flex-shrink-0 sm:w-4 sm:h-4" />
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-700 mb-0.5 sm:mb-1">Focus Areas</p>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {session.topicsToFocus}
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-2 sm:gap-3">
          <FileText size={14} className="text-purple-500 mt-0.5 flex-shrink-0 sm:w-4 sm:h-4" />
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-700 mb-0.5 sm:mb-1">Description</p>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {truncateText(session.description)}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 sm:mt-5 pt-3 sm:pt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center text-[10px] sm:text-xs text-gray-500">
          <User size={10} className="mr-1 sm:w-3 sm:h-3" />
          <span>Practice Session</span>
        </div>
        <div className="text-[10px] sm:text-xs text-purple-600 font-medium group-hover:text-purple-700">
          Click to start →
        </div>
      </div>

      {/* Subtle background pattern */}
      <div className="absolute -top-4 -right-4 w-16 sm:w-24 h-16 sm:h-24 bg-gradient-to-br from-purple-50 to-pink-50 rounded-full opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
    </div>
  )
}

export default SummaryCard