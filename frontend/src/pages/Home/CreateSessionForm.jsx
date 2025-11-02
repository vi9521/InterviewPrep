import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import SpinnerLoader from '../../components/Loaders/SpinnerLoader'
import { useNavigate } from 'react-router-dom'

function CreateSessionForm() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    role: '',
    experience: '',
    topicsToFocus: '',
    description: ''
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // api call to generate questions
      const aiResponse = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTION, {
        role: formData.role,
        experience: formData.experience,
        topicsToFocus: formData.topicsToFocus,
        numberOfQuestions: 10
      })

      const questions = aiResponse.data.data.interviewQuestions

      // api call to crete new session
      const response = await axiosInstance.post(API_PATHS.SESSION.CREATE, {
        ...formData,
        questions
      })

      if(response.data?.data.session?._id){
        navigate(`/interview-prep/${response.data.data.session._id}`)
      }

    } catch (error) {
      toast.error('Failed to create session')
      console.error(error)
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Create New Session</h2>
        <p className="text-gray-600">Set up your practice session with custom parameters</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="role" className="block text-sm font-semibold text-gray-800">
            Role / Position
          </label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 outline-none text-gray-900 placeholder-gray-500"
            placeholder="e.g., Software Engineer, Product Manager"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="experience" className="block text-sm font-semibold text-gray-800">
            Years of Experience
          </label>
          <input
            type="number"
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            min="0"
            max="50"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 outline-none text-gray-900 placeholder-gray-500"
            placeholder="e.g., 3"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="topicsToFocus" className="block text-sm font-semibold text-gray-800">
            Topics to Focus On
          </label>
          <input
            type="text"
            id="topicsToFocus"
            name="topicsToFocus"
            value={formData.topicsToFocus}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 outline-none text-gray-900 placeholder-gray-500"
            placeholder="Data Structures, Algorithms, System Design, Behavioral Questions"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-semibold text-gray-800">
            Session Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 outline-none text-gray-900 placeholder-gray-500 resize-none"
            placeholder="Describe what you want to practice, your goals, and any specific areas you'd like to improve..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transform focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-200 ${loading
            ? 'opacity-70 cursor-not-allowed'
            : 'hover:from-purple-700 hover:to-purple-800 hover:shadow-xl hover:-translate-y-0.5 active:transform active:translate-y-0'
            }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <SpinnerLoader />
            </div>
          ) : (
            'Create Session'
          )}
        </button>
      </form>
    </div>
  )
}

export default CreateSessionForm