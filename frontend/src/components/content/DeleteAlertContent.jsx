import React from 'react'

function DeleteAlertContent({ content, onDelete, onCancel }) {
  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-xl font-semibold text-gray-800">Delete Confirmation</h2>
      <p className="text-gray-600 text-center">{content}</p>
      
      <div className="flex gap-4 w-full">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onDelete}
          className="flex-1 px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default DeleteAlertContent