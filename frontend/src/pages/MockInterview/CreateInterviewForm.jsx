import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import SpinnerLoader from '../../components/Loaders/SpinnerLoader'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'

function CreateInterviewForm() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    jobRole: '',
    experience: '',
    topicsToFocus: '',
    interviewType: '',
    resumeData: '',
    totalQuestions: ''
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
      // API call to create a new mock interview

      // Validate required fields
      if (
        !formData.jobRole ||
        !formData.experience ||
        !formData.topicsToFocus ||
        !formData.interviewType ||
        !formData.totalQuestions
      ) {
        toast.error('Please fill all required fields')
        setLoading(false)
        return
      }

      // Prepare payload
      const payload = {
        ...formData,
        totalQuestions: Number(formData.totalQuestions),
      }

      // Make API request
      const res = await axiosInstance.post(API_PATHS.INTERVIEW.CREATE, payload)

      if (res.data && res.data.success) {
        toast.success('Interview created successfully!')
        // Optionally, close modal or navigate to the new interview
        navigate(`/interview/mock/${res.data.data.interview._id}`)
      } else {
        toast.error(res.data?.message || 'Failed to create interview')
      }

    } catch (error) {
      toast.error('Failed to create session')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Create New Interview</h2>
        <p className="text-gray-600">Set up your mock interview with custom parameters</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="jobRole" className="block text-sm font-semibold text-gray-800">
            Role / Position
          </label>
          <input
            type="text"
            id="jobRole"
            name="jobRole"
            value={formData.jobRole}
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
            type="text"
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
          <label htmlFor="interviewType" className="block text-sm font-semibold text-gray-800">
            Interview Type
          </label>
          <select
            id="interviewType"
            name="interviewType"
            value={formData.interviewType}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 outline-none text-gray-900"
            required
          >
            <option value="">Select interview type</option>
            <option value="technical">Technical</option>
            <option value="behavioral">Behavioral</option>
            <option value="hr">HR</option>
            <option value="mixed">Mixed</option>
          </select>
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
          <label htmlFor="totalQuestions" className="block text-sm font-semibold text-gray-800">
            Total Questions to Asked
          </label>
          <input
            type="number"
            id="totalQuestions"
            name="totalQuestions"
            value={formData.totalQuestions}
            onChange={handleChange}
            min="0"
            max="50"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 outline-none text-gray-900 placeholder-gray-500"
            placeholder="e.g., 8"
            required
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

export default CreateInterviewForm