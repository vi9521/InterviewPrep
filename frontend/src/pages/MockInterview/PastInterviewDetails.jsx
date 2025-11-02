import React, { useEffect, useState } from 'react';
import { Calendar, Clock, User, Code, Database, MessageSquare, CheckCircle, AlertCircle, TrendingUp, Target, Lightbulb, LucideArrowLeft, Download, Share, RefreshCw } from 'lucide-react';
import DashboardLayout from '../../components/Layouts/DashboardLayout';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import SpinnerLoader from '../../components/Loaders/SpinnerLoader';

const InterviewDetailsPage = () => {
  const navigate = useNavigate()
  const { interviewId } = useParams()
  const [interviewData, setInterviewData] = useState({});
  const [loading, setLoading] = useState(false)
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [error, setError] = useState('')

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle },
      in_progress: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Clock },
      failed: { color: 'bg-red-100 text-red-800 border-red-200', icon: AlertCircle }
    };

    const config = statusConfig[status] || statusConfig.completed;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold border ${config.color}`}>
        <IconComponent className="w-4 h-4 mr-2" />
        {status?.charAt(0).toUpperCase() + status?.slice(1).replace('_', ' ')}
      </span>
    );
  };

  const generateFeedback = async () => {
    try {
      setFeedbackLoading(true)

      const response = await axiosInstance.post(API_PATHS.INTERVIEW.GENERATE_FEEDBACK(interviewId))

      if (response.data && response.data.data.interviewFeedback) {
        setInterviewData(prev => ({
          ...prev,
          feedback: response.data.data.interviewFeedback
        }))
      }
    } catch (error) {
      setError(error.message)
    }
    finally {
      setFeedbackLoading(false)
    }
  }

  async function getInterviewDetails() {
    try {
      setLoading(true)
      const response = await axiosInstance.get(API_PATHS.INTERVIEW.GET_ONE(interviewId))
      setInterviewData(response.data.data.interview)

    } catch (error) {
      setError(error.message)
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getInterviewDetails()
  }, [interviewId])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
            <p className="text-gray-600 font-medium">Loading interview details...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="bg-white/90 rounded-2xl shadow-xl border border-gray-100 px-8 py-12 flex flex-col items-center">
            <div className="mb-4">
              <svg
                className="w-16 h-16 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#fee2e2" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 9l-6 6m0-6l6 6" stroke="#ef4444" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Failed to load interview details</h2>
            <p className="text-gray-600 mb-6">{error || "An unexpected error occurred. Please try again later."}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow hover:shadow-lg transition-all"
            >
              Retry
            </button>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
            >
              Back to Sessions
            </button>
          </div>
        </div>
      </DashboardLayout>
    )

  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-3 text-gray-600 hover:text-purple-700 mb-8 transition-all duration-200 font-medium"
          >
            <div className="p-2 rounded-xl bg-white shadow-sm group-hover:shadow-md group-hover:bg-purple-50 transition-all duration-200">
              <LucideArrowLeft size={18} />
            </div>
            <span>Back to Sessions</span>
          </button>

          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8 backdrop-blur-sm bg-white/80">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                  Interview Analysis
                </h1>
                <p className="text-gray-600 text-lg">Comprehensive assessment and performance insights</p>
                <div className="mt-4 p-3 bg-gray-50 rounded-lg inline-block">
                  <span className="text-sm font-medium text-gray-500">Session ID: </span>
                  <span className="text-sm font-mono text-gray-800">{interviewData._id}</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                {getStatusBadge(interviewData.status)}
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 mb-8">

            {/* Left Column - Interview Info & Session Details */}
            <div className="xl:col-span-1 space-y-8">
              {/* Interview Information */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl">
                    <User className="w-6 h-6 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Interview Information</h2>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
                    <Code className="w-5 h-5 text-purple-600 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Job Role</p>
                      <p className="font-semibold text-gray-900 text-lg">{interviewData.jobRole}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                    <TrendingUp className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Experience Level</p>
                      <p className="font-semibold text-gray-900 text-lg">{interviewData.experience} years</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                    <MessageSquare className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Interview Type</p>
                      <p className="font-semibold text-gray-900 text-lg capitalize">{interviewData.interviewType}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Session Details */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Session Details</h2>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                    <Calendar className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Started At</p>
                      <p className="font-semibold text-gray-900">{formatDate(interviewData.startTime)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <Clock className="w-5 h-5 text-purple-600 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Ended At</p>
                      <p className="font-semibold text-gray-900">{formatDate(interviewData.endTime)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                    <Database className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Total Questions</p>
                      <p className="font-semibold text-gray-900 text-2xl">{interviewData.totalQuestions}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Focus Topics */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl">
                    <Target className="w-6 h-6 text-amber-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Focus Topics</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {interviewData.topicsToFocus?.split(', ').map((topic, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200 hover:shadow-md transition-shadow duration-200"
                    >
                      {topic.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Feedback & Conversation */}
            <div className="xl:col-span-3 space-y-8">

              {/* AI Assessment Section */}
              {interviewData.feedback ? (
                <div className="space-y-8">
                  {/* Overall Feedback */}
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl">
                        <Lightbulb className="w-6 h-6 text-purple-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">AI Assessment</h2>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 p-6 rounded-2xl">
                      <p className="text-gray-800 leading-relaxed text-lg">
                        {typeof interviewData.feedback === 'string'
                          ? interviewData.feedback
                          : interviewData.feedback.feedback || 'No general feedback available'
                        }
                      </p>
                    </div>
                  </div>

                  {/* Feedback Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Strengths */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl">
                          <TrendingUp className="w-6 h-6 text-emerald-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Strengths</h3>
                      </div>
                      <ul className="space-y-4">
                        {(typeof interviewData.feedback === 'object' && interviewData.feedback.strengths
                          ? interviewData.feedback.strengths
                          : []
                        ).map((strength, index) => (
                          <li key={index} className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-sm text-gray-700 leading-relaxed">{strength}</p>
                          </li>
                        ))}
                      </ul>
                      {(!interviewData.feedback.strengths || interviewData.feedback.strengths.length === 0) && (
                        <p className="text-sm text-gray-500 italic text-center py-8">No strengths identified yet.</p>
                      )}
                    </div>

                    {/* Areas for Improvement */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl">
                          <Target className="w-6 h-6 text-amber-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Areas for Improvement</h3>
                      </div>
                      <ul className="space-y-4">
                        {(typeof interviewData.feedback === 'object' && interviewData.feedback.areasForImprovement
                          ? interviewData.feedback.areasForImprovement
                          : []
                        ).map((area, index) => (
                          <li key={index} className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl">
                            <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-sm text-gray-700 leading-relaxed">{area}</p>
                          </li>
                        ))}
                      </ul>
                      {(!interviewData.feedback.areasForImprovement || interviewData.feedback.areasForImprovement.length === 0) && (
                        <p className="text-sm text-gray-500 italic text-center py-8">No improvement areas identified yet.</p>
                      )}
                    </div>

                    {/* Actionable Advice */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                          <Lightbulb className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Actionable Advice</h3>
                      </div>
                      <ul className="space-y-4">
                        {(typeof interviewData.feedback === 'object' && interviewData.feedback.actionableAdvice
                          ? interviewData.feedback.actionableAdvice
                          : []
                        ).map((advice, index) => (
                          <li key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-sm text-gray-700 leading-relaxed">{advice}</p>
                          </li>
                        ))}
                      </ul>
                      {(!interviewData.feedback.actionableAdvice || interviewData.feedback.actionableAdvice.length === 0) && (
                        <p className="text-sm text-gray-500 italic text-center py-8">No actionable advice available yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl">
                      <Lightbulb className="w-6 h-6 text-amber-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">AI Assessment</h2>
                  </div>
                  <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 border border-amber-200 p-6 rounded-2xl text-center">
                    <p className="text-gray-700 text-lg mb-6">Feedback not generated yet. Complete the interview to see your comprehensive assessment.</p>
                    <button
                      className="group bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer text-lg font-semibold"
                      onClick={generateFeedback}
                    >
                      {feedbackLoading ? (
                        <SpinnerLoader />
                      ) : (
                        <span className="flex items-center gap-2">
                          <Lightbulb className="w-5 h-5" />
                          Generate AI Feedback
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Interview Conversation */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                    <MessageSquare className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Interview Conversation</h2>
                </div>
                <div className="space-y-6 max-h-96 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {interviewData.interviewHistory?.length > 0 ? (
                    interviewData.interviewHistory.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-4xl p-6 rounded-2xl shadow-lg ${message.role === 'user'
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                            : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-900 border border-gray-200'
                            }`}
                        >
                          <div className="flex items-center mb-3">
                            <span className={`text-sm font-semibold ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                              {message.role === 'user' ? '👤 You' : '🤖 AI Interviewer'}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed">
                            {message.parts?.[0]?.text || message.content || 'No content available'}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-12 h-12 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-lg">No conversation history available yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold">
                <Download className="w-5 h-5" />
                Download Report
              </button>
              <button className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold">
                <Share className="w-5 h-5" />
                Share Results
              </button>
              <button className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-2xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold">
                <RefreshCw className="w-5 h-5" />
                Retake Interview
              </button>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default InterviewDetailsPage;