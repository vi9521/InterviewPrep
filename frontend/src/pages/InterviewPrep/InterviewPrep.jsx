import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import DashboardLayout from '../../components/Layouts/DashboardLayout'
import {
  LucideArrowLeft,
  LucidePin,
  LucideMessageCircle,
  LucideChevronDown,
  LucideChevronUp,
  LucideUser,
  LucideTarget,
  LucideCalendar,
  LucideFileText
} from 'lucide-react'
import AiResponseCard from '../../components/Cards/AiResponseCard'
import Explanation from './Explanation'
import Drawer from '../../components/modal/Drawer'
import ExplanationSkeletonLoader from '../../components/Loaders/ExplanationSkeletonLoader'

function InterviewPrep() {
  const { sessionId } = useParams()
  const navigate = useNavigate()

  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expandedQuestions, setExpandedQuestions] = useState({})
  const [animatingQuestions, setAnimatingQuestions] = useState(new Set())

  const [explanationQuestionSelected, setExplanationQuestionSelected] = useState(null)
  const [explanation, setExplanation] = useState(null)
  const [explanationLoading, setExplanationLoading] = useState(false)
  const [openExplainModal, setOpenExplainModal] = useState(false)

  const [loadQuestionsLoading, setLoadQuestionsLoading] = useState(false)


  useEffect(() => {
    fetchSession()
  }, [sessionId])

  const fetchSession = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ONE(sessionId))
      let session = response.data.data.session

      setSession(session)
    } catch (error) {
      toast.error('Failed to fetch session')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Sort questions: pinned first, then by updatedAt (most recent first)
  const sortedQuestions = session?.questions ? [...session.questions].sort((a, b) => {
    // First priority: pinned status
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1

    // Second priority: most recently updated first
    return new Date(b.updatedAt) - new Date(a.updatedAt)
  }) : []

  const toggleQuestion = (questionId) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }))
  }

  const handlePinQuestion = async (questionId) => {
    try {
      // Add animation class
      setAnimatingQuestions(prev => new Set([...prev, questionId]))

      await axiosInstance.post(API_PATHS.QUESTION.PIN(questionId))

      // Wait for animation to complete before updating data
      setTimeout(async () => {
        await fetchSession() // Refresh session data to get updated pin status
        setAnimatingQuestions(prev => {
          const newSet = new Set(prev)
          newSet.delete(questionId)
          return newSet
        })
        toast.success('Question pinned successfully')
      }, 800) // Animation duration

    } catch (error) {
      setAnimatingQuestions(prev => {
        const newSet = new Set(prev)
        newSet.delete(questionId)
        return newSet
      })
      toast.error('Failed to pin question')
    }
  }

  const handleExplainQuestion = async (question) => {
    // Add your explain functionality here
    try {
      setExplanationLoading(true)
      setOpenExplainModal(true)
      setExplanationQuestionSelected(question)

      // api call generate-explaination
      const response = await axiosInstance.post(API_PATHS.AI.GENERATE_EXPLAINATION, {
        question: question
      })

      if (response.data.success) {
        setExplanation(response.data.data.explanation)
      }

      toast.success('Explanation generated successfully')

    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message)
      }
      else {
        toast.error("Something went wrong. Try again")
      }
    } finally {
      setExplanationLoading(false)
    }
  }

  const handleAddQuestionsToSession = async () => {
    try {
      setLoadQuestionsLoading(true)

      // api call to generate questions
      const aiResponse = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTION, {
        role: session.role,
        experience: session.experience,
        topicsToFocus: session.topicsToFocus,
        numberOfQuestions: 5
      })

      const questions = aiResponse.data.data.interviewQuestions

      // api call to add questions to session
      const response = await axiosInstance.post(API_PATHS.QUESTION.ADD_TO_SESSION, {
        sessionId: session._id,
        questions: questions
      })

      if (response.data.success) {
        setSession(prev => ({
          ...prev,
          questions: [...prev.questions, ...questions]
        }))
        toast.success('Added more questions successfully')
      }

    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message)
      }
      else {
        toast.error("Something went wrong. Try again")
      }
    }
    finally {
      setLoadQuestionsLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-screen px-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!session) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-screen px-4">
          <p className="text-gray-500 text-center">Session not found</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-3 sm:p-4 lg:p-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-3 sm:mb-4 transition-colors touch-manipulation"
          >
            <LucideArrowLeft size={20} />
            <span className="text-sm sm:text-base">Back to Sessions</span>
          </button>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-lg sm:text-xl font-bold shrink-0">
                {session.role.split(' ').map(word => word[0]).join('').toUpperCase()}
              </div>

              <div className="flex-1 w-full sm:w-auto">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{session.role}</h1>
                <p className="text-gray-600 mb-4 text-sm sm:text-base">{session.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                    <LucideUser size={16} className="text-purple-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-700">Experience</p>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">{session.experience} years</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                    <LucideTarget size={16} className="text-purple-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-700">Focus Areas</p>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">{session.topicsToFocus}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 sm:col-span-2 lg:col-span-1">
                    <LucideFileText size={16} className="text-purple-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-700">Questions</p>
                      <p className="text-xs sm:text-sm text-gray-600">{session.questions.length} prepared</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Interview Questions</h2>

          {sortedQuestions.map((question, index) => {
            const isAnimating = animatingQuestions.has(question._id)
            const isPinned = question.isPinned

            return (
              <div
                key={question._id}
                className={`bg-white rounded-lg sm:rounded-xl shadow-sm border overflow-hidden transition-all duration-300 ease-in-out ${isPinned
                  ? 'border-yellow-200 shadow-lg ring-2 ring-yellow-100'
                  : 'border-gray-100'
                  } ${isAnimating
                    ? 'transform scale-105 shadow-xl ring-4 ring-yellow-200'
                    : ''
                  }`}
                style={{
                  transform: isAnimating ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >

                {/* Question Header */}
                <div className={`flex items-start sm:items-center justify-between p-4 sm:p-6 ${isPinned ? 'bg-yellow-50' : 'bg-gray-50'} border-b border-gray-100`}>
                  <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm font-semibold shrink-0 ${isPinned
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-purple-100 text-purple-600'
                      }`}>
                      {index + 1}
                    </div>

                    <button
                      onClick={() => toggleQuestion(question._id)}
                      className="flex-1 text-left min-w-0 touch-manipulation"
                    >
                      <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base leading-tight">
                        {question.question}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Tap to {expandedQuestions[question._id] ? 'hide' : 'view'} answer
                      </p>
                    </button>
                  </div>

                  <div className="flex items-center gap-1 sm:gap-2 ml-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePinQuestion(question._id)
                      }}
                      disabled={isAnimating}
                      className={`p-2 rounded-lg transition-all duration-200 touch-manipulation ${isPinned
                        ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200 shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        } ${isAnimating ? 'animate-pulse' : ''
                        }`}
                      title={isPinned ? "Unpin question" : "Pin question"}
                    >
                      <LucidePin
                        size={16}
                        className={`transition-transform duration-200 ${isAnimating ? 'rotate-12' : ''
                          }`}
                      />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleExplainQuestion(question.question)
                      }}
                      className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors touch-manipulation"
                      title="Get explanation"
                    >
                      <LucideMessageCircle size={16} />
                    </button>

                    <button
                      onClick={() => toggleQuestion(question._id)}
                      className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors touch-manipulation"
                    >
                      {expandedQuestions[question._id] ? (
                        <LucideChevronUp size={16} />
                      ) : (
                        <LucideChevronDown size={16} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Answer Section */}
                {expandedQuestions[question._id] && (
                  <div className="">
                    <div
                      className={`rounded-lg p-4 sm:p-6 ${isPinned
                        ? 'bg-gradient-to-r from-yellow-50 to-amber-50'
                        : 'bg-white border border-gray-200'
                        }`}
                    >
                      <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <LucideMessageCircle size={18} className={isPinned ? 'text-yellow-600' : 'text-blue-500'} />
                        Answer
                      </h4>

                      <AiResponseCard
                        text={question.answer}
                      />

                    </div>
                  </div>
                )}

              </div>
            )
          })}
        </div>

        {/* Summary Footer */}
        <div className="mt-8 sm:mt-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white">
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-bold mb-2">Practice Complete!</h3>
            <p className="text-purple-100 mb-4 sm:mb-6 text-sm sm:text-base">
              You've reviewed {session.questions.length} questions for your {session.role} interview preparation.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors touch-manipulation text-sm sm:text-base"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => handleAddQuestionsToSession()}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors border border-purple-400 cursor-pointer flex items-center justify-center gap-2 touch-manipulation text-sm sm:text-base"
                disabled={loadQuestionsLoading}
              >
                {loadQuestionsLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Loading...
                  </>
                ) : (
                  'Load more questions'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Drawer
        isOpen={openExplainModal}
        onClose={() => {
          setOpenExplainModal(false)
        }}
        hideHeader
      >
        {explanationLoading ? <ExplanationSkeletonLoader /> :
          <Explanation
            explanation={explanation}
            question={explanationQuestionSelected}
          />
        }
      </Drawer>
    </DashboardLayout>
  )
}

export default InterviewPrep